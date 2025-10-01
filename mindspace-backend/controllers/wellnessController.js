// controllers/wellnessController.js

const wellnessChat = async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // Ensure GEMINI_API_KEY is present
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing!");
      return res.status(500).json({
        success: false,
        message: "AI service not configured. Missing API key.",
      });
    }

    // Gemini 2-Flash API endpoint
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    let aiResponse = "Sorry, I couldn’t generate a response.";

    try {
      const response = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: [
            {
              role: "user",
              text: message
            }
          ],
          temperature: 0.7,
          maxOutputTokens: 500
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("Gemini 2-Flash API error response:", errText);
        return res.status(500).json({
          success: false,
          message: "AI service failed",
          error: errText,
        });
      }

      const data = await response.json();

      // Parse response
      aiResponse =
        data?.candidates?.[0]?.content?.[0]?.text ||
        "Sorry, I couldn’t generate a response.";

    } catch (geminiError) {
      console.error("Error calling Gemini 2-Flash API:", geminiError);
      return res.status(500).json({
        success: false,
        message: "AI service failed",
        error: geminiError.message,
      });
    }

    return res.json({
      success: true,
      message: "AI response received",
      response: aiResponse,
    });

  } catch (error) {
    console.error("Wellness chat error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = { wellnessChat };
