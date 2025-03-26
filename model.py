from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from typing import List

import tensorflow as tf
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
import numpy as np
import cv2
import base64

app = FastAPI()

labels = [
    'Acne and Rosacea Photos',
    'Actinic Keratosis Basal Cell Carcinoma and other Malignant Lesions',
    'Atopic Dermatitis Photos',
    'Bullous Disease Photos',
    'Cellulitis Impetigo and other Bacterial Infections',
    'Eczema Photos',
    'Exanthems and Drug Eruptions',
    'Hair Loss Photos Alopecia and other Hair Diseases',
    'Herpes HPV and other STDs Photos',
    'Light Diseases and Disorders of Pigmentation',
    'Lupus and other Connective Tissue diseases',
    'Melanoma Skin Cancer Nevi and Moles',
    'Nail Fungus and other Nail Disease',
    'Poison Ivy Photos and other Contact Dermatitis',
    'Psoriasis pictures Lichen Planus and related diseases',
    'Scabies Lyme Disease and other Infestations and Bites',
    'Seborrheic Keratoses and other Benign Tumors',
    'Systemic Disease',
    'Tinea Ringworm Candidiasis and other Fungal Infections',
    'Urticaria Hives',
    'Vascular Tumors',
    'Vasculitis Photos',
    'Warts Molluscum and other Viral Infections'
]

model_path = 'model'
model = tf.keras.models.load_model(model_path)

class ImageRequest(BaseModel):
    image: str  # Base64-encoded image

def preprocess_single_image(img):
    img = cv2.resize(img, (224, 224))
    img = np.expand_dims(img, axis=0)  # Add batch dimension
    return img

def predict_single_image(img):
    # Preprocess the single image
    preprocessed_img = preprocess_single_image(img)

    # Make predictions
    predictions = model.predict(preprocessed_img)

    # Get the index with the highest probability
    argmax_index = np.argmax(predictions, axis=1)
    result = {
        "label": labels[argmax_index[0]]
    }
    return result

@app.post("/predict")
async def predict(request: ImageRequest):
    try:
        # Decode base64 image
        image_data = base64.b64decode(request.image)
        img = cv2.imdecode(np.frombuffer(image_data, np.uint8), -1)

        result = predict_single_image(img)
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing image: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)