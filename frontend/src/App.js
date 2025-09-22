import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [language, setLanguage] = useState('English');
  const [selectedFile, setSelectedFile] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('checking'); // checking, connected, disconnected
  
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Check backend connection
  const checkConnection = async () => {
    try {
      await axios.get(`${API_BASE_URL}/health`, { timeout: 5000 });
      setConnectionStatus('connected');
      return true;
    } catch (error) {
      console.error('Connection check failed:', error);
      setConnectionStatus('disconnected');
      return false;
    }
  };

  // Check connection on mount and periodically
  useEffect(() => {
    checkConnection();
    
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.maxAlternatives = 1;
      recognitionRef.current.lang = language === 'Hindi' ? 'hi-IN' : 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('Speech recognition result:', transcript);
        setInputText(transcript);
        setIsRecording(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        
        let errorMessage = 'Speech recognition error: ';
        switch(event.error) {
          case 'no-speech':
            errorMessage += 'No speech detected. Please speak clearly and try again.';
            break;
          case 'audio-capture':
            errorMessage += 'Microphone not accessible. Please check your microphone.';
            break;
          case 'not-allowed':
            errorMessage += 'Microphone permission denied. Please allow microphone access.';
            break;
          case 'network':
            errorMessage += 'Network error. Please check your internet connection.';
            break;
          case 'aborted':
            // Don't show error for user-initiated stops
            return;
          case 'language-not-supported':
            errorMessage += 'Language not supported. Switching to English.';
            // Auto-switch to English if language not supported
            if (language === 'Hindi') {
              setLanguage('English');
            }
            break;
          default:
            errorMessage += 'Please try again.';
        }
        
        // Only show alert for actual errors, not user actions
        if (event.error !== 'aborted') {
          alert(errorMessage);
        }
      };

      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended');
        setIsRecording(false);
      };

      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started');
        setIsRecording(true);
      };
    } else {
      console.log('Speech recognition not supported');
    }
  }, [language]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleVoiceInput = async () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser. Please try Chrome, Edge, or Safari.');
      return;
    }

    // Check for HTTPS or localhost
    if (window.location.protocol !== 'https:' && 
        window.location.hostname !== 'localhost' && 
        window.location.hostname !== '127.0.0.1') {
      alert('Voice recognition requires HTTPS or localhost. Please use the live demo or run on localhost.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      return;
    } 

    try {
      // Request microphone permission first
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Stop the stream immediately
      
      // Update recognition language based on current language setting
      recognitionRef.current.lang = language === 'Hindi' ? 'hi-IN' : 'en-US';
      
      setIsRecording(true);
      recognitionRef.current.start();
    } catch (error) {
      console.error('Microphone permission error:', error);
      let errorMessage = 'Microphone access denied. ';
      
      if (error.name === 'NotAllowedError') {
        errorMessage += 'Please allow microphone access in your browser settings and try again.';
      } else if (error.name === 'NotFoundError') {
        errorMessage += 'No microphone found. Please connect a microphone and try again.';
      } else if (error.name === 'NotSupportedError') {
        errorMessage += 'Microphone access is not supported in this context.';
      } else {
        errorMessage += 'Please check your microphone settings and try again.';
      }
      
      alert(errorMessage);
      setIsRecording(false);
    }
  };

  const speakText = (text) => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in your browser.');
      return;
    }

    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'Hindi' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Handle speech synthesis events
    utterance.onstart = () => {
      console.log('Speech started');
    };
    
    utterance.onend = () => {
      console.log('Speech ended');
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      if (event.error === 'not-allowed') {
        alert('Speech synthesis blocked. Please check your browser settings.');
      }
    };
    
    // For some browsers, we need to wait for voices to load
    const speakWhenReady = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        // Try to find a voice for the selected language
        const preferredVoice = voices.find(voice => 
          voice.lang.startsWith(language === 'Hindi' ? 'hi' : 'en')
        );
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
        window.speechSynthesis.speak(utterance);
      } else {
        // Fallback: speak without specific voice
        window.speechSynthesis.speak(utterance);
      }
    };
    
    if (window.speechSynthesis.getVoices().length > 0) {
      speakWhenReady();
    } else {
      window.speechSynthesis.onvoiceschanged = speakWhenReady;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputText.trim() && !selectedFile) return;

    const userMessage = {
      id: Date.now(),
      text: inputText || `Uploaded image: ${selectedFile?.name}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      let response;
      
      if (selectedFile) {
        // Handle image upload
        const formData = new FormData();
        formData.append('file', selectedFile);
        
        response = await axios.post(`${API_BASE_URL}/upload-image`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        const botMessage = {
          id: Date.now() + 1,
          text: `Image Analysis: ${response.data.analysis}\\n\\nRecommendations: ${response.data.recommendations}`,
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString()
        };
        
        setMessages(prev => [...prev, botMessage]);
        speakText(botMessage.text);
        
      } else {
        // Handle text query
        response = await axios.post(`${API_BASE_URL}/advisory`, {
          query: inputText,
          location: 'Delhi', // Default location
          language: language
        });

        const botMessage = {
          id: Date.now() + 1,
          text: response.data.advice,
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString()
        };

        setMessages(prev => [...prev, botMessage]);
        speakText(response.data.advice);
      }
      
    } catch (error) {
      console.error('Error:', error);
      let errorText = 'Sorry, I encountered an error. ';
      
      if (error.response) {
        // Server responded with error status
        errorText += `Server error: ${error.response.status}. `;
        if (error.response.status === 404) {
          errorText += 'Backend service not found. Please check if the server is running.';
        } else if (error.response.status >= 500) {
          errorText += 'Server is currently unavailable. Please try again later.';
        }
      } else if (error.request) {
        // Network error
        errorText += 'Cannot connect to server. Please check your internet connection and ensure the backend is running.';
      } else {
        // Other error
        errorText += 'Please try again later.';
      }
      
      const errorMessage = {
        id: Date.now() + 1,
        text: errorText,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setInputText('');
      setSelectedFile(null);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
    } else {
      alert('Please select a valid image file.');
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'English' ? 'Hindi' : 'English');
  };

  const clearConversation = () => {
    if (window.confirm(language === 'English' ? 'Clear conversation history?' : 'बातचीत का इतिहास साफ़ करें?')) {
      setMessages([]);
      setInputText('');
      setSelectedFile(null);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <h1>🌾 AgriSakha</h1>
            <span>by Crop Bytes</span>
          </div>
          <div className="header-right">
            <div className={`connection-status ${connectionStatus}`}>
              {connectionStatus === 'connected' && '🟢 Online'}
              {connectionStatus === 'disconnected' && '🔴 Offline'}
              {connectionStatus === 'checking' && '🟡 Checking...'}
            </div>
            {messages.length > 0 && (
              <button className="clear-btn" onClick={clearConversation} title={language === 'English' ? 'Clear conversation' : 'बातचीत साफ़ करें'}>
                🗑️
              </button>
            )}
            <button className="language-toggle" onClick={toggleLanguage}>
              {language === 'English' ? '🇮🇳 हिंदी' : '🇺🇸 English'}
            </button>
          </div>
        </div>
      </header>

      <div className="chat-container">
        {messages.length === 0 && (
          <div className="welcome-message">
            <h2>{language === 'English' ? 'Welcome to AgriSakha!' : 'आग्रीसखा में आपका स्वागत है!'}</h2>
            <p>
              {language === 'English' 
                ? 'Your smart agriculture assistant. Ask me about crops, pests, fertilizers, irrigation, or upload crop images for analysis.'
                : 'आपका स्मार्ट कृषि सहायक। मुझसे फसलों, कीटों, उर्वरकों, सिंचाई के बारे में पूछें या विश्लेषण के लिए फसल की तस्वीरें अपलोड करें।'
              }
            </p>
          </div>
        )}

        <div className="chat-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.sender}`}>
              <div className="message-content">
                {message.text}
                <div className="message-time">{message.timestamp}</div>
              </div>
              {message.sender === 'bot' && (
                <button 
                  className="speak-btn"
                  onClick={() => speakText(message.text)}
                  title="Listen to response"
                >
                  🔊
                </button>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="message bot">
              <div className="message-content">
                <div className="loading">
                  <span>{language === 'English' ? 'AgriSakha is thinking' : 'आग्रीसखा सोच रहा है'}</span>
                  <div className="loading-dots">
                    <div className="loading-dot"></div>
                    <div className="loading-dot"></div>
                    <div className="loading-dot"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="input-container" onSubmit={handleSubmit}>
          <div className="input-row">
            <textarea
              className="input-field"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder={language === 'English' ? 'Ask about crops, pests, fertilizers... (Press Enter to send, Shift+Enter for new line)' : 'फसलों, कीटों, उर्वरकों के बारे में पूछें... (भेजने के लिए Enter दबाएं, नई लाइन के लिए Shift+Enter)'}
              disabled={isLoading}
              rows={inputText.split('\n').length}
              style={{ minHeight: '40px', maxHeight: '120px', resize: 'none' }}
            />
            
            <button
              type="button"
              className={`voice-btn ${isRecording ? 'recording' : ''}`}
              onClick={handleVoiceInput}
              disabled={connectionStatus === 'disconnected'}
              title={
                connectionStatus === 'disconnected' 
                  ? (language === 'English' ? 'Voice input unavailable (offline)' : 'आवाज़ इनपुट उपलब्ध नहीं (ऑफलाइन)')
                  : isRecording 
                    ? (language === 'English' ? 'Stop recording' : 'रिकॉर्डिंग बंद करें')
                    : (language === 'English' ? 'Start voice input' : 'आवाज़ इनपुट शुरू करें')
              }
              data-tooltip={
                isRecording 
                  ? (language === 'English' ? 'Recording...' : 'रिकॉर्ड हो रहा है...')
                  : (language === 'English' ? 'Voice Input' : 'आवाज़ इनपुट')
              }
            >
              {isRecording ? '⏹️' : '🎤'}
            </button>
            
            <button
              type="submit"
              className="send-btn"
              disabled={isLoading || (!inputText.trim() && !selectedFile)}
              title={language === 'English' ? 'Send message' : 'संदेश भेजें'}
            >
              📤
            </button>
          </div>

          <div className="file-upload">
            <input
              type="file"
              id="file-input"
              className="file-input"
              accept="image/*"
              onChange={handleFileSelect}
            />
            <label htmlFor="file-input" className="file-label">
              📷 {selectedFile ? selectedFile.name : (language === 'English' ? 'Upload Crop Image' : 'फसल की तस्वीर अपलोड करें')}
            </label>
            {selectedFile && (
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                style={{ background: '#f44336', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '5px', cursor: 'pointer' }}
              >
                ❌
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;