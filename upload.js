import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import './home.css'; // Import styles
import axios from 'axios'; // Import axios
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const UploadPhoto = () => {
  // State to store the selected file
  const [selectedFile, setSelectedFile] = useState(null);
  // State to store the prediction response
  const [predictionResponse, setPredictionResponse] = useState(null);

  // Function to handle file selection
  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Create FormData object to send file
      const formData = new FormData();
      formData.append('photo', selectedFile);
      // Send POST request to localhost/predict
      const response = await axios.post('http://localhost:5000/upload-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      // Set prediction response
      setPredictionResponse(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const handleUploadURL = async () => {
    const url = prompt('Please enter the URL of the image:');
    if (url) {
      try {
        // Fetch the image from the URL
        const response = await axios.get(url, {
          responseType: 'blob' // Response type is blob
        });
        // Create FormData object to send file
        const formData = new FormData();
        const uploadResponse = await axios.post('http://localhost:5000/upload-photo', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        // Set prediction response
        setPredictionResponse(uploadResponse.data);
      } catch (error) {
        console.error('Error uploading via URL:', error);
      }
    }
  };
  return (
    <div className="home-container">
      <Helmet>
        <title>Upload Photo - Skinfy</title>
        <meta property="og:title" content="Burly Austere Cattle" />
      </Helmet>
      <div className="home-header">
        <header
          data-thq="thq-navbar"
          className="navbarContainer home-navbar-interactive"
        >
          <span className="logo">SKINFY</span>
          <div data-thq="thq-navbar-nav" className="home-desktop-menu">
            <nav className="home-links"></nav>
            <div className="home-buttons">
              <Link to="/login" className="home-login buttonFlat">Login</Link>
              <Link to="/register" className="buttonFilled">Register</Link>
            </div>
          </div>
        </header>
      </div>
      <div className="home-container02">
        <h2 className="home-features-heading heading2">Upload Photo</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="file"
              id="photo"
              name="photo"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <button className="buttonFilled" onClick={() => document.getElementById('photo').click()}>
              Browse
            </button>
          </div>
          <div className="upload-options">
            <button className="buttonFilled" type="submit">Upload</button>
            <button className="buttonFilled" onClick={handleUploadURL}>Upload via URL</button>
          </div>
        </form>
        {predictionResponse && (
          <div className="prediction-response">
            <h3>Prediction Response</h3>
            <pre>{JSON.stringify(predictionResponse, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadPhoto;
