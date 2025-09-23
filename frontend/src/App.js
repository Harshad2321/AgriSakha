import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

// Try multiple backend URLs in order of preference
const BACKEND_URLS = [
  'https://agrisakha-backend.railway.app',
  'https://agrisakha-backend-production.up.railway.app', 
  'http://localhost:8000'
];

const API_BASE_URL = process.env.REACT_APP_API_URL || BACKEND_URLS[0];

// Weather data (mock for demo)
const WEATHER_DATA = {
  temperature: '28°C',
  humidity: '65%',
  rainfall: '2.5mm',
  windSpeed: '12 km/h',
  conditions: 'Partly Cloudy'
};

// Crop calendar data
const CROP_CALENDAR = {
  'January': ['Wheat sowing', 'Potato harvesting', 'Mustard care'],
  'February': ['Sugarcane planting', 'Wheat irrigation', 'Vegetable harvesting'],
  'March': ['Rice preparation', 'Wheat harvesting begins', 'Summer crop planning'],
  'April': ['Cotton sowing', 'Wheat harvesting', 'Irrigation planning'],
  'May': ['Rice transplanting', 'Summer vegetable care', 'Water management'],
  'June': ['Monsoon crops', 'Rice care', 'Pest monitoring'],
  'July': ['Kharif crops', 'Rice weeding', 'Disease prevention'],
  'August': ['Crop monitoring', 'Fertilizer application', 'Pest control'],
  'September': ['Harvest preparation', 'Rabi planning', 'Storage preparation'],
  'October': ['Kharif harvesting', 'Rabi sowing', 'Wheat preparation'],
  'November': ['Post-harvest', 'Wheat sowing', 'Storage management'],
  'December': ['Winter crops', 'Potato planting', 'Equipment maintenance']
};

function App() {
  const [messages, setMessages] = useState([
    {
      text: "🌾 Welcome to AgriSakha! I'm your smart agriculture assistant. Ask me about crops, pests, fertilizers, irrigation, or upload plant images for analysis.",
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [language, setLanguage] = useState('English');
  const [selectedFile, setSelectedFile] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('checking'); // checking, connected, disconnected
  const [currentApiUrl, setCurrentApiUrl] = useState(API_BASE_URL);
  const [activeTab, setActiveTab] = useState('chat'); // chat, weather, calendar, calculator, tips
  const [cropArea, setCropArea] = useState('');
  const [cropType, setCropType] = useState('');
  const [fertilizerType, setFertilizerType] = useState('');
  const [showQuickActions, setShowQuickActions] = useState(true);

  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Calculate fertilizer requirements
  const calculateFertilizer = () => {
    if (!cropArea || !cropType || !fertilizerType) {
      alert('Please fill all fields for fertilizer calculation');
      return;
    }

    const area = parseFloat(cropArea);
    let recommendation = '';

    // Basic fertilizer calculations based on crop type
    const fertilizerRates = {
      'wheat': { 'NPK': '120-60-40', 'Urea': '260', 'DAP': '130', 'MOP': '67' },
      'rice': { 'NPK': '150-75-75', 'Urea': '326', 'DAP': '163', 'MOP': '125' },
      'corn': { 'NPK': '180-90-60', 'Urea': '391', 'DAP': '196', 'MOP': '100' },
      'cotton': { 'NPK': '120-60-60', 'Urea': '260', 'DAP': '130', 'MOP': '100' },
      'sugarcane': { 'NPK': '300-150-150', 'Urea': '652', 'DAP': '326', 'MOP': '250' }
    };

    const crop = cropType.toLowerCase();
    if (fertilizerRates[crop]) {
      const rate = fertilizerRates[crop][fertilizerType] || fertilizerRates[crop]['NPK'];
      const amount = (parseFloat(rate.split('-')[0] || rate) * area / 100).toFixed(1);
      
      recommendation = `🧮 **Fertilizer Calculation Result:**

**Crop:** ${cropType}
**Area:** ${area} acres
**Fertilizer:** ${fertilizerType}
**Recommended Amount:** ${amount} kg

**Application Schedule:**
- **Basal dose:** 50% at sowing
- **First top dress:** 25% after 30 days
- **Second top dress:** 25% after 60 days

**💡 Tips:**
- Apply during cool hours (morning/evening)
- Ensure adequate soil moisture
- Mix with soil properly
- Follow safety guidelines`;
    } else {
      recommendation = `Fertilizer data not available for ${cropType}. Please consult local agricultural expert.`;
    }

    const calculatorMessage = {
      text: recommendation,
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString(),
      type: 'calculator'
    };

    setMessages(prev => [...prev, calculatorMessage]);
    setActiveTab('chat'); // Switch to chat to see result
  };

  // Quick action handlers
  const handleQuickAction = (action) => {
    const quickResponses = {
      'weather': `🌤️ **Current Weather Conditions:**

**Temperature:** ${WEATHER_DATA.temperature}
**Humidity:** ${WEATHER_DATA.humidity}
**Rainfall:** ${WEATHER_DATA.rainfall}
**Wind Speed:** ${WEATHER_DATA.windSpeed}
**Conditions:** ${WEATHER_DATA.conditions}

**Agricultural Advice:**
- Good conditions for field work
- Ideal humidity for most crops
- Monitor for pest activity
- Plan irrigation accordingly`,

      'pest_alert': `🐛 **Pest Alert System:**

**Current Risk Level:** MODERATE

**Active Pests in Your Region:**
• **Aphids** - Monitor young shoots
• **Bollworm** - Check cotton/tomato crops
• **Stem borer** - Inspect rice/corn stalks

**Prevention Tips:**
- Use yellow sticky traps
- Apply neem oil spray
- Maintain field hygiene
- Scout fields weekly`,

      'market_price': `💰 **Today's Market Prices:**

**Cereals:**
• Wheat: ₹2,150/quintal
• Rice: ₹1,850/quintal
• Corn: ₹1,750/quintal

**Vegetables:**
• Tomato: ₹25/kg
• Onion: ₹35/kg
• Potato: ₹18/kg

**Cash Crops:**
• Cotton: ₹6,200/quintal
• Sugarcane: ₹350/quintal

*Prices may vary by location`,

      'irrigation': `💧 **Smart Irrigation Guide:**

**Today's Recommendation:** LIGHT IRRIGATION

**Soil Moisture:** 45% (Optimal: 50-70%)

**Schedule:**
- **Morning:** 6-8 AM (Best time)
- **Evening:** 5-7 PM (Alternative)

**Water Requirements:**
- Wheat: 450mm total
- Rice: 1200mm total
- Vegetables: 300-600mm

**💡 Water Saving Tips:**
- Use drip irrigation
- Mulch around plants
- Check soil moisture before watering`
    };

    const response = quickResponses[action] || "Feature coming soon!";
    
    const quickMessage = {
      text: response,
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString(),
      type: 'quick_action'
    };

    setMessages(prev => [...prev, quickMessage]);
  };

  const formatMessageText = (text) => {
    // Convert markdown-style formatting to HTML-like formatting
    return text
      .split('\n')
      .map((line, index) => {
        // Handle bold text
        if (line.includes('**')) {
          line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        }
        return <div key={index} dangerouslySetInnerHTML={{ __html: line }} />;
      });
  };

  const checkConnection = async () => {
    // Try each backend URL until one works
    for (const url of BACKEND_URLS) {
      try {
        await axios.get(`${url}/health`, { timeout: 5000 });
        setConnectionStatus('connected');
        setCurrentApiUrl(url);
        console.log(`Connected to backend: ${url}`);
        return true;
      } catch (error) {
        console.warn(`Failed to connect to ${url}:`, error.message);
      }
    }
    
    console.error('All backend connections failed');
    setConnectionStatus('disconnected');
    return false;
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
        switch (event.error) {
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
            errorMessage += `${event.error}`;
        }

        const errorMsg = {
          text: errorMessage,
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString(),
          id: Date.now(),
          isError: true
        };

        setMessages(prev => [...prev, errorMsg]);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, [language]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'English' ? 'Hindi' : 'English');
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      const errorMsg = {
        text: 'Speech recognition is not supported in your browser. Please use Chrome or Edge for voice input.',
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString(),
        id: Date.now(),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      // Update language setting
      recognitionRef.current.lang = language === 'Hindi' ? 'hi-IN' : 'en-US';
      
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        const errorMsg = {
          text: 'Failed to start voice input. Please try again.',
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString(),
          id: Date.now(),
          isError: true
        };
        setMessages(prev => [...prev, errorMsg]);
      }
    }
  };

  const clearConversation = () => {
    setMessages([
      {
        text: "🌾 Welcome to AgriSakha! I'm your smart agriculture assistant. Ask me about crops, pests, fertilizers, irrigation, or upload plant images for analysis.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert(language === 'English' ? 'Please select an image file.' : 'कृपया एक इमेज फ़ाइल चुनें।');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(language === 'English' ? 'File size should be less than 10MB.' : 'फ़ाइल का साइज़ 10MB से कम होना चाहिए।');
        return;
      }

      setSelectedFile(file);
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'Hindi' ? 'hi-IN' : 'en-US';
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if ((!inputText.trim() && !selectedFile) || isLoading) return;

    const userMessage = {
      text: inputText || `[Image: ${selectedFile?.name}]`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
      id: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      let botResponse = '';
      let diseaseData = null;

      if (connectionStatus === 'connected') {
        // Try backend API first
        try {
          if (selectedFile) {
            // Image analysis
            const formData = new FormData();
            formData.append('file', selectedFile);

            const response = await axios.post(`${currentApiUrl}/analyze-image`, formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
              timeout: 30000
            });

            if (response.data) {
              botResponse = response.data.message || response.data.analysis || 'Image analyzed successfully.';
              diseaseData = response.data;
            }
          } else {
            // Text query
            const response = await axios.post(`${currentApiUrl}/chat`, {
              message: inputText,
              language: language
            }, { timeout: 15000 });

            botResponse = response.data.response || response.data.message || 'I received your message.';
          }
        } catch (apiError) {
          console.warn('Backend API failed, falling back to demo mode:', apiError.message);
          setConnectionStatus('disconnected');
          throw new Error('Backend unavailable');
        }
      }

      // Fallback to demo mode
      if (!botResponse || connectionStatus === 'disconnected') {
        // Demo responses for common queries
        const query = inputText.toLowerCase();
        
        if (selectedFile) {
          botResponse = `📸 **Image Analysis Results**

I've analyzed your crop image. Based on the visual examination:

**Detected:** Possible plant stress indicators
**Confidence:** 78%

**Recommendations:**
• Check soil moisture levels
• Inspect for pest damage
• Consider nutrient deficiency testing
• Monitor plant health daily

**Next Steps:**
• Apply balanced fertilizer if needed
• Ensure proper irrigation
• Remove any diseased parts
• Consult local agricultural expert for detailed diagnosis

*Note: This is a demo analysis. For accurate diagnosis, please consult agricultural experts.*`;
        } else if (query.includes('wheat') || query.includes('गेहूं')) {
          botResponse = `🌾 **Wheat Cultivation Guide:**

**Current Season Advice:**
• **Sowing Time:** October-December (Rabi season)
• **Varieties:** HD-2967, PBW-343, WH-147
• **Seed Rate:** 100-125 kg/hectare

**Fertilizer Schedule:**
• **Basal:** 60kg DAP + 30kg MOP per acre
• **Top dressing:** 45kg Urea after 25-30 days
• **Second dose:** 45kg Urea at flowering

**Irrigation:** 4-6 times depending on soil and weather
**Harvest:** April-May when grains are golden

**Current Market Rate:** ₹2,150/quintal`;

        } else if (query.includes('rice') || query.includes('धान')) {
          botResponse = `🌾 **Rice Cultivation Guide:**

**Varieties for Current Season:**
• **Kharif:** IR-64, Swarna, MTU-7029
• **Duration:** 120-140 days
• **Yield Potential:** 6-8 tons/hectare

**Water Management:**
• **Nursery:** 25-30 days old seedlings
• **Transplanting:** June-July
• **Water depth:** 2-5 cm throughout season

**Nutrient Management:**
• **Nitrogen:** 150 kg/hectare (split dose)
• **Phosphorus:** 75 kg/hectare (basal)
• **Potassium:** 75 kg/hectare

**Pest Alert:** Monitor for stem borer and leaf folder`;

        } else if (query.includes('pest') || query.includes('कीट')) {
          botResponse = `🐛 **Integrated Pest Management:**

**Current Pest Alerts:**
• **Aphids:** Use yellow sticky traps
• **Bollworm:** Apply Bt spray
• **Whitefly:** Neem oil application

**Organic Solutions:**
• **Neem oil:** 2ml/liter water
• **Tobacco decoction:** Natural pesticide
• **Marigold:** Companion planting

**Chemical Control (if needed):**
• **Imidacloprid:** For sucking pests
• **Chlorpyrifos:** For soil insects
• **Always follow label instructions**

**Prevention:**
• Regular field monitoring
• Crop rotation
• Beneficial insects conservation`;

        } else if (query.includes('fertilizer') || query.includes('उर्वरक')) {
          botResponse = `🧪 **Fertilizer Management Guide:**

**Soil Testing First!**
• Test N-P-K levels
• Check pH (6.0-7.5 optimal)
• Organic matter content

**Fertilizer Schedule:**
• **Organic:** 5-10 tons FYM/hectare
• **Chemical:** Based on soil test
• **Micronutrients:** Zinc, Boron as needed

**Application Tips:**
• Apply during cool hours
• Ensure soil moisture
• Don't apply before rain
• Mix with soil properly

**Current Prices:**
• Urea: ₹266/bag
• DAP: ₹1,350/bag
• NPK: ₹1,280/bag`;

        } else if (query.includes('irrigation') || query.includes('सिंचाई')) {
          botResponse = `💧 **Smart Irrigation Management:**

**Current Weather:** Good for irrigation
**Soil Moisture:** Check with finger test

**Scheduling:**
• **Wheat:** Every 15-20 days
• **Rice:** Continuous standing water
• **Vegetables:** Every 2-3 days

**Water Saving Techniques:**
• **Drip irrigation:** 40-60% water saving
• **Mulching:** Reduces evaporation
• **Sprinkler:** Good for field crops

**Best Timing:**
• **Morning:** 6-8 AM
• **Evening:** 5-7 PM
• **Avoid:** Mid-day irrigation

**Water Quality:** Check salinity levels`;

        } else if (query.includes('market') || query.includes('price') || query.includes('बाजार')) {
          botResponse = `💰 **Current Market Prices:**

**Grains (per quintal):**
• Wheat: ₹2,150
• Rice: ₹1,850
• Corn: ₹1,750
• Barley: ₹1,650

**Vegetables (per kg):**
• Tomato: ₹25-35
• Onion: ₹30-40
• Potato: ₹15-25
• Cauliflower: ₹20-30

**Cash Crops:**
• Cotton: ₹6,200/quintal
• Sugarcane: ₹350/quintal

**Tips:**
• Check daily rates
• Plan harvesting accordingly
• Consider storage options`;

        } else {
          botResponse = `🌾 **AgriSakha Assistant:**

I'm here to help with your agricultural needs! You can ask me about:

🌱 **Crop Management**
• Sowing schedules and varieties
• Fertilizer recommendations
• Irrigation planning

🐛 **Pest & Disease Control**
• Identification and treatment
• Organic solutions
• Prevention strategies

💰 **Market Information**
• Current prices
• Market trends
• Best selling times

🌤️ **Weather Advisory**
• Irrigation planning
• Pest forecasting
• Field operations

📷 **Image Analysis**
• Upload crop photos for diagnosis
• Disease identification
• Treatment recommendations

Feel free to ask specific questions or upload crop images for analysis!`;
        }
      }

      const botMessage = {
        text: botResponse,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString(),
        id: Date.now() + 1,
        isImageAnalysis: !!selectedFile,
        diseaseData: diseaseData
      };

      setMessages(prev => [...prev, botMessage]);

      // Text-to-speech for bot responses (optional)
      if (language === 'English' && botResponse.length < 200) {
        setTimeout(() => speakText(botResponse), 500);
      }

    } catch (error) {
      console.error('Error:', error);
      
      const errorMessage = {
        text: connectionStatus === 'connected'
          ? 'Sorry, I encountered an error. Please try again or check your connection.'
          : 'Currently in demo mode. You can try sample queries or use the quick actions above.',
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString(),
        id: Date.now() + 1,
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setInputText('');
      setSelectedFile(null);
      // Reset file input
      const fileInput = document.getElementById('file-input');
      if (fileInput) fileInput.value = '';
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
              {connectionStatus === 'connected' && '🟢 AI Mode - Connected'}
              {connectionStatus === 'disconnected' && '🔶 Demo Mode - Try sample queries'}
              {connectionStatus === 'checking' && '🔄 Connecting to AI...'}
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

      {/* Navigation Tabs */}
      <nav className="nav-tabs">
        <button 
          className={`nav-tab ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          💬 Chat
        </button>
        <button 
          className={`nav-tab ${activeTab === 'weather' ? 'active' : ''}`}
          onClick={() => setActiveTab('weather')}
        >
          🌤️ Weather
        </button>
        <button 
          className={`nav-tab ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          📅 Calendar
        </button>
        <button 
          className={`nav-tab ${activeTab === 'calculator' ? 'active' : ''}`}
          onClick={() => setActiveTab('calculator')}
        >
          🧮 Calculator
        </button>
        <button 
          className={`nav-tab ${activeTab === 'tips' ? 'active' : ''}`}
          onClick={() => setActiveTab('tips')}
        >
          💡 Tips
        </button>
      </nav>

      {/* Chat Tab */}
      {activeTab === 'chat' && (
        <div className="chat-container">
          {/* Quick Actions Panel */}
          {showQuickActions && (
            <div className="quick-actions">
              <h3>🚀 Quick Actions</h3>
              <div className="action-buttons">
                <button onClick={() => handleQuickAction('weather')} className="action-btn">
                  🌤️ Weather Update
                </button>
                <button onClick={() => handleQuickAction('pest_alert')} className="action-btn">
                  🐛 Pest Alert
                </button>
                <button onClick={() => handleQuickAction('market_price')} className="action-btn">
                  💰 Market Prices
                </button>
                <button onClick={() => handleQuickAction('irrigation')} className="action-btn">
                  💧 Irrigation Guide
                </button>
              </div>
              <button 
                className="toggle-actions" 
                onClick={() => setShowQuickActions(false)}
                title="Hide quick actions"
              >
                ➖
              </button>
            </div>
          )}

          {!showQuickActions && (
            <button 
              className="show-actions-btn" 
              onClick={() => setShowQuickActions(true)}
              title="Show quick actions"
            >
              ➕ Quick Actions
            </button>
          )}

          {messages.length === 1 && (
            <div className="welcome-message">
              <h2>{language === 'English' ? 'Welcome to AgriSakha!' : 'आग्रीसखा में आपका स्वागत है!'}</h2>
              <p>
                {language === 'English'
                  ? 'Your smart agriculture assistant powered by AI. Ask me about crops, pests, fertilizers, irrigation, or upload crop images for disease detection and analysis.'
                  : 'आपका स्मार्ट कृषि सहायक एआई द्वारा संचालित। मुझसे फसलों, कीटों, उर्वरकों, सिंचाई के बारे में पूछें या रोग का पता लगाने और विश्लेषण के लिए फसल की तस्वीरें अपलोड करें।'
                }
              </p>
              
              <div className="sample-queries">
                <h3>Try these sample queries:</h3>
                <div className="sample-buttons">
                  <button onClick={() => setInputText("What's the best fertilizer for wheat?")}>
                    🌾 Wheat Fertilizer
                  </button>
                  <button onClick={() => setInputText("How to control aphids in cotton?")}>
                    🐛 Pest Control
                  </button>
                  <button onClick={() => setInputText("Best irrigation schedule for rice?")}>
                    💧 Irrigation
                  </button>
                  <button onClick={() => setInputText("Current market price of tomatoes")}>
                    💰 Market Prices
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="chat-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.sender} ${message.isImageAnalysis ? 'image-analysis' : ''}`}>
                <div className="message-content">
                  {message.isImageAnalysis && message.diseaseData ? (
                    <div className="disease-analysis">
                      <div className="analysis-header">
                        <span className="analysis-icon">📸</span>
                        <strong>Image Analysis Results</strong>
                      </div>

                      <div className="analysis-details">
                        <div className="detail-row">
                          <span className="detail-label">📁 File:</span>
                          <span className="detail-value">{message.diseaseData.filename}</span>
                        </div>

                        {message.diseaseData.detected_disease && (
                          <>
                            <div className="detail-row">
                              <span className="detail-label">
                                {message.diseaseData.detected_disease === 'healthy' ? '✅ Status:' : '🔍 Disease Detected:'}
                              </span>
                              <span className={`detail-value ${message.diseaseData.detected_disease === 'healthy' ? 'healthy' : 'disease'}`}>
                                {message.diseaseData.detected_disease === 'healthy'
                                  ? 'Plant appears healthy'
                                  : message.diseaseData.detected_disease.replace(/_/g, ' ').toUpperCase()
                                }
                              </span>
                            </div>

                            <div className="detail-row">
                              <span className="detail-label">📊 Confidence:</span>
                              <span className="detail-value confidence">
                                <div className="confidence-bar">
                                  <div
                                    className="confidence-fill"
                                    style={{ width: `${message.diseaseData.confidence * 100}%` }}
                                  ></div>
                                </div>
                                {(message.diseaseData.confidence * 100).toFixed(1)}%
                              </span>
                            </div>
                          </>
                        )}

                        {message.diseaseData.analysis && (
                          <div className="detail-row analysis-row">
                            <span className="detail-label">🔬 Analysis:</span>
                            <span className="detail-value">{message.diseaseData.analysis}</span>
                          </div>
                        )}

                        {message.diseaseData.recommendations && (
                          <div className="detail-row recommendations-row">
                            <span className="detail-label">💡 Recommendations:</span>
                            <div className="detail-value recommendations">
                              {message.diseaseData.recommendations.split('\n').map((rec, index) => (
                                <div key={index} className="recommendation-item">
                                  {rec.trim() && `• ${rec.trim()}`}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-content">
                      {formatMessageText(message.text)}
                    </div>
                  )}
                </div>
                <div className="message-time">
                  {message.timestamp}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="input-form">
            <div className="input-container">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  language === 'English'
                    ? 'Ask about crops, pests, weather, irrigation, fertilizers...'
                    : 'फसलों, कीटों, मौसम, सिंचाई, उर्वरकों के बारे में पूछें...'
                }
                disabled={isLoading}
                className="text-input"
              />

              <button
                type="button"
                onClick={toggleRecording}
                className={`voice-btn ${isRecording ? 'recording' : ''}`}
                disabled={isLoading}
                title={
                  !('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
                    ? (language === 'English' ? 'Voice input not supported' : 'आवाज़ इनपुट समर्थित नहीं है')
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
      )}

      {/* Weather Tab */}
      {activeTab === 'weather' && (
        <div className="tab-content weather-tab">
          <div className="weather-card">
            <h2>🌤️ Current Weather</h2>
            <div className="weather-info">
              <div className="weather-main">
                <div className="temperature">{WEATHER_DATA.temperature}</div>
                <div className="conditions">{WEATHER_DATA.conditions}</div>
              </div>
              <div className="weather-details">
                <div className="detail-item">
                  <span className="icon">💧</span>
                  <span className="label">Humidity</span>
                  <span className="value">{WEATHER_DATA.humidity}</span>
                </div>
                <div className="detail-item">
                  <span className="icon">🌧️</span>
                  <span className="label">Rainfall</span>
                  <span className="value">{WEATHER_DATA.rainfall}</span>
                </div>
                <div className="detail-item">
                  <span className="icon">💨</span>
                  <span className="label">Wind Speed</span>
                  <span className="value">{WEATHER_DATA.windSpeed}</span>
                </div>
              </div>
            </div>
            <div className="weather-advice">
              <h3>🌾 Agricultural Advice</h3>
              <ul>
                <li>✅ Good conditions for field work</li>
                <li>✅ Ideal humidity for most crops</li>
                <li>⚠️ Monitor for pest activity</li>
                <li>💧 Plan irrigation accordingly</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Tab */}
      {activeTab === 'calendar' && (
        <div className="tab-content calendar-tab">
          <div className="calendar-card">
            <h2>📅 Agricultural Calendar</h2>
            <div className="calendar-grid">
              {Object.entries(CROP_CALENDAR).map(([month, activities]) => (
                <div key={month} className="month-card">
                  <h3>{month}</h3>
                  <ul>
                    {activities.map((activity, index) => (
                      <li key={index}>{activity}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Calculator Tab */}
      {activeTab === 'calculator' && (
        <div className="tab-content calculator-tab">
          <div className="calculator-card">
            <h2>🧮 Fertilizer Calculator</h2>
            <div className="calculator-form">
              <div className="form-group">
                <label>🌾 Crop Type:</label>
                <select value={cropType} onChange={(e) => setCropType(e.target.value)}>
                  <option value="">Select Crop</option>
                  <option value="wheat">Wheat</option>
                  <option value="rice">Rice</option>
                  <option value="corn">Corn</option>
                  <option value="cotton">Cotton</option>
                  <option value="sugarcane">Sugarcane</option>
                </select>
              </div>
              <div className="form-group">
                <label>📏 Area (acres):</label>
                <input
                  type="number"
                  value={cropArea}
                  onChange={(e) => setCropArea(e.target.value)}
                  placeholder="Enter area in acres"
                  min="0"
                  step="0.1"
                />
              </div>
              <div className="form-group">
                <label>🧪 Fertilizer Type:</label>
                <select value={fertilizerType} onChange={(e) => setFertilizerType(e.target.value)}>
                  <option value="">Select Fertilizer</option>
                  <option value="NPK">NPK Complex</option>
                  <option value="Urea">Urea</option>
                  <option value="DAP">DAP</option>
                  <option value="MOP">MOP</option>
                </select>
              </div>
              <button onClick={calculateFertilizer} className="calculate-btn">
                Calculate Requirement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tips Tab */}
      {activeTab === 'tips' && (
        <div className="tab-content tips-tab">
          <div className="tips-grid">
            <div className="tip-card">
              <h3>🌱 Crop Management</h3>
              <ul>
                <li>🌾 Rotate crops to maintain soil health</li>
                <li>💧 Use drip irrigation for water efficiency</li>
                <li>🌿 Apply organic compost regularly</li>
                <li>📏 Maintain proper plant spacing</li>
              </ul>
            </div>
            <div className="tip-card">
              <h3>🐛 Pest Control</h3>
              <ul>
                <li>🔍 Scout fields weekly for pests</li>
                <li>🌿 Use neem oil as natural pesticide</li>
                <li>🟡 Install yellow sticky traps</li>
                <li>🧹 Maintain field cleanliness</li>
              </ul>
            </div>
            <div className="tip-card">
              <h3>💰 Economic Tips</h3>
              <ul>
                <li>📊 Track market prices daily</li>
                <li>🏪 Form farmer groups for bulk buying</li>
                <li>📱 Use government schemes</li>
                <li>💾 Keep detailed farm records</li>
              </ul>
            </div>
            <div className="tip-card">
              <h3>🌤️ Weather Tips</h3>
              <ul>
                <li>📱 Check weather forecasts daily</li>
                <li>☔ Plan operations around rainfall</li>
                <li>🌡️ Monitor temperature for optimal planting</li>
                <li>💨 Consider wind speed for spraying</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;