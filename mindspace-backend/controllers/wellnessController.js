const { GoogleGenerativeAI } = require('@google/generative-ai');

const wellnessChat = async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;
    
    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Message is required',
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing!");
      return res.status(500).json({
        success: false,
        message: 'AI service not configured.',
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Changed this line

    const systemPrompt = `You are a compassionate AI Wellness Coach. Provide supportive, empathetic responses focused on mental health. Keep responses concise (2-4 paragraphs). Always prioritize user safety. If someone mentions self-harm or crisis, encourage them to contact emergency services or a crisis helpline immediately.`;

    let conversationText = systemPrompt + '\n\n';
    
    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.forEach(msg => {
        conversationText += `${msg.role === 'user' ? 'User' : 'Coach'}: ${msg.content}\n`;
      });
    }
    
    conversationText += `User: ${message}\nCoach:`;

    try {
      const result = await model.generateContent(conversationText);
      const response = result.response;
      const aiResponse = response.text();

      return res.json({
        success: true,
        response: aiResponse
      });

    } catch (geminiError) {
      console.error("Gemini error:", geminiError.message);
      
      return res.status(503).json({
        success: false,
        message: 'AI service temporarily unavailable',
        fallback: "I'm experiencing technical difficulties. Please try again in a moment."
      });
    }

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = { wellnessChat };