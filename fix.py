import re

with open('app/page.tsx', 'r') as f:
    content = f.read()

# 1. Find the LatestInsightsButton function definition
# It starts with "function LatestInsightsButton() {" and ends with a top-level "}"
match = re.search(r'function LatestInsightsButton\(\) \{.*?\n\}\n', content, re.DOTALL)
if not match:
    print("Could not find function")
    exit(1)

func_str = match.group(0)

# 2. Remove it from its current location inside JSX
content = content.replace(func_str, '              <div className="mt-8 mb-4">\n                <LatestInsightsButton />\n              </div>\n')

# 3. Insert it before export default function MRSCoSite() {
insertion_point = 'export default function MRSCoSite() {'
content = content.replace(insertion_point, func_str + '\n' + insertion_point)

with open('app/page.tsx', 'w') as f:
    f.write(content)

print("Fixed app/page.tsx")
