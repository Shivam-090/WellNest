/**
 * Ollama Check-in Assessment Service
 * Performs deep clinical evaluation of 20 holistic wellness dimensions using maxwell1500/psycho:12b
 */

import { OLLAMA_MODEL, callOllamaGenerateRaw } from './ollamaConnection.js';

/**
 * Analyze a comprehensive 20-dimension check-in assessment test using Ollama
 */
export const analyzeCheckInWithOllama = async ({ mood = 'Okay', sliderValues = {}, userName = 'Student' }) => {
  const prompt = `You are an expert clinical psychologist and student mental wellness assessment system powered by ${OLLAMA_MODEL}.
Analyze the following student wellness check-in assessment with 20 holistic indicators evaluated on a scale from 1 to 10:

Student Name: ${userName}
Current Reported Mood: ${mood || 'Not specified'}

Scores on 20 Wellness Dimensions:
- Anxiety Level: ${sliderValues.anxiety_level ?? 5}/10 (higher is more anxious)
- Self-Esteem: ${sliderValues.self_esteem ?? 5}/10 (higher is healthier self-esteem)
- Mental Health History: ${sliderValues.mental_health_history ?? 1}/10
- Depression Symptoms: ${sliderValues.depression ?? 5}/10 (higher is more depressive load)
- Headache Frequency: ${sliderValues.headache ?? 5}/10
- Blood Pressure / Somatic Tension: ${sliderValues.blood_pressure ?? 5}/10
- Sleep Quality: ${sliderValues.sleep_quality ?? 5}/10 (higher is better sleep)
- Breathing / Tightness: ${sliderValues.breathing_problem ?? 5}/10
- Noise / Disruption Level: ${sliderValues.noise_level ?? 5}/10
- Living Conditions Comfort: ${sliderValues.living_conditions ?? 5}/10
- Safety & Security: ${sliderValues.safety ?? 5}/10
- Basic Needs Met: ${sliderValues.basic_needs ?? 5}/10
- Academic Performance Stress: ${sliderValues.academic_performance ?? 5}/10
- Study & Assignment Load: ${sliderValues.study_load ?? 5}/10
- Teacher / Faculty Relationship: ${sliderValues.teacher_student_relationship ?? 5}/10
- Future Career Concerns: ${sliderValues.future_career_concerns ?? 5}/10
- Social Support & Friends: ${sliderValues.social_support ?? 5}/10 (higher is stronger support)
- Peer Pressure: ${sliderValues.peer_pressure ?? 5}/10
- Extracurricular Balance: ${sliderValues.extracurricular_activities ?? 5}/10
- Bullying / Negative Interactions: ${sliderValues.bullying ?? 1}/10

Task:
Perform a clinical psychological assessment. Return ONLY a valid JSON object matching the following structure exactly, without any markdown code blocks or extra conversational text:
{
  "pred": 0,
  "label": "Low",
  "stressPct": 35,
  "confidence": 92,
  "titleText": "You're carrying quite a bit 🌸",
  "descText": "Your responses show moderate academic pressure with some sleep deficit. Small grounding routines will help reset your balance.",
  "aiInsight": "Your academic study load is currently intersecting with lower sleep quality, leading to elevated physical tension. Focusing on nighttime wind-downs and small study blocks will significantly restore your calm.",
  "factorChips": ["😴 Sleep Deficit", "📚 Study Pressure", "💬 Strong Social Net", "✨ High Resilience"],
  "recommendations": [
    {
      "factor": "Sleep Recovery",
      "advice": "Set a hard digital cutoff 45 minutes before sleep to reduce cognitive hyperarousal."
    },
    {
      "factor": "Academic Pace",
      "advice": "Break study sessions into 25-minute Pomodoro intervals to prevent overwhelm."
    },
    {
      "factor": "Anxiety Grounding",
      "advice": "Practice 4-4-4 Box Breathing for 3 minutes when you feel tension rising."
    }
  ],
  "affirmation": "You are capable of handling today's challenges one gentle step at a time."
}

Note:
- Set "pred" to 0 if overall stress is low (stressPct < 40), 1 for moderate stress (stressPct 40-70), and 2 for high stress (stressPct > 70).
- "label" must be "Low", "Moderate", or "High".
- "stressPct" must be an integer between 10 and 95.
- "confidence" must be an integer between 82 and 98.
- "recommendations" must have 3-4 tailored evidence-based recommendations.`;

  try {
    const data = await callOllamaGenerateRaw({
      prompt,
      format: 'json',
      options: {
        temperature: 0.3,
        num_predict: 420,
        num_ctx: 2048
      }
    });

    let rawResponse = data.response || '';

    // Strip out <think>...</think> if present
    if (rawResponse.includes('<think>')) {
      rawResponse = rawResponse.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
    }

    // Extract JSON object
    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON object detected in Ollama response');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      ...parsed,
      modelUsed: OLLAMA_MODEL,
      provider: 'ollama',
      tokensEvaluated: data.eval_count || 0
    };
  } catch (error) {
    console.warn(`⚠️ Ollama check-in assessment notice (${error.message}). Running deterministic fallback.`);
    return getDeterministicAssessment(sliderValues, mood, userName);
  }
};

