import os
from PIL import Image

def fix_images(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(".png"):
                path = os.path.join(root, file)
                try:
                    with Image.open(path) as img:
                        # If the image was saved with a wrong extension or unsupported format for AAPT2
                        # saving it out again via Pillow explicitly as PNG fixes the file headers!
                        img.convert("RGBA").save(path, format="PNG")
                        print(f"Fixed: {file}")
                except Exception as e:
                    print(f"Error fixing {file}: {e}")

if __name__ == "__main__":
    assets_dir = r"C:\Users\parim\aurora-mobile\assets"
    print(f"Fixing all PNGs in {assets_dir}...")
    fix_images(assets_dir)
    print("All done! Ready to compile.")
