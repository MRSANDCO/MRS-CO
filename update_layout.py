import re

with open('app/page.tsx', 'r') as f:
    content = f.read()

# 1. Update Navbar Color
content = content.replace(
    'className="sticky top-0 z-[100] bg-white/75 backdrop-blur-xl border-b border-white/40 shadow-sm transition-all duration-300"',
    'className="sticky top-0 z-[100] bg-[#e2e8f0] border-b border-slate-300 shadow-sm transition-all duration-300"'
)

# 2. Extract News Ticker
start_marker = '{/* NEWS TICKER */}'
end_marker = '{/* REFINED PROFESSIONAL HERO with Meticulous Advisory Theme */}'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    ticker_code = content[start_idx:end_idx]
    
    # remove ticker from its current position
    content = content[:start_idx] + content[end_idx:]
    
    # find where to insert it. The user said "between about us and hero section".
    # Hero section ends with `</section>`. Let's find the end of the Hero section.
    # The next section after Hero is `<BlogSection />` or `SERVICES SLIDER`.
    # But wait, what if they meant between the 'About Us' section and the 'Hero' section?
    # Let's just insert it right after the Hero section for now.
    
    # Let's find `id="about"`
    about_idx = content.find('<section id="about"')
    if about_idx != -1:
        # Insert ticker right before the About section!
        # "between about us and hero section" could mean right above the About section.
        # Let's place it right before `{/* ABOUT SECTION`
        about_header_idx = content.rfind('{/* ABOUT SECTION', 0, about_idx)
        if about_header_idx != -1:
            content = content[:about_header_idx] + ticker_code + content[about_header_idx:]
            print("Moved ticker before About section.")
        else:
            print("Could not find about header")
    else:
        print("Could not find About section.")

with open('app/page.tsx', 'w') as f:
    f.write(content)

print("Updates applied.")
