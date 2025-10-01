const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const WELLNESS_COACH_PROMPT = `You are a compassionate AI Wellness Coach. Provide supportive, empathetic responses focused on mental health. Keep responses concise (2-4 paragraphs). Always prioritize user safety.`;

// Get mood-based advice
exports.getMoodAdvice = async (req, res) => {
  try {
    const { mood } = req.body;

    if (!mood) {
      return res.status(400).json({ success: false, error: 'Mood is required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Provide 3 actionable tips for someone feeling ${mood}. Format as JSON array:
    [
      {"text": "tip 1", "category": "mental"},
      {"text": "tip 2", "category": "physical"},
      {"text": "tip 3", "category": "social"}
    ]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    let tips = [];
    
    if (jsonMatch) {
      tips = JSON.parse(jsonMatch[0]);
    }

    res.json({ success: true, mood, tips, timestamp: new Date().toISOString() });

  } catch (error) {
    console.error('Error:', error);
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

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    let context = WELLNESS_COACH_PROMPT + '\n\nConversation:\n';
    conversationHistory.forEach(msg => {
      context += `${msg.role === 'user' ? 'User' : 'Coach'}: ${msg.content}\n`;
    });
    context += `User: ${message}\nCoach:`;

    const result = await model.generateContent(context);
    const response = await result.response;
    const aiResponse = response.text();

    res.json({ success: true, response: aiResponse, timestamp: new Date().toISOString() });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: 'Failed to process chat' });
  }
};

// Health check
exports.healthCheck = (req, res) => {
  res.json({ 
    success: true,
    status: 'OK', 
    message: 'Wellness API is running',
    timestamp: new Date().toISOString()
  });
};