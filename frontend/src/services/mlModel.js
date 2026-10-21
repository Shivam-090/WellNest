export const MODEL = {
  features: [
    "anxiety_level",
    "self_esteem",
    "mental_health_history",
    "depression",
    "headache",
    "blood_pressure",
    "sleep_quality",
    "breathing_problem",
    "noise_level",
    "living_conditions",
    "safety",
    "basic_needs",
    "academic_performance",
    "study_load",
    "teacher_student_relationship",
    "future_career_concerns",
    "social_support",
    "peer_pressure",
    "extracurricular_activities",
    "bullying"
  ],
  scaler: {
    mean: [
      11.051136363636363, 17.892045454545453, 0.4909090909090909, 12.570454545454545,
      2.4886363636363638, 2.1875, 2.659090909090909, 2.728409090909091,
      2.651136363636364, 2.519318181818182, 2.731818181818182, 2.7852272727272727,
      2.7852272727272727, 2.596590909090909, 2.6670454545454545, 2.6386363636363637,
      1.8761363636363637, 2.734090909090909, 2.765909090909091, 2.631818181818182
    ],
    scale: [
      6.198120945426302, 8.931478061416836, 0.499917348540637, 7.711092351148045,
      1.3980044071153888, 0.829883959577263, 1.543949802207163, 1.3972740395983663,
      1.3313948869667942, 1.123949808259961, 1.408056805296629, 1.453994480163906,
      1.4111600460684235, 1.3141665924245023, 1.3913059260105471, 1.5341144779334295,
      1.0463675608093217, 1.4213379071427708, 1.4293105747206463, 1.5280368759342415
    ]
  },
  coef: [
    [
      -0.06613960051217753, 0.19217332345404087, 0.21531701482128204, -0.08767379240289946,
      -0.23171072914062918, 1.4589510884357977, 0.150985372591461, -0.0751611582070676,
      -0.12076161088578019, -0.01955508489181459, 0.19822989220765672, 0.35003602507460496,
      0.3882094728297516, -0.3703875333414369, 0.20649591278141938, -0.01660161452214946,
      1.0665132156632733, -0.11831444068923347, -0.201364834576259, -0.07641988387142275
    ],
    [
      0.156909878523738, 0.2521553961385352, -0.3083235949358342, -0.0975677045605637,
      -0.07827052633387081, -2.815683728135286, 0.06664263625633336, -0.01225077025858713,
      -0.0782762841736297, 0.007682120858848342, -0.02642556414864732, -0.23348236221367571,
      -0.04619723787486644, 0.260091482020967, -0.363889089261989, 0.052883407369428856,
      -1.346672449167638, -0.09368810840171168, 0.06943937307519048, -0.14148201606396008
    ],
    [
      -0.09077027801156143, -0.44432871959257575, 0.093006580114553, 0.18524149696346393,
      0.30998125547449823, 1.3567326396994883, -0.2176280088477932, 0.08741192846565558,
      0.19903789505940628, 0.011872964032966157, -0.17180432805900808, -0.11655366286093044,
      -0.342012234954888, 0.11029605132046567, 0.1573931764805688, -0.03628179284727754,
      0.280159233504363, 0.21200254909094374, 0.1319254615010649, 0.21790189993538353
    ]
  ],
  intercept: [0.22408322690301052, 0.6319638731710295, -0.8560471000740375]
};

