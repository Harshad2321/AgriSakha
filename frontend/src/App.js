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
  
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = language === 'Hindi' ? 'hi-IN' : 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsRecording(false);
      };

      recognitionRef.current.onerror = () => {
        setIsRecording(false);
        alert('Speech recognition error. Please try again.');
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, [language]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      recognitionRef.current.start();
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'Hindi' ? 'hi-IN' : 'en-US';
      utterance.rate = 0.8;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
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
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please try again later.',
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

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <h1>🌾 AgriSakha</h1>
            <span>by Crop Bytes</span>
          </div>
          <button className="language-toggle" onClick={toggleLanguage}>
            {language === 'English' ? '🇮🇳 हिंदी' : '🇺🇸 English'}
          </button>
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
            <input
              type="text"
              className="input-field"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={language === 'English' ? 'Ask about crops, pests, fertilizers...' : 'फसलों, कीटों, उर्वरकों के बारे में पूछें...'}
              disabled={isLoading}
            />
            
            <button
              type="button"
              className={`voice-btn ${isRecording ? 'recording' : ''}`}
              onClick={handleVoiceInput}
              title={language === 'English' ? 'Voice input' : 'आवाज़ इनपुट'}
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