/**
 * Ollama Chat Service
 * Dedicated conversation intelligence for WellNest AI powered by maxwell1500/psycho:12b
 */

import { OLLAMA_MODEL, callOllamaChatRaw } from './ollamaConnection.js';

const CHAT_SYSTEM_PROMPT = `You are NestAI, an empathetic, supportive, and compassionate psychological wellness companion for WellNest AI.
You are powered by the specialized local psychological model (${OLLAMA_MODEL}).
Your purpose is to provide warm, validating emotional support, stress relief, CBT grounding exercises, and active listening for students and individuals.

Core Principles:
1. Warmth & Validation: Genuinely validate the user's emotional experience without judgment.
2. Grounding & Recovery: When someone is overwhelmed or anxious, guide them through small, restorative steps (e.g. 4-4-4 Box Breathing, sensory 5-4-3-2-1, cognitive defusion).
3. Actionable & Gentle: Help break daunting challenges into tiny, achievable 10-minute actions.
4. Boundaries: Maintain an empathetic, therapeutic tone.
5. Markdown Formatting: Use clean bullet points, bold key insights, and clear paragraphs for high readability.`;

/**
 * Generate AI reply using Ollama maxwell1500/psycho:12b
 */
export const generateOllamaChat = async (conversationHistory = [], userContext = {}) => {
  const userName = userContext.name || 'friend';
  const personalizedPrompt = `${CHAT_SYSTEM_PROMPT}\n\nThe user's name is "${userName}". Address them warmly by their name when appropriate.`;

  const formattedMessages = [
    { role: 'system', content: personalizedPrompt },
    ...conversationHistory.map((msg) => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    }))
  ];

  try {
    const data = await callOllamaChatRaw({
      messages: formattedMessages,
      options: {
        temperature: 0.7,
        top_p: 0.9,
        num_predict: 350,
        num_ctx: 2048
      }
    });

    let content = data.message?.content || '';

    // Strip internal <think>...</think> reasoning tags
    if (content.includes('<think>')) {
      content = content.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
    }

    if (!content.trim()) {
      throw new Error('Empty text content received from Ollama model');
    }

    return {
      success: true,
      text: content.trim(),
      model: OLLAMA_MODEL,
      provider: 'ollama',
      tokensEvaluated: data.eval_count || 0
    };
  } catch (error) {
    console.warn(`⚠️ Ollama chat error (${error.message}). Using local restorative fallback.`);
    const lastUserMsg = conversationHistory[conversationHistory.length - 1]?.text || '';
    const fallbackText = getLocalChatFallback(lastUserMsg, userName);

    return {
      success: true,
      text: fallbackText,
      model: `${OLLAMA_MODEL} (Local Engine)`,
      provider: 'local-fallback'
    };
  }
};

function getLocalChatFallback(userMessage = '', nickname = 'friend') {
  const msg = userMessage.toLowerCase();

  if (msg.includes('breath') || msg.includes('calm') || msg.includes('anxious') || msg.includes('panic')) {
    return `Take a gentle breath with me right now, ${nickname} 🫁.\n\nLet's do 4-4-4 Box Breathing:\n- **1. Inhale**: Inhale deeply through your nose for 4 seconds.\n- **2. Hold**: Hold that breath softly for 4 seconds.\n- **3. Exhale**: Release slowly through your mouth for 4 seconds.\n\nRepeat this 3 times. You don't have to carry everything at once.`;
  }

  if (msg.includes('study') || msg.includes('exam') || msg.includes('overwhelm') || msg.includes('work') || msg.includes('deadline')) {
    return `Academic pressure can feel so heavy, ${nickname} 📚.\n\nHere is a grounding thought: Break whatever mountain is in front of you into one tiny 15-minute pebble. Just focus on that single piece.\n\nHave you had some water or stepped away from the screen for 5 minutes today?`;
  }

  if (msg.includes('sleep') || msg.includes('tired') || msg.includes('insomnia') || msg.includes('night')) {
    return `Quality rest is your mind's natural reset button 🌙.\n\nTry this wind-down routine:\n- **Screen Off**: Dim your screen lighting right now or set your device aside.\n- **Body Scan**: Unclench your jaw and let your shoulders drop.\n- **Visual Calm**: Visualize a serene forest with a quiet, calm breeze. You are safe, and tomorrow can wait.`;
  }

  return `I hear you, ${nickname} 🌸. Thank you for sharing what is on your mind. How is your body feeling right now? Remember to drink some water, relax your shoulders, and know that you are doing your best. What is one small thing that would bring you a bit of comfort right now?`;
}
