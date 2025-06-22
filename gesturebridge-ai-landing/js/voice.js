// voice.js - handles text-to-speech and voice command system

function speakText(text) {
  if (!window.speechSynthesis) {
    alert('Speech Synthesis not supported in this browser.');
    return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US'; // default language, can be extended for multilingual
  window.speechSynthesis.speak(utterance);
}

// Voice command system using Web Speech API
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.lang = 'en-US';
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        const command = event.results[i][0].transcript.trim().toLowerCase();
        handleVoiceCommand(command);
      }
    }
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error', event.error);
  };

  recognition.onend = () => {
    // Restart recognition for continuous listening
    recognition.start();
  };

  recognition.start();

  function handleVoiceCommand(command) {
    console.log('Voice command:', command);
    if (command.includes('clear text')) {
      document.getElementById('sentence-output').value = '';
      document.getElementById('detected-letters').textContent = '';
    } else if (command.includes('speak now')) {
      const text = document.getElementById('sentence-output').value;
      if (text) speakText(text);
    }
  }
} else {
  console.warn('Web Speech API not supported in this browser.');
}
