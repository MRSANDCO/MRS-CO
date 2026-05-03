from PIL import Image
import sys

img = Image.open(sys.argv[1])
# The navbar is at the top. Let's sample a pixel around (100, 20)
r, g, b = img.getpixel((100, 20))
print(f"#{r:02x}{g:02x}{b:02x}")
