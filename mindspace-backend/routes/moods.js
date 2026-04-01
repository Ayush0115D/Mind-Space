const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai'); // ✅ same package as wellness
const moodController = require('../controllers/moodController');
const auth = require('../middleware/auth');

// Apply auth to all routes
router.use(auth);

// ✅ Static routes FIRST (before /:id)
router.get('/', moodController.getMoods);
router.post('/', moodController.createMood);
router.get('/stats', moodController.getStats);

// ✨ AI Journal Sentiment Analysis — same SDK & model as wellnessController
router.post('/analyze', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least a few words to analyze.'
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is missing!');
      return res.status(500).json({
        success: false,
        message: 'AI service not configured.'
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' }); // ✅ same model as wellness

    const prompt = `You are a mental wellness AI. Analyze the following journal entry and respond ONLY with a valid JSON object — no explanation, no markdown, no extra text.

Journal entry: "${text.trim()}"

Respond with this exact JSON structure:
{
  "sentiment": "<one of: very_positive, positive, neutral, negative, very_negative>",
  "confidence": <number between 0.5 and 1.0>,
  "suggestedMood": <integer from 1 to 5>,
  "summary": "<1-2 sentence empathetic insight about the person's emotional state>",
  "suggestions": ["<resource 1>", "<resource 2>", "<resource 3>"]
}

Guidelines:
- sentiment must be one of the 5 exact values shown
- suggestedMood: 1=very negative, 2=negative, 3=neutral, 4=positive, 5=very positive
- summary: be empathetic and supportive, 1-2 sentences max
- suggestions: 3 short mental wellness topics relevant to the entry (e.g. "Stress Management", "Mindfulness", "Sleep Hygiene", "Anxiety Relief", "Gratitude Practice", "Breathing Exercises", "Work-Life Balance")`;

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    // Safely parse JSON
    let parsed;
    try {
      const cleaned = rawText.replace(/```json|```/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      console.error('Failed to parse Gemini response:', rawText);
      throw new Error('Could not parse AI analysis');
    }

    // Validate and sanitize
    const validSentiments = ['very_positive', 'positive', 'neutral', 'negative', 'very_negative'];
    const sentiment = validSentiments.includes(parsed.sentiment) ? parsed.sentiment : 'neutral';
    const confidence = Math.min(1, Math.max(0.5, parseFloat(parsed.confidence) || 0.75));
    const suggestedMood = Math.min(5, Math.max(1, parseInt(parsed.suggestedMood) || 3));
    const summary = typeof parsed.summary === 'string' ? parsed.summary : '';
    const suggestions = Array.isArray(parsed.suggestions) ? parsed.suggestions.slice(0, 3) : [];

    return res.json({
      success: true,
      data: { sentiment, confidence, suggestedMood, summary, suggestions }
    });

  } catch (error) {
    console.error('Analyze route error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to analyze journal entry'
    });
  }
});

// ✅ Dynamic /:id routes LAST
router.put('/:id', moodController.updateMood);
router.delete('/:id', moodController.deleteMood);

module.exports = router;