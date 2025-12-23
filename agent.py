import os
import subprocess
import time
from typing import Optional
from google import genai
from google.genai import types
from github import Github, GithubException, Auth

# --- CONFIGURATION ---
REPO_PATH = "."
DOCS_PATH = os.path.join(REPO_PATH, "docs")
SRC_PATH = os.path.join(REPO_PATH, "src")
TODO_PATH = os.path.join(DOCS_PATH, "todo.md")
ARCH_PATH = os.path.join(DOCS_PATH, "architecture.md")

TARGET_BRANCH = "testing-planning" 

MAX_RETRIES_PER_ATTEMPT = 3
MAX_ATTEMPTS_PER_TASK = 2

# --- CLIENTS ---
client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

auth = Auth.Token(os.environ["GH_TOKEN"])
gh = Github(auth=auth)
repo = gh.get_repo(os.environ["GITHUB_REPOSITORY"])

def run_command(command: str) -> tuple[bool, str]:
    try:
        result = subprocess.run(
            command, shell=True, text=True, capture_output=True, cwd=REPO_PATH
        )
        return result.returncode == 0, result.stdout + "\n" + result.stderr
    except Exception as e:
        return False, str(e)

def read_file(path: str) -> str:
    if os.path.exists(path):
        with open(path, "r") as f:
            return f.read()
    return ""

def write_file(path: str, content: str):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        f.write(content)

def get_next_task() -> Optional[dict]:
    content = read_file(TODO_PATH)
    lines = content.splitlines()
    for i, line in enumerate(lines):
        line_stripped = line.strip()
        if line_stripped.startswith("[ ]") or line_stripped.startswith("[!]"):
            is_retry = line_stripped.startswith("[!]")
            marker = "[!]" if is_retry else "[ ]"
            parts = line.replace(marker, "").strip().split(":", 1)
            if len(parts) == 2:
                return {
                    "id": parts[0].strip(),
                    "desc": parts[1].strip(),
                    "line_idx": i,
                    "is_retry": is_retry
                }
    return None

def update_todo_status(line_idx: int, status: str):
    lines = read_file(TODO_PATH).splitlines()
    current_line = lines[line_idx]
    if "[ ]" in current_line:
        lines[line_idx] = current_line.replace("[ ]", f"[{status}]")
    elif "[!]" in current_line:
        lines[line_idx] = current_line.replace("[!]", f"[{status}]")
    write_file(TODO_PATH, "\n".join(lines))

def get_code_context() -> str:
    context = ""
    for root, _, files in os.walk(SRC_PATH):
        for file in files:
            if file.endswith(('.ts', '.tsx', '.css')):
                path = os.path.join(root, file)
                context += f"\n--- {path} ---\n{read_file(path)}\n"
    return context

def generate_code(task: dict, error_log: str = "") -> dict:
    model_id = "gemini-2.5-flash" 
    
    system_instruction = f"""
    You are a Senior React/Next.js Engineer.
    Your goal is to complete the following task: "{task['desc']}".
    
    Constraints:
    1. STRICTLY follow `docs/architecture.md` (Feature-sliced, SOLID).
    2. USE `docs/design_system.md` for any UI.
    3. You MUST write comprehensive Unit Tests (Vitest) for your code.
    4. Output purely a JSON object with file paths as keys and content as values.
    5. NO Markdown formatting, NO explanations outside the JSON.
    """

    if task.get("is_retry"):
        print("  ! RETRY MODE: Injecting simplification directives.")
        system_instruction += """
        CRITICAL SAFETY DIRECTIVE:
        This task FAILED previously. 
        1. Implement the solution in the SIMPLEST way possible.
        2. Do not attempt complex refactors.
        3. Focus on PASSING TESTS above all else.
        """

    system_instruction += f"""
    Example Output:
    {{
        "src/features/feature-x/index.ts": "...",
        "src/features/feature-x/index.test.ts": "..."
    }}
    """

    user_prompt = f"""
    Context:
    {read_file(ARCH_PATH)}
    Current Codebase:
    {get_code_context()}
    Task: {task['desc']}
    """

    if error_log:
        user_prompt += f"\n\nPREVIOUS ATTEMPT FAILED. Fix these errors:\n{error_log}"

    try:
        response = client.models.generate_content(
            model=model_id,
            contents=user_prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                response_mime_type="application/json"
            )
        )
        import json
        return json.loads(response.text)
    except Exception as e:
        print(f"Generation Error: {e}")
        return {}

