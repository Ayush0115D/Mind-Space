const wellnessChat = async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;
   
    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Expanded mock responses for testing
    const mockResponses = [
      "I understand you're going through a difficult time. It's completely normal to feel this way. Would you like to talk more about what's on your mind?",
      
      "Thank you for sharing that with me. Managing stress is important. Have you tried any relaxation techniques like deep breathing or meditation?",
      
      "I hear you. Remember, it's okay to take things one step at a time. What's one small thing you could do today to take care of yourself?",
      
      "That sounds challenging. Remember that seeking support is a sign of strength, not weakness. Is there someone you trust that you can talk to?",
      
      "It's okay to feel overwhelmed sometimes. Taking a moment to breathe and ground yourself can help. Would you like some suggestions for coping strategies?",
      
      "I appreciate you opening up. Self-care is so important. Have you been getting enough rest and taking breaks when you need them?",
      
      "Your feelings are valid. Sometimes journaling or expressing emotions through creative outlets can help process what you're experiencing. Have you tried that?",
      
      "It's great that you're reaching out. Setting small, achievable goals can help you feel more in control. What's one thing you'd like to accomplish today?",
      
      "I can sense you're dealing with a lot. Remember to be kind to yourself during difficult times. What activities usually help you feel better?",
      
      "Thank you for trusting me with this. Physical activity, even a short walk, can sometimes help improve mood. How has your physical wellness been lately?",
      
      "That must be tough. Building a routine can provide structure and stability. Do you have any daily practices that help you feel grounded?",
      
      "I'm here to listen. Sometimes just talking about what's bothering us can provide relief. Would you like to share more details?",
      
      "Your mental health matters. Have you considered practicing mindfulness or gratitude exercises? They can be helpful for managing stress.",
      
      "It sounds like you're dealing with a lot of pressure. Remember that it's okay to set boundaries and say no when you need to.",
      
      "I appreciate your honesty. Sleep, nutrition, and hydration all play important roles in mental wellness. How have you been doing with those basics?",
      
      "That's a lot to carry. Breaking problems down into smaller pieces can make them feel more manageable. What feels most urgent right now?",
      
      "Your wellbeing is important. Connecting with others, even briefly, can help reduce feelings of isolation. Who in your life makes you feel supported?",
      
      "Thank you for sharing. Progressive muscle relaxation or guided imagery can be helpful tools for managing anxiety. Would you like to learn more about those?",
      
      "I understand this is difficult. Celebrating small wins along the way can help maintain motivation. What's something positive that happened recently?",
      
      "It's courageous to acknowledge when things are hard. Professional support from a therapist or counselor can be really valuable. Have you considered that option?"
    ];

    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];

    console.log('Using mock response - API quota exhausted');

    // Simulate a small delay like a real API
    await new Promise(resolve => setTimeout(resolve, 500));

    return res.json({
      success: true,
      response: randomResponse
    });

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