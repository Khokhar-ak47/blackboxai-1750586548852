// webcam.js - handles webcam feed and sending frames to backend for prediction

const video = document.getElementById('webcam');
const detectedLettersContainer = document.getElementById('detected-letters');
const sentenceOutput = document.getElementById('sentence-output');

let stream;
let captureInterval;
let detectedLetters = [];
let sentence = '';

async function startWebcam() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    video.play();
    startCapture();
  } catch (err) {
    console.error('Error accessing webcam:', err);
  }
}

function startCapture() {
  captureInterval = setInterval(captureFrame, 1000); // send frame every 1 second
}

function stopCapture() {
  clearInterval(captureInterval);
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
}

function captureFrame() {
  if (!video.videoWidth || !video.videoHeight) return;

  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  canvas.toBlob(async (blob) => {
    if (!blob) return;
    try {
      const formData = new FormData();
      formData.append('frame', blob, 'frame.jpg');

      const response = await fetch('/predict', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.letter) {
          updateDetectedLetters(data.letter);
        }
        if (data.sentence) {
          updateSentence(data.sentence);
        }
      } else {
        console.error('Prediction request failed');
      }
    } catch (error) {
      console.error('Error sending frame:', error);
    }
  }, 'image/jpeg');
}

function updateDetectedLetters(letter) {
  detectedLetters.push(letter);
  if (detectedLetters.length > 20) {
    detectedLetters.shift();
  }
  detectedLettersContainer.textContent = detectedLetters.join(' ');
}

function updateSentence(newSentence) {
  sentence = newSentence;
  sentenceOutput.value = sentence;
}

function clearAll() {
  detectedLetters = [];
  sentence = '';
  detectedLettersContainer.textContent = '';
  sentenceOutput.value = '';
}

document.getElementById('clear-btn').addEventListener('click', () => {
  clearAll();
});

document.getElementById('save-btn').addEventListener('click', () => {
  if (!sentence) return;
  const blob = new Blob([sentence], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'gesturebridge_translation.txt';
  a.click();
  URL.revokeObjectURL(url);
});

document.getElementById('speak-btn').addEventListener('click', () => {
  if (!sentence) return;
  speakText(sentence);
});

startWebcam();
