export interface DhikrPreset {
  id: string;
  arabic: string;
  name: string;
  meaning: string;
  target: number;
  isCustom?: boolean;
}

export const DEFAULT_PRESETS: DhikrPreset[] = [
  { id: "subhanallah", arabic: "سُبْحَانَ ٱللَّٰهِ", name: "SubhanAllah", meaning: "Glory be to Allah", target: 33 },
  { id: "alhamdulillah", arabic: "ٱلْحَمْدُ لِلَّٰهِ", name: "Alhamdulillah", meaning: "Praise be to Allah", target: 33 },
  { id: "allahuakbar", arabic: "ٱللَّٰهُ أَكْبَرُ", name: "Allahu Akbar", meaning: "Allah is the Greatest", target: 34 },
  { id: "astaghfirullah", arabic: "أَسْتَغْفِرُ ٱللَّٰهَ", name: "Astaghfirullah", meaning: "I ask Allah for forgiveness", target: 33 },
  { id: "lailahaillallah", arabic: "لَا إِلَٰهَ إِلَّا ٱللَّٰهُ", name: "La ilaha illa Allah", meaning: "None has the right to be worshipped but Allah", target: 33 },
  { id: "bihamdihi", arabic: "سُبْحَانَ ٱللَّٰهِ وَبِحَمْدِهِ", name: "SubhanAllahi wa bihamdihi", meaning: "Glory be to Allah and His is the praise", target: 100 },
];
