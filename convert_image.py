from PIL import Image
import os

png_path = "public/assets/team/mukesh-thakur.png"
jpg_path = "public/assets/team/mukesh-thakur.jpg"

if os.path.exists(png_path):
    im = Image.open(png_path)
    rgb_im = im.convert('RGB')
    rgb_im.save(jpg_path)
    print(f"Converted {png_path} to {jpg_path}")
else:
    print(f"File not found: {png_path}")
