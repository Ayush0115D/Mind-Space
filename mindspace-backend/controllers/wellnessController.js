// controllers/wellnessController.js
require('dotenv').config();

// AI Wellness Coach chat using Gemini API
exports.wellnessChat = async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    // Combine previous conversation + current user message
    const conversation = (conversationHistory || []).map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    conversation.push({ role: 'user', content: message });

    // Call Gemini API
    const apiUrl = 'https://api.openai.com/v1/chat/completions'; // replace if Gemini endpoint differs
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` // Gemini API key if different
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // or Gemini model
        messages: conversation,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API error:', errText);
      return res.status(500).json({ success: false, message: 'AI service failed' });
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    res.json({ success: true, response: aiResponse });
  } catch (err) {
    console.error('AI Wellness Chat Error:', err);
    res.status(500).json({ success: false, message: 'AI service failed' });
  }
};
