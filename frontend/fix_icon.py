from PIL import Image

def make_square():
    input_path = r"C:\Users\parim\.gemini\antigravity-ide\brain\b6096d46-e54b-4afa-a581-830a43c5b090\media__1781465479690.png"
    output_icon = r"C:\Users\parim\aurora-mobile\assets\icon.png"
    output_adaptive = r"C:\Users\parim\aurora-mobile\assets\adaptive-icon.png"
    output_splash = r"C:\Users\parim\aurora-mobile\assets\splash-icon.png"
    
    # Open the official logo
    img = Image.open(input_path).convert("RGBA")
    
    # Create a new 1024x1024 black background
    new_img = Image.new("RGBA", (1024, 1024), (10, 10, 26, 255))
    
    # Calculate position to paste the original logo in the center
    paste_x = (1024 - img.width) // 2
    paste_y = (1024 - img.height) // 2
    
    # Paste the original logo onto the center of the square
    new_img.paste(img, (paste_x, paste_y), img)
    
    # Save as clean, standard PNG files
    new_img.save(output_icon, format="PNG")
    new_img.save(output_adaptive, format="PNG")
    new_img.save(output_splash, format="PNG")
    
    print("Icons successfully fixed and squared!")

if __name__ == "__main__":
    make_square()
