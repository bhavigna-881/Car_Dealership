import json
import os

transcript_path = r"C:\Users\Bhavigna\.gemini\antigravity-ide\brain\1d36d33a-0c33-44f9-992a-f72fc7200f1f\.system_generated\logs\transcript_full.jsonl"
output_path = r"c:\Users\Bhavigna\Downloads\Car-Dealership\PROMPTS.md"

if not os.path.exists(transcript_path):
    print("Transcript not found")
    exit(1)

with open(transcript_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

markdown_content = "# AI Chat Logs (PROMPTS.md)\n\n"

for line in lines:
    try:
        data = json.loads(line)
        step_type = data.get("type")
        content = data.get("content", "")
        
        if step_type == "USER_INPUT":
            # Extract only the actual user request by removing the XML metadata
            if "<USER_REQUEST>" in content and "</USER_REQUEST>" in content:
                req = content.split("<USER_REQUEST>")[1].split("</USER_REQUEST>")[0].strip()
            else:
                req = content.strip()
            
            if req:
                markdown_content += f"## User Prompt\n\n```text\n{req}\n```\n\n"
        
        elif step_type == "PLANNER_RESPONSE":
            if content.strip():
                markdown_content += f"## AI Assistant\n\n{content.strip()}\n\n---\n\n"
                
    except Exception as e:
        continue

with open(output_path, 'w', encoding='utf-8') as out:
    out.write(markdown_content)

print(f"Successfully generated PROMPTS.md at {output_path}")
