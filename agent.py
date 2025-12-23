import os
import subprocess
import time
import glob
from typing import List, Optional
from google import genai
from google.genai import types
from github import Github, GithubException

# --- CONFIGURATION ---
REPO_PATH = "."
DOCS_PATH = os.path.join(REPO_PATH, "docs")
SRC_PATH = os.path.join(REPO_PATH, "src")
TODO_PATH = os.path.join(DOCS_PATH, "todo.md")
JOURNAL_PATH = os.path.join(DOCS_PATH, "journal.md")
ARCH_PATH = os.path.join(DOCS_PATH, "architecture.md")

# Limits
MAX_RETRIES_PER_ATTEMPT = 3
MAX_ATTEMPTS_PER_TASK = 2

# --- CLIENTS ---
client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
gh = Github(os.environ["GH_TOKEN"])
repo = gh.get_repo(os.environ["GITHUB_REPOSITORY"])

def run_command(command: str) -> tuple[bool, str]:
    """Runs a shell command and returns (success, output)."""
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
    """Parses todo.md to find the first unchecked task."""
    content = read_file(TODO_PATH)
    lines = content.splitlines()
    for i, line in enumerate(lines):
        if line.strip().startswith("[ ]"):
            parts = line.replace("[ ]", "").strip().split(":", 1)
            if len(parts) == 2:
                return {"id": parts[0].strip(), "desc": parts[1].strip(), "line_idx": i}
    return None

def update_todo_status(line_idx: int, status: str):
    """Updates the task status in todo.md."""
    lines = read_file(TODO_PATH).splitlines()
    # status char: 'x' for done, '!' for failed
    lines[line_idx] = lines[line_idx].replace("[ ]", f"[{status}]")
    write_file(TODO_PATH, "\n".join(lines))

def append_journal(entry: str):
    """Logs actions to the journal."""
    date_str = time.strftime("%Y-%m-%d")
    content = read_file(JOURNAL_PATH)
    new_entry = f"\n## {date_str}\n{entry}\n"
    write_file(JOURNAL_PATH, content + new_entry)

def get_code_context() -> str:
    """Concatenates all relevant source files for context."""
    context = ""
    # Limit to src/ and docs/ to save tokens, avoiding node_modules
    for root, _, files in os.walk(SRC_PATH):
        for file in files:
            if file.endswith(('.ts', '.tsx', '.css')):
                path = os.path.join(root, file)
                context += f"\n--- {path} ---\n{read_file(path)}\n"
    return context

def generate_code(task: dict, error_log: str = "") -> dict:
    """Prompts Gemini to implement or fix the task."""
    
    # We use Pro for better reasoning on code structure
    model_id = "gemini-1.5-pro" 
    
    system_instruction = f"""
    You are a Senior React/Next.js Engineer.
    Your goal is to complete the following task: "{task['desc']}".
    
    Constraints:
    1. STRICTLY follow `docs/architecture.md` (Feature-sliced, SOLID).
    2. USE `docs/design_system.md` for any UI.
    3. You MUST write comprehensive Unit Tests (Vitest) for your code.
    4. Output purely a JSON object with file paths as keys and content as values.
    5. NO Markdown formatting, NO explanations outside the JSON.
    
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

    # Enforce JSON schema output for reliability
    response = client.models.generate_content(
        model=model_id,
        contents=user_prompt,
        config=types.GenerateContentConfig(
            system_instruction=system_instruction,
            response_mime_type="application/json"
        )
    )
    
    import json
    try:
        return json.loads(response.text)
    except Exception as e:
        print(f"JSON Parse Error: {e}")
        return {}

def planning_mode():
    """Analyzes the project and generates new tasks."""
    print("Entering Planning Mode...")
    journal = read_file(JOURNAL_PATH)
    todo = read_file(TODO_PATH)
    
    prompt = f"""
    You are the Lead Architect. The current cycle is complete.
    
    1. Analyze the `journal.md` for lessons learned.
    2. Review `todo.md` (all tasks checked).
    3. Suggest the next 3-5 logical tasks to evolve the product.
    4. Output strictly a list of tasks in the format: "[ ] ID: Description".
    
    Journal: {journal}
    Current Todo: {todo}
    """
    
    response = client.models.generate_content(
        model="gemini-1.5-pro",
        contents=prompt
    )
    
    # Append new tasks to todo.md
    new_tasks = response.text
    write_file(TODO_PATH, todo + "\n\n" + new_tasks)
    append_journal("PLANNING: Cycle complete. Roadmap updated.")

def coding_mode():
    task = get_next_task()
    if not task:
        planning_mode()
        return

    print(f"Starting Task: {task['id']} - {task['desc']}")
    
    # Create Feature Branch
    branch_name = f"feat/{task['id']}-{int(time.time())}"
    run_command("git checkout main")
    run_command("git pull origin main")
    run_command(f"git checkout -b {branch_name}")

    attempts = 0
    while attempts < MAX_ATTEMPTS_PER_TASK:
        attempts += 1
        print(f"--- Attempt {attempts}/{MAX_ATTEMPTS_PER_TASK} ---")
        
        # Retry Loop (Coding -> Testing)
        retries = 0
        last_error = ""
        
        while retries < MAX_RETRIES_PER_ATTEMPT:
            print(f"  > Generation Cycle {retries+1}/{MAX_RETRIES_PER_ATTEMPT}")
            
            # 1. Generate Code
            files_to_write = generate_code(task, last_error)
            if not files_to_write:
                print("    Error: No code generated.")
                retries += 1
                continue
                
            # 2. Apply Changes
            for path, content in files_to_write.items():
                write_file(path, content)
            
            # 3. Verify (Test)
            print("    Running Tests...")
            success, output = run_command("npm run test")
            
            if success:
                print("    Tests Passed!")
                # 4. Commit & Push
                run_command("git add .")
                run_command(f"git commit -m 'feat: {task['desc']}'")
                run_command(f"git push origin {branch_name}")
                
                # 5. PR & Auto-Merge
                try:
                    pr = repo.create_pull(
                        title=f"feat: {task['desc']}",
                        body=f"Implemented by AI Agent.\nTask: {task['id']}",
                        head=branch_name,
                        base="main"
                    )
                    pr.enable_automerge(merge_method="squash")
                    print(f"    PR Created & Auto-Merge Enabled: {pr.html_url}")
                    
                    update_todo_status(task["line_idx"], "x")
                    append_journal(f"SUCCESS: Completed {task['id']}. PR: {pr.html_url}")
                    return # Task Done!
                except GithubException as e:
                    print(f"    GitHub API Error: {e}")
                    # If PR fails, we technically succeeded in coding, but failed in ops.
                    # For now, let's count as success locally but log error.
                    return
            else:
                print("    Tests Failed.")
                last_error = output[-2000:] # Keep last 2k chars of error
                retries += 1
        
        # If we exit the retry loop, it means we failed 3 times.
        print("  > Reverting changes for this attempt...")
        run_command("git reset --hard HEAD")
        run_command("git clean -fd")
    
    # If we exit the attempt loop, we failed completely.
    print("CRITICAL: Failed to implement task after multiple attempts.")
    update_todo_status(task["line_idx"], "!")
    append_journal(f"FAILURE: Could not complete {task['id']} after {MAX_ATTEMPTS_PER_TASK} resets.")

if __name__ == "__main__":
    coding_mode()