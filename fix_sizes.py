import re

with open('app/page.tsx', 'r') as f:
    content = f.read()

# For the hero and ticker images (photo-1554224155, photo-1486406146926) we keep 100vw.
# Wait, the warning included photo-1554224155! 
# Let's change ALL sizes="100vw" to sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
# But wait, we shouldn't ruin the hero resolution. 
# Let's replace only for the ones inside the SERVICES SLIDER.
# The services slider images are inside `services` array.

# Let's just do a blanket replace of `sizes="100vw"` with `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"`
# and then specifically fix the hero one back to 100vw if needed. Actually the hero one is photo-1554224155, 
# wait, if Next.js complains about 100vw for hero, it's because of the scrollbar. 
# `sizes="100vw"` is fine, maybe we can just set `sizes="100vw"` for hero and `sizes="(max-width: 768px) 100vw, 50vw"` for services.

# Let's just fix the services slider ones.
# In app/page.tsx, around line 1265:
content = content.replace(
    'sizes="100vw"\n                        className="object-cover transition-transform duration-700',
    'sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"\n                        className="object-cover transition-transform duration-700'
)

# And if there are any others:
content = content.replace(
    'sizes="100vw"\n                      className="object-cover transition-transform duration-700',
    'sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"\n                      className="object-cover transition-transform duration-700'
)

with open('app/page.tsx', 'w') as f:
    f.write(content)

print("Sizes fixed.")
