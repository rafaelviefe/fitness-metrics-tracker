import os
import subprocess
import time
import json
from typing import Optional
from google import genai
from google.genai import types
from github import Github, GithubException, Auth

REPO_PATH = "."
DOCS_PATH = os.path.join(REPO_PATH, "docs")
SRC_PATH = os.path.join(REPO_PATH, "src")
TODO_PATH = os.path.join(DOCS_PATH, "todo.md")
ARCH_PATH = os.path.join(DOCS_PATH, "architecture.md")

MAX_RETRIES_PER_ATTEMPT = 3
MAX_ATTEMPTS_PER_TASK = 2

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
            
            clean_line = line.replace(marker, "").strip()
            
            if clean_line.startswith("ID:"):
                clean_line = clean_line[3:].strip()
            
            parts = clean_line.split(":", 1)
            
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
    
    YOUR MISSION:
    Implement ONLY the specific task described in the prompt.
    
    CRITICAL RULES:
    1. SCOPE IS STRICT: You must NOT implement any other tasks from the roadmap, even if they seem obvious or next in line.
    2. ATOMICITY: Output only the files directly required for THIS single task.
    3. STANDARDS: Follow `docs/architecture.md` and `docs/design_system.md`.
    4. TESTING: You MUST write comprehensive Unit Tests (Vitest) for the code you write.
    5. FORMAT: Output purely a JSON object with file paths as keys and content as values.
    
    Constraints:
    - NO Markdown formatting.
    - NO explanations.
    - JSON ONLY.
    """

    if task.get("is_retry"):
        system_instruction += """
        RETRY MODE ACTIVE:
        1. Implement the solution in the SIMPLEST way possible.
        2. Verify imports and variable names.
        3. Focus on PASSING TESTS.
        """

    system_instruction += f"""
    Example Output:
    {{
        "src/features/feature-x/index.ts": "..."
    }}
    """

    user_prompt = f"""
    Context:
    {read_file(ARCH_PATH)}
    
    Current Codebase:
    {get_code_context()}
    
    TASK TO IMPLEMENT: "{task['desc']}"
    
    Implement EXACTLY this task and nothing else.
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
        return json.loads(response.text)
    except Exception as e:
        print(f"Generation Error: {e}")
        return {}

def get_last_task_id() -> int:
    content = read_file(TODO_PATH)
    lines = content.splitlines()
    max_id = 0
    for line in lines:
        if line.strip().startswith("["):
            try:
                clean_line = line.split("]", 1)[1].strip()
                if clean_line.startswith("ID:"):
                    clean_line = clean_line[3:].strip()
                id_part = clean_line.split(":")[0].strip()
                if id_part.isdigit():
                    max_id = max(max_id, int(id_part))
            except:
                continue
    return max_id

def planning_mode():
    print("Entering Planning Mode...")
    
    branch_name = f"plan/roadmap-update-{int(time.time())}"
    run_command("git checkout main")
    run_command("git pull origin main")
    run_command(f"git checkout -b {branch_name}")
    
    last_id = get_last_task_id()
    next_start_id = last_id + 1
    
    current_code = get_code_context()
    
    prompt = f"""
    You are the Lead Technical Architect.
    
    Current Project State (Codebase):
    {current_code}
    
    Your Goal: Define the NEXT 6 atomic, extremely granular development tasks.
    
    STRICT GRANULARITY RULES:
    1. NEVER create a task that involves multiple files or complex logic at once.
    2. Break features down into tiny steps.
    3. Each task must be solvable in a single code generation pass.
    
    FORMATTING RULES:
    1. Start numbering tasks from ID: {next_start_id:03d}.
    2. Output EXACTLY 6 new tasks.
    3. Format strictly as: "[ ] ID: <id>: <Description>" (one per line).
    4. NO Markdown headers, NO intro/outro text.
    """
    
    print("  > Asking AI Architect for new tasks...")
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    
    raw_new_tasks = response.text.strip()
    
    lines = [line.strip() for line in raw_new_tasks.splitlines() if line.strip()]
    formatted_tasks = "\n".join(lines)
    
    new_file_content = f"# Project Roadmap\n\n{formatted_tasks}"
    
    write_file(TODO_PATH, new_file_content)
    
    print(f"  > Generated {len(lines)} new tasks starting from ID {next_start_id:03d}.")
    
    run_command("git add docs/todo.md")
    run_command("git commit -m 'chore: reset roadmap with next cycle tasks'")
    run_command(f"git push origin {branch_name}")
    
    try:
        pr = repo.create_pull(
            title=f"chore: Update Roadmap (Cycle {next_start_id // 6 + 1})",
            body="Planning Cycle Complete.\n\n- Old tasks archived.\n- New atomic tasks generated.",
            head=branch_name,
            base="main"
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
        print(">>> WARNING: This is a RECOVERY ATTEMPT for a previously failed task. <<<")
    
    branch_name = f"feat/{task['id']}-{int(time.time())}"
    
    run_command("git checkout main")
    run_command("git pull origin main")
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
                
                add_success, add_error = run_command("git add .")
                if not add_success:
                    print(f"    Error: Git Add failed.\n{add_error}")
                    return

                commit_success, commit_error = run_command(f"git commit -m 'feat: {task['desc']}' --no-verify")
                if not commit_success:
                    if "nothing to commit" in commit_error:
                        print("    Warning: No changes detected to commit. Skipping PR creation.")
                        return
                    else:
                        print(f"    Error: Git Commit failed.\n{commit_error}")
                        return

                push_success, push_error = run_command(f"git push origin {branch_name}")
                if not push_success:
                    print(f"    Error: Git Push failed.\n{push_error}")
                    return

                try:
                    pr = repo.create_pull(
                        title=f"feat: {task['desc']}",
                        body=f"Implemented by AI Agent.\nTask: {task['id']}",
                        head=branch_name,
                        base="main"
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
    
    print("    Committing failure status...")
    run_command("git add docs/todo.md")
    run_command(f"git commit -m 'chore: mark task {task['id']} as failed'")
    run_command(f"git push origin {branch_name}")

    try:
        pr = repo.create_pull(
            title=f"chore: Mark {task['id']} as Failed",
            body=f"Agent failed to implement task {task['id']} after multiple attempts.",
            head=branch_name,
            base="main"
        )
        pr.enable_automerge(merge_method="SQUASH")
        print(f"    PR Created for Failure Status: {pr.html_url}")
    except GithubException as e:
        print(f"    GitHub API Error: {e}")

if __name__ == "__main__":
    coding_mode()