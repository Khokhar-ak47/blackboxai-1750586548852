// api.js - handles API calls to Flask backend

// Send video frame to /predict endpoint
async function sendFrame(frameBlob) {
  const formData = new FormData();
  formData.append('frame', frameBlob, 'frame.jpg');

  try {
    const response = await fetch('/predict', {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error sending frame:', error);
    return null;
  }
}

// Send video file to /upload-predict endpoint
async function uploadVideo(file) {
  const formData = new FormData();
  formData.append('video', file);

  try {
    const response = await fetch('/upload-predict', {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error uploading video:', error);
    return null;
  }
}

// Send sentence to /speak endpoint for TTS
async function speakSentence(sentence) {
  try {
    const response = await fetch('/speak', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sentence }),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    // Assuming backend returns audio stream or URL
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play();
  } catch (error) {
    console.error('Error speaking sentence:', error);
  }
}

// Save sentence to backend /save endpoint
async function saveSentence(sentence) {
  try {
    const response = await fetch('/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sentence }),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error saving sentence:', error);
    return null;
  }
}