export const RECS = {
  anxiety_level: {
    high: "Try box breathing (4s inhale → 4s hold → 4s exhale → 4s hold) for 5 minutes. Do this twice today.",
    mod: "Reduce caffeine and take a 10-min morning walk to lower baseline anxiety."
  },
  sleep_quality: {
    high: "Set a hard lights-off time. Ban screens 45 mins before bed — sleep is your #1 recovery tool.",
    mod: "Aim for consistent sleep and wake times, even on weekends. Your rhythm matters."
  },
  depression: {
    high: "Reach out to someone you trust today. Even a 5-minute check-in can shift your mood significantly.",
    mod: "Log 3 small positives from today — this gradually retrains your brain over time."
  },
  academic_performance: {
    high: "Break study sessions into 25-min Pomodoro blocks. Overwhelm fades when tasks feel small.",
    mod: "Review notes within 24 hours of class — retention jumps from 20% to 80%."
  },
  study_load: {
    high: "Build a weekly planner on Sunday. Visible plans reduce the mental load of remembering everything.",
    mod: "Batch similar tasks together to cut context-switching fatigue."
  },
  social_support: {
    high: "Make one plan with someone this week — isolation amplifies stress by 40% in students.",
    mod: "Send a voice note instead of a text — it feels far more connected."
  },
  peer_pressure: {
    high: "Practice one 'no, thank you' this week without explanation. Boundaries protect your energy.",
    mod: "Notice when you're doing something to fit in vs because you want to — journaling helps."
  },
  self_esteem: {
    high: "Write 3 things you did well today, no matter how small. Self-esteem is built in tiny bricks.",
    mod: "Challenge one negative self-thought this week — ask 'is this fact or feeling?'"
  },
  blood_pressure: {
    high: "Try slow diaphragmatic breathing — it directly activates your parasympathetic nervous system.",
    mod: "A 10-min walk after meals is clinically shown to reduce post-meal BP spikes."
  },
  future_career_concerns: {
    high: "Write your top 3 career fears and one small step for each. Action beats anxiety every time.",
    mod: "Talk to one person working in a field you're curious about this month."
  },
  headache: {
    high: "Track your hydration — 60% of tension headaches are dehydration. Drink water first.",
    mod: "Take screen breaks every 45 minutes using the 20-20-20 rule."
  },
  bullying: {
    high: "This is serious — please speak to a counsellor or trusted adult. You don't have to handle this alone.",
    mod: "Document incidents and speak to someone in authority. Silence lets it continue."
  },
  noise_level: {
    high: "Use noise-cancelling headphones or earplugs during study time to protect your focus.",
    mod: "Try a white noise app or lo-fi music to mask distracting background sounds."
  },
  living_conditions: {
    high: "Identify one concrete change you can make to your living space this week to reduce friction.",
    mod: "A tidy desk reduces cognitive load — spend 5 minutes organising your study area."
  },
  basic_needs: {
    high: "Prioritise one basic need today — even a proper meal or 8 hours of sleep changes everything.",
    mod: "Set phone reminders to eat and hydrate at regular times."
  },
  breathing_problem: {
    high: "Practice slow 4-7-8 breathing: inhale 4s, hold 7s, exhale 8s. Do 3 cycles when stressed.",
    mod: "Notice when your breathing shallows during stress and consciously slow it down."
  },
  mental_health_history: {
    high: "If you're not currently supported, consider reaching out to a counsellor or mental health service.",
    mod: "Keep tracking your moods — pattern awareness is the first step to managing them."
  },
  teacher_student_relationship: {
    high: "Send one email to a professor this week — just introduce yourself or ask one question.",
    mod: "Sit closer to the front or participate once per class. Small steps build rapport."
  },
  safety: {
    high: "Speak to campus security or a trusted person about your safety concerns — you deserve to feel safe.",
    mod: "Vary your routes and check in with friends when travelling at night."
  },
  extracurricular_activities: {
    high: "Consider dropping one commitment. Being over-scheduled is a stressor, not an achievement.",
    mod: "Check monthly: does this activity energise or drain you?"
  }
};

const INVERTED_ML = new Set([
  'self_esteem',
  'social_support',
  'living_conditions',
  'safety',
  'basic_needs',
  'academic_performance',
  'sleep_quality',
  'teacher_student_relationship'
]);

const ORIG_MAX = {
  anxiety_level: 21,
  self_esteem: 30,
  mental_health_history: 1,
  depression: 27,
  headache: 5,
  blood_pressure: 3,
  sleep_quality: 5,
  breathing_problem: 5,
  noise_level: 5,
  living_conditions: 5,
  safety: 5,
  basic_needs: 5,
  academic_performance: 5,
  study_load: 5,
  teacher_student_relationship: 5,
  future_career_concerns: 5,
  social_support: 3,
  peer_pressure: 5,
  extracurricular_activities: 5,
  bullying: 5
};

export function softmax(arr) {
  const m = Math.max(...arr);
  const e = arr.map((x) => Math.exp(x - m));
  const s = e.reduce((a, b) => a + b, 0);
  return e.map((x) => x / s);
}

export function buildMLFeatures(sliderVals) {
  const out = {};
  for (const [k, max] of Object.entries(ORIG_MAX)) {
    const val = sliderVals[k] !== undefined ? sliderVals[k] : 5;
    out[k] = Math.round((val / 10) * max);
  }
  return out;
}

export function mlPredict(featureDict) {
  const f = MODEL.features;
  const scaled = f.map((name, i) => (featureDict[name] - MODEL.scaler.mean[i]) / MODEL.scaler.scale[i]);
  const logits = MODEL.coef.map((row, cls) =>
    row.reduce((sum, w, j) => sum + w * scaled[j], 0) + MODEL.intercept[cls]
  );
  const proba = softmax(logits);
  const pred = proba.indexOf(Math.max(...proba));
  return {
    pred,
    proba,
    label: ['Low', 'Moderate', 'High'][pred]
  };
}

export function getTopStressors(featureDict, n = 4) {
  const scores = {};
  for (const [k, v] of Object.entries(featureDict)) {
    const max = ORIG_MAX[k] || 5;
    const norm = v / max;
    scores[k] = INVERTED_ML.has(k) ? 1 - norm : norm;
  }
  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([k]) => k);
}

export function getRecommendations(topStressors, stressLevelPred) {
  const key = stressLevelPred === 2 ? 'high' : 'mod';
  return topStressors
    .filter((f) => RECS[f])
    .map((f) => ({
      factorKey: f,
      factor: f.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      advice: RECS[f][key] || RECS[f].mod
    }));
}

export function runWellnessInference(sliderVals) {
  const featDict = buildMLFeatures(sliderVals);
  const { pred, proba, label } = mlPredict(featDict);
  const confidence = Math.round(proba[pred] * 100);
  
  // Normalized percentage for radial progress
  const stressPct =
    pred === 2
      ? Math.round(60 + proba[2] * 40)
      : pred === 1
      ? Math.round(30 + proba[1] * 30)
      : Math.round(proba[0] * 30);

  const topStressors = getTopStressors(featDict, 4);
  const recommendations = getRecommendations(topStressors, pred);

  return {
    pred,
    proba,
    label,
    confidence,
    stressPct,
    topStressors,
    recommendations,
    featDict
  };
}
