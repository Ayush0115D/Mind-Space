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
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 🔹 Detect if user wants detailed or short response
    const wantsDetailed = /tell me in detail|explain more|please elaborate/i.test(message);

    // 🧠 Adaptive system prompt
    const systemPrompt = `
You are "MindSpace AI" — a deeply empathetic and intelligent AI coach.

Your expertise covers both **mental health** and **general wellness**. Adjust the depth of your response based on user preference:

- If the user asks to "tell in detail" or "explain more", give **deep, transformative, multi-paragraph responses**.
- Otherwise, give **short, crisp, actionable advice** (2–3 concise paragraphs).

Behavior based on topic:

1. **MENTAL HEALTH / PERSONAL GROWTH**:
   - Deep mode: Structured insights, CBT, mindfulness, habit loops, gratitude, reflection prompts.
   - Short mode: Empathetic acknowledgment + 1–2 quick, practical tips.

2. **GENERAL WELLNESS / PHYSICAL HEALTH**:
   - Deep mode: Detailed routines, explanations, metaphors.
   - Short mode: Quick, safe actionable advice with brief disclaimer.

Tone: Always compassionate, calm, and clear. Avoid generic responses.
`;

    // 🔹 Build conversation context
    let conversationText = systemPrompt + '\n\n';
    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.forEach(msg => {
        conversationText += `${msg.role === 'user' ? 'User' : 'Coach'}: ${msg.content}\n`;
      });
    }
    conversationText += `User: ${message}\nCoach:`;

    // 🔹 Generate AI response
    const result = await model.generateContent(conversationText);
    const response = result.response;
    const aiResponse = response.text();

    return res.json({
      success: true,
      response: aiResponse,
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

module.exports = { wellnessChat };
