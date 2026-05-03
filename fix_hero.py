import re

with open('app/page.tsx', 'r') as f:
    content = f.read()

# Fix hero container
content = content.replace(
    'className="relative py-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center"',
    'className="relative py-12 lg:py-0 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-72px)] lg:h-[calc(100vh-72px)] flex items-center overflow-hidden lg:overflow-visible"'
)

# Fix heading text size
content = content.replace(
    'className="text-5xl lg:text-7xl font-bold leading-tight mb-6"',
    'className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-4"'
)

# Fix description margin
content = content.replace(
    'className="text-xl text-gray-200 mb-8 leading-relaxed font-light"',
    'className="text-lg lg:text-xl text-gray-200 mb-6 leading-relaxed font-light"'
)

# Fix Buttons margin
content = content.replace(
    'className="flex flex-col sm:flex-row gap-4 mb-10"',
    'className="flex flex-col sm:flex-row gap-4 mb-6"'
)

# Fix LatestInsightsButton wrapper margin
content = content.replace(
    '<div className="mt-8 mb-4">\n                <LatestInsightsButton />\n              </div>',
    '<div className="mt-5 lg:mt-6 mb-2">\n                <LatestInsightsButton />\n              </div>'
)

# Save
with open('app/page.tsx', 'w') as f:
    f.write(content)

print("Hero section adjusted.")