def planning_mode():
    print("Entering Planning Mode...")
    
    branch_name = f"plan/roadmap-update-{int(time.time())}"
    # TEST CONFIG: Target the test branch
    run_command(f"git checkout {TARGET_BRANCH}")
    run_command(f"git pull origin {TARGET_BRANCH}")
    run_command(f"git checkout -b {branch_name}")
    
    todo = read_file(TODO_PATH)
    
    prompt = f"""
    You are the Lead Architect. The current cycle is complete.
    1. Review `todo.md` (all tasks checked).
    2. Suggest the next 3-5 logical tasks to evolve the product.
    3. Output strictly a list of tasks in the format: "[ ] ID: Description".
    Current Todo: {todo}
    """
    
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    
    new_tasks = response.text
    write_file(TODO_PATH, todo + "\n\n" + new_tasks)
    
    print("PLANNING: Cycle complete. Roadmap updated.")
    
    run_command("git add docs/todo.md")
    run_command("git commit -m 'chore: update roadmap for next cycle'")
    run_command(f"git push origin {branch_name}")
    
    try:
        pr = repo.create_pull(
            title="chore: Update Roadmap (Planning Mode)",
            body="Cycle complete. New tasks added by AI Architect.",
            head=branch_name,
            base=TARGET_BRANCH # TEST CONFIG: PR against test branch
        )
        pr.enable_automerge(merge_method="SQUASH")
        print(f"    PR Created & Auto-Merge Enabled: {pr.html_url}")
    except GithubException as e:
        print(f"    GitHub API Error: {e}")

def coding_mode():
    task = get_next_task()
    if not task:
        planning_mode()
        return

    print(f"Starting Task: {task['id']} - {task['desc']}")
    if task.get("is_retry"):
        print(">>> WARNING: RECOVERY ATTEMPT <<<")
    
    branch_name = f"feat/{task['id']}-{int(time.time())}"
    
    # TEST CONFIG: Target the test branch
    run_command(f"git checkout {TARGET_BRANCH}")
    run_command(f"git pull origin {TARGET_BRANCH}")
    run_command(f"git checkout -b {branch_name}")

    attempts = 0
    while attempts < MAX_ATTEMPTS_PER_TASK:
        attempts += 1
        print(f"--- Attempt {attempts}/{MAX_ATTEMPTS_PER_TASK} ---")
        
        retries = 0
        last_error = ""
        
        while retries < MAX_RETRIES_PER_ATTEMPT:
            print(f"  > Generation Cycle {retries+1}/{MAX_RETRIES_PER_ATTEMPT}")
            
            files_to_write = generate_code(task, last_error)
            if not files_to_write:
                print("    Error: No code generated.")
                retries += 1
                continue
                
            for path, content in files_to_write.items():
                write_file(path, content)
            
            print("    Running Tests...")
            success, output = run_command("npm run test")
            
            if success:
                print("    Tests Passed!")
                update_todo_status(task["line_idx"], "x")
                
                run_command("git add .")
                run_command(f"git commit -m 'feat: {task['desc']}'")
                run_command(f"git push origin {branch_name}")

                try:
                    pr = repo.create_pull(
                        title=f"feat: {task['desc']}",
                        body=f"Implemented by AI Agent.\nTask: {task['id']}",
                        head=branch_name,
                        base=TARGET_BRANCH # TEST CONFIG: PR against test branch
                    )
                    pr.enable_automerge(merge_method="SQUASH")
                    print(f"    PR Created & Auto-Merge Enabled: {pr.html_url}")
                    return
                except GithubException as e:
                    print(f"    GitHub API Error: {e}")
                    return
            else:
                print("    Tests Failed.")
                last_error = output[-2000:]
                retries += 1
        
        print("  > Reverting changes for this attempt...")
        run_command("git reset --hard HEAD")
        run_command("git clean -fd")
    
    print("CRITICAL: Failed to implement task after multiple attempts.")
    update_todo_status(task["line_idx"], "!")

if __name__ == "__main__":
    coding_mode()