const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const WELLNESS_COACH_PROMPT = `You are a compassionate AI Wellness Coach. Provide supportive, empathetic responses focused on mental health. Keep responses concise (2-4 paragraphs). Always prioritize user safety.`;

// Get mood-based advice
exports.getMoodAdvice = async (req, res) => {
  try {
    const { mood } = req.body;
    if (!mood) return res.status(400).json({ success: false, error: 'Mood is required' });
    
    if (!process.env.GEMINI_API_KEY) {
      console.error("❌ GEMINI_API_KEY missing");
      return res.status(500).json({ success: false, error: 'Server misconfiguration' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Provide 3 actionable tips for someone feeling ${mood}. Format as JSON array:
    [
      {"text": "tip 1", "category": "mental"},
      {"text": "tip 2", "category": "physical"},
      {"text": "tip 3", "category": "social"}
    ]`;

    let tips = [];
    
    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        tips = JSON.parse(jsonMatch[0]);
      }
    } catch (err) {
      console.error("❌ Gemini API error:", err.message);
    }

    // Fallback tips if API fails
    if (!tips.length) {
      tips = [
        { text: 'Take deep breaths for 5 minutes', category: 'mental' },
        { text: 'Go for a short walk', category: 'physical' },
        { text: 'Call a friend or loved one', category: 'social' }
      ];
    }

    res.json({ success: true, mood, tips, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error("❌ Mood advice error:", error.message);
    res.status(500).json({ success: false, error: 'Failed to generate advice' });
  }
};

// Wellness chat
exports.wellnessChat = async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;
    
    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error("❌ GEMINI_API_KEY missing");
      return res.status(500).json({ success: false, error: 'Server misconfiguration' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    let context = WELLNESS_COACH_PROMPT + '\n\nConversation:\n';
    conversationHistory.forEach(msg => {
      context += `${msg.role === 'user' ? 'User' : 'Coach'}: ${msg.content}\n`;
    });
    context += `User: ${message}\nCoach:`;

    const result = await model.generateContent(context);
    const response = result.response;
    const aiResponse = response.text();

    res.json({ success: true, response: aiResponse, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('❌ Wellness chat error:', error.message);
    
    // Return friendly error message
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process chat',
      message: 'The AI service is temporarily unavailable. Please try again in a moment.'
    });
  }
};

// Health check
exports.healthCheck = (req, res) => {
  const hasApiKey = !!process.env.GEMINI_API_KEY;
  res.json({
    success: true,
    status: 'OK',
    message: 'Wellness API is running',
    apiConfigured: hasApiKey,
    timestamp: new Date().toISOString()
  });
};