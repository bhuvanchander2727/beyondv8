import os
import shutil
from PIL import Image, ImageEnhance, ImageFilter

base_dir = r"c:\Users\venkata kiran\OneDrive\Desktop\Beyond (BE3)"
user_upload_dir = r"C:\Users\venkata kiran\.gemini\antigravity-ide\brain\cc6f1017-425e-43c1-930b-5c8958d6e2ef\.user_uploaded"

model_src = os.path.join(user_upload_dir, "media_1793164097528.png")
store_src = os.path.join(user_upload_dir, "media_1793164177560.jpg")

hero_dir = os.path.join(base_dir, "public", "assets", "hero")
dist_hero_dir = os.path.join(base_dir, "dist", "assets", "hero")
os.makedirs(hero_dir, exist_ok=True)
os.makedirs(dist_hero_dir, exist_ok=True)

print("Loading source images...")
model_img = Image.open(model_src)
store_img = Image.open(store_src)

print(f"Model original size: {model_img.size}")
print(f"Store original size: {store_img.size}")

# 1. Process Desktop Background
# Store image is 1024 x 764.
# We will save the authentic boutique photograph as high quality WebP and JPEG.
# Preserve the authentic architecture, warm lighting, clothing racks, and concrete texture.
store_desktop = store_img.copy()
# Subtle photographic grading: gentle curve to ensure the warm highlights glow softly
# while shadows remain rich and deep for high contrast with dark garments.
enhancer_contrast = ImageEnhance.Contrast(store_desktop)
store_desktop = enhancer_contrast.enhance(1.04)

enhancer_color = ImageEnhance.Color(store_desktop)
store_desktop = enhancer_color.enhance(1.02)

desktop_webp_path = os.path.join(hero_dir, "hero-background.webp")
desktop_jpg_path = os.path.join(hero_dir, "hero-background.jpg")

store_desktop.save(desktop_webp_path, "WEBP", quality=92, method=6)
store_desktop.save(desktop_jpg_path, "JPEG", quality=92)
print(f"Saved desktop background: {desktop_webp_path} ({os.path.getsize(desktop_webp_path)} bytes)")

# 2. Process Mobile Background (Portrait crop for 9:16 / mobile ratios)
# Store image is 1024 wide, 764 high.
# In mobile, we want a composition that showcases the authentic store:
# The illuminated shelving on the left, the textured concrete wall with racks, and the floor.
# A portrait crop centered around the warm boutique interior:
# Width: ~430 to 480, Height: 764
crop_w = int(764 * (9 / 16)) # 429
# Position crop so it captures the warm shelf light on the left and the clothing racks
left_offset = 120 # starts from 120, ends at 120 + 430 = 550
box_mobile = (left_offset, 0, left_offset + crop_w, 764)
store_mobile = store_img.crop(box_mobile)

mobile_webp_path = os.path.join(hero_dir, "hero-background-mobile.webp")
store_mobile.save(mobile_webp_path, "WEBP", quality=92, method=6)
print(f"Saved mobile background: {mobile_webp_path} ({os.path.getsize(mobile_webp_path)} bytes)")

# 3. Process Model Image
# Model is 682 x 1024 with transparent alpha channel.
# Ensure clean alpha, save as PNG and WebP.
model_png_path = os.path.join(hero_dir, "hero-model.png")
model_webp_path = os.path.join(hero_dir, "hero-model.webp")

model_img.save(model_png_path, "PNG", optimize=True)
model_img.save(model_webp_path, "WEBP", quality=95, method=6)
print(f"Saved model PNG: {model_png_path} ({os.path.getsize(model_png_path)} bytes)")
print(f"Saved model WebP: {model_webp_path} ({os.path.getsize(model_webp_path)} bytes)")

# Copy to dist/assets/hero
for fname in ["hero-background.webp", "hero-background.jpg", "hero-background-mobile.webp", "hero-model.png", "hero-model.webp"]:
    src_file = os.path.join(hero_dir, fname)
    dst_file = os.path.join(dist_hero_dir, fname)
    shutil.copy2(src_file, dst_file)
    # Also copy to public/assets root for backward compatibility if referenced
    shutil.copy2(src_file, os.path.join(base_dir, "public", "assets", fname))

print("Asset processing complete!")
