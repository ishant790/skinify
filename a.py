import requests
import base64

# Path to the image file
image_path = r"C:\Users\ishan\Downloads\images.jpeg"

# Encode image to base64
with open(image_path, "rb") as image_file:
    encoded_image = base64.b64encode(image_file.read()).decode("utf-8")

# API endpoint URL
api_url = "https//:host.internel.docker:8000/predict"

# JSON payload with base64-encoded image
payload = {"image": encoded_image}

# Send POST request
response = requests.post(api_url, json=payload)

# Print the response
print(response.json())