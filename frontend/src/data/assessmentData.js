export const ASSESSMENT_SECTIONS = [
  {
    id: 0,
    label: 'Sleep & Recovery',
    emoji: '🌙',
    desc: 'How well have you been sleeping? Quality rest is the foundation of everything.',
    color: '#9B86CC',
    sliders: [
      { feat: 'sleep_quality', label: 'Sleep Quality', icon: '😴', low: 'Very poor', high: 'Excellent' }
    ]
  },
  {
    id: 1,
    label: 'Mental Wellbeing',
    emoji: '🧠',
    desc: "Let's check in on your emotional and mental health this week.",
    color: '#F2A7C3',
    sliders: [
      { feat: 'anxiety_level', label: 'Anxiety Level', icon: '😰', low: 'Very calm', high: 'Very anxious' },
      { feat: 'depression', label: 'Low Mood', icon: '😔', low: 'Feeling great', high: 'Very low' },
      { feat: 'self_esteem', label: 'Self-Esteem', icon: '💪', low: 'Very low', high: 'Very high' },
      { feat: 'mental_health_history', label: 'Mental Wellness', icon: '🌿', low: 'Struggling', high: 'Thriving' }
    ]
  },
  {
    id: 2,
    label: 'Study Pressure',
    emoji: '📚',
    desc: "Academics matter, but so do you. How's the pressure feeling?",
    color: '#7ECECA',
    sliders: [
      { feat: 'study_load', label: 'Study Load', icon: '📖', low: 'Very light', high: 'Overwhelming' },
      { feat: 'academic_performance', label: 'Academic Performance', icon: '🎓', low: 'Struggling', high: 'Thriving' },
      { feat: 'future_career_concerns', label: 'Career Anxiety', icon: '🔮', low: 'No worries', high: 'Very concerned' },
      { feat: 'teacher_student_relationship', label: 'Teacher Relations', icon: '🤝', low: 'Difficult', high: 'Great' }
    ]
  },
  {
    id: 3,
    label: 'Social Connection',
    emoji: '💞',
    desc: 'Relationships shape our wellbeing deeply. How connected do you feel?',
    color: '#F2A7C3',
    sliders: [
      { feat: 'social_support', label: 'Social Support', icon: '🫂', low: 'Isolated', high: 'Supported' },
      { feat: 'peer_pressure', label: 'Peer Pressure', icon: '👥', low: 'None', high: 'Intense' },
      { feat: 'bullying', label: 'Feeling Safe', icon: '🛡️', low: 'Not safe', high: 'Very safe' }
    ]
  },
  {
    id: 4,
    label: 'Physical & Lifestyle',
    emoji: '💪',
    desc: "Your body carries your mind. Let's see how it's doing.",
    color: '#A8C5A0',
    sliders: [
      { feat: 'extracurricular_activities', label: 'Active & Moving', icon: '🏃', low: 'Inactive', high: 'Very active' },
      { feat: 'headache', label: 'Headaches / Pain', icon: '🤕', low: 'None at all', high: 'Very frequent' },
      { feat: 'blood_pressure', label: 'Physical Tension', icon: '💓', low: 'Relaxed', high: 'High tension' },
      { feat: 'breathing_problem', label: 'Breathing Ease', icon: '🌬️', low: 'Struggling', high: 'Easy & clear' }
    ]
  },
  {
    id: 5,
    label: 'Environment',
    emoji: '🏡',
    desc: 'Your surroundings affect your peace of mind more than you realise.',
    color: '#9B86CC',
    sliders: [
      { feat: 'noise_level', label: 'Noise Level', icon: '🔊', low: 'Very quiet', high: 'Very noisy' },
      { feat: 'living_conditions', label: 'Living Comfort', icon: '🏠', low: 'Difficult', high: 'Comfortable' },
      { feat: 'safety', label: 'Feeling Safe', icon: '🛡️', low: 'Unsafe', high: 'Very safe' },
      { feat: 'basic_needs', label: 'Basic Needs Met', icon: '🍽️', low: 'Not met', high: 'Fully met' }
    ]
  }
];

export const INITIAL_SLIDER_VALUES = {
  sleep_quality: 5,
  anxiety_level: 5,
  depression: 5,
  self_esteem: 5,
  mental_health_history: 5,
  study_load: 5,
  academic_performance: 5,
  future_career_concerns: 5,
  teacher_student_relationship: 5,
  social_support: 5,
  peer_pressure: 5,
  bullying: 5,
  extracurricular_activities: 5,
  headache: 5,
  blood_pressure: 5,
  breathing_problem: 5,
  noise_level: 5,
  living_conditions: 5,
  safety: 5,
  basic_needs: 5
};