function getDeterministicAssessment(sliderValues = {}, mood = 'Okay', userName = 'Student') {
  const anxiety = sliderValues.anxiety_level || 5;
  const depression = sliderValues.depression || 5;
  const studyLoad = sliderValues.study_load || 5;
  const sleepQuality = sliderValues.sleep_quality || 5;
  const socialSupport = sliderValues.social_support || 5;
  const headache = sliderValues.headache || 5;

  const positiveSum = (sleepQuality + socialSupport + (sliderValues.self_esteem || 5)) / 3;
  const negativeSum = (anxiety + depression + studyLoad + headache + (sliderValues.peer_pressure || 5)) / 5;
  
  let rawPct = Math.round(((negativeSum * 1.3 - positiveSum * 0.7 + 5) / 10) * 100);
  rawPct = Math.max(15, Math.min(92, rawPct));

  let pred = 0;
  let label = 'Low';
  let titleText = 'Wonderful balance 🌿';
  let descText = `${userName}, your lifestyle looks healthy and balanced! Keep nurturing these habits — they are your superpower.`;
  let factorChips = ['😊 Well Balanced', '🌙 Rested', '💬 Connected', '✨ Strong Focus'];

  if (rawPct >= 65) {
    pred = 2;
    label = 'High';
    titleText = 'You need a break 💛';
    descText = `${userName}, your responses show significant stress across multiple areas. Please be kind to yourself — rest matters more than productivity today.`;
    factorChips = ['😴 Sleep Deficit', '📚 Overloaded', '🧠 Mental Fatigue', '🫂 Support Needed'];
  } else if (rawPct >= 40) {
    pred = 1;
    label = 'Moderate';
    titleText = "You're carrying quite a bit 🌸";
    descText = `${userName}, some areas need gentle attention. Small, consistent actions today can shift your balance significantly.`;
    factorChips = ['😴 Light Fatigue', '📚 Academic Pressure', '💬 Mild Strain', '🌱 High Potential'];
  }

  return {
    pred,
    label,
    stressPct: rawPct,
    confidence: 88,
    titleText,
    descText,
    aiInsight: `${userName}, your assessment indicates that study load and daily expectations are interacting with your sleep patterns. Taking small, conscious breaks between tasks will protect your nervous system and help you thrive.`,
    factorChips,
    recommendations: [
      {
        factor: 'Box Breathing Grounding',
        advice: 'Practice 4-4-4 Box Breathing for 3 minutes when you feel tension rising.'
      },
      {
        factor: 'Sleep Wind-Down',
        advice: 'Turn off screens 45 minutes before sleep to allow your melatonin levels to rise naturally.'
      },
      {
        factor: 'Task Chunking',
        advice: 'Break large assignments into 20-minute focused blocks with 5-minute stretch intervals.'
      }
    ],
    affirmation: 'You have overcome difficult days before, and you have the strength to thrive today.',
    modelUsed: `${OLLAMA_MODEL} (Local Engine)`,
    provider: 'local-fallback'
  };
}
