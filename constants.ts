
import { AppMode, Translation } from './types';

export const GLOBAL_BEHAVIOR = (translation: Translation) => `
You are Holy Bible GPT.
Role: Help users understand the Bible.
Tone: Bible first, short guidance, simple language.
Strict Rules:
1. Use ONLY simple language.
2. Be extremely brief. Stop as soon as the answer is clear.
3. No long commentary or essays.
4. Bible text is the priority.
5. End every response with a passage link: [link_to_passage book="Book" chapter="1" verses="1"].
6. If the user's intent is unclear, ask for a specific verse to study.
`;

export const MODE_PROMPTS: Record<AppMode, string> = {
  [AppMode.CHAT]: "Provide short pastoral guidance based on Scripture.",
  [AppMode.SIMPLIFY]: "Explain this like I am 5 years old. Very short.",
  [AppMode.DEEP_STUDY]: "Provide a brief exegesis of this verse.",
  [AppMode.CROSS_REFERENCE]: "List 2-3 closely related verses only.",
  [AppMode.WORD_STUDY]: "Define key original language words briefly.",
  [AppMode.APPLY]: "Give 1-2 simple practical applications.",
  [AppMode.CONTEXT]: "Briefly explain the historical setting.",
  [AppMode.DAILY_PLAN]: "Create a 3-day reading plan in JSON format.",
  [AppMode.KIDS]: "Tell a very simple story for a child.",
  [AppMode.PRAYER_HELP]: "Write a 2-sentence prayer based on this topic."
};

export const MODE_LABELS: Record<AppMode, { label: string, icon: string, description: string }> = {
  [AppMode.CHAT]: { label: 'Ask', icon: '💬', description: 'Quick help' },
  [AppMode.SIMPLIFY]: { label: 'Simplify', icon: '✨', description: 'Easy words' },
  [AppMode.DEEP_STUDY]: { label: 'Explain', icon: '📖', description: 'Deep study' },
  [AppMode.CROSS_REFERENCE]: { label: 'Related', icon: '🔗', description: 'Connections' },
  [AppMode.WORD_STUDY]: { label: 'Word', icon: '🔡', description: 'Definitions' },
  [AppMode.APPLY]: { label: 'Apply', icon: '👟', description: 'Practical' },
  [AppMode.CONTEXT]: { label: 'Context', icon: '🏛️', description: 'History' },
  [AppMode.DAILY_PLAN]: { label: 'Plan', icon: '📅', description: 'Reading path' },
  [AppMode.KIDS]: { label: 'Kids', icon: '🎨', description: 'For children' },
  [AppMode.PRAYER_HELP]: { label: 'Prayer', icon: '🙏', description: 'Help me pray' }
};

export const HISTORICAL_INTRODUCTIONS: Record<string, string> = {
  "Tobit": "A story of faithfulness and the help of angels.",
  "Judith": "A narrative of courage and deliverance.",
  "Wisdom": "Reflections on God's wisdom and righteousness.",
  "Sirach": "Practical advice for daily living.",
  "Baruch": "Messages of hope during a time of exile.",
  "1 Maccabees": "History of the fight for religious freedom.",
  "2 Maccabees": "Stories of faith and standing strong in trial."
};
