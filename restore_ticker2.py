import subprocess

# 1. Get original content of page.tsx from HEAD
old_content = subprocess.check_output(['git', 'show', 'HEAD:app/page.tsx'], text=True)

# 2. Extract the news ticker
start_marker = '{/* NEWS TICKER */}'
end_marker = '{/* REFINED PROFESSIONAL HERO with Meticulous Advisory Theme */}'

start_idx = old_content.find(start_marker)
end_idx = old_content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print("Could not find ticker in HEAD")
    exit(1)

ticker_code = old_content[start_idx:end_idx]

# 3. Read current page.tsx
with open('app/page.tsx', 'r') as f:
    current_content = f.read()

# 4. Insert ticker_code right before REFINED PROFESSIONAL HERO
if '{/* REFINED PROFESSIONAL HERO' in current_content:
    new_content = current_content.replace('{/* REFINED PROFESSIONAL HERO', ticker_code + '{/* REFINED PROFESSIONAL HERO')
    with open('app/page.tsx', 'w') as f:
        f.write(new_content)
    print("Restored News Ticker!")
else:
    print("Could not find insertion point")

