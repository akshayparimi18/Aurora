import requests
import base64
import os

def test_vision():
    # Use the test image
    image_path = "C:/Users/parim/.gemini/antigravity-ide/brain/b6096d46-e54b-4afa-a581-830a43c5b090/media__1781460888815.jpg"
    
    with open(image_path, "rb") as f:
        img_data = f.read()
    
    files = {'file': ('food.jpg', img_data, 'image/jpeg')}
    
    try:
        response = requests.post("http://127.0.0.1:8000/api/vision", files=files)
        print("Status Code:", response.status_code)
        print("Response Text:", response.text)
    except Exception as e:
        print("Exception:", e)

if __name__ == "__main__":
    test_vision()
