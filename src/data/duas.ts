export interface DuaItem {
  id: string;
  category: "daily" | "forgiveness" | "anxiety" | "guidance" | "family";
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  reference: string;
}

export const DUAS_COLLECTION: DuaItem[] = [
  {
    id: "d1",
    category: "daily",
    title: "Before Eating",
    arabic: "بِسْمِ اللَّهِ",
    transliteration: "Bismillah",
    translation: "In the name of Allah.",
    reference: "Sunan Abi Dawud 3767",
  },
  {
    id: "d2",
    category: "daily",
    title: "After Eating",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
    transliteration: "Alhamdu lillahil-ladhi at'amana wa saqana wa ja'alana muslimeen.",
    translation: "Praise be to Allah Who has fed us and given us drink and made us Muslims.",
    reference: "Jami` at-Tirmidhi 3457",
  },
  {
    id: "d3",
    category: "daily",
    title: "Leaving the House",
    arabic: "بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلاَ حَوْلَ وَلاَ قُوَّةَ إِلاَّ بِاللَّهِ",
    transliteration: "Bismillahi tawakkaltu 'alallahi, wa la hawla wa la quwwata illa billah.",
    translation: "In the name of Allah, I place my trust in Allah, and there is no might nor power except with Allah.",
    reference: "Sunan Abi Dawud 5095",
  },
  {
    id: "d4",
    category: "forgiveness",
    title: "Seeking Complete Forgiveness",
    arabic: "رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ",
    transliteration: "Rabbana zalamna anfusana wa il-lam taghfir lana wa tarhamna lana koonanna minal-khasireen.",
    translation: "Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy upon us, we will surely be among the losers.",
    reference: "Surah Al-A'raf 7:23",
  },
  {
    id: "d5",
    category: "forgiveness",
    title: "Sayyid al-Istighfar",
    arabic: "اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ",
    transliteration: "Allahumma Anta Rabbi la ilaha illa Anta, khalaqtani wa ana 'abduka...",
    translation: "O Allah, You are my Lord; none has the right to be worshipped but You. You created me and I am Your slave...",
    reference: "Sahih al-Bukhari 6306",
  },
  {
    id: "d6",
    category: "anxiety",
    title: "Relief from Distress & Anxiety",
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ، وَغَلَبَةِ الرِّجَالِ",
    transliteration: "Allahumma inni a'oodhu bika minal-hammi wal-hazani, wal-'ajzi wal-kasali, wal-bukhli wal-jubni, wa dala'id-dayni wa ghalabatir-rijal.",
    translation: "O Allah, I seek refuge in You from anxiety and grief, weakness and laziness, miserliness and cowardice, the burden of debts and from being overpowered by men.",
    reference: "Sahih al-Bukhari 6369",
  },
  {
    id: "d7",
    category: "anxiety",
    title: "Dua of Prophet Yunus (A.S.)",
    arabic: "لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ",
    transliteration: "La ilaha illa Anta subhanaka inni kuntu minaz-zalimeen.",
    translation: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.",
    reference: "Surah Al-Anbya 21:87",
  },
  {
    id: "d8",
    category: "guidance",
    title: "For Increase in Knowledge",
    arabic: "رَّبِّ زِدْنِي عِلْمًا",
    transliteration: "Rabbi zidni 'ilma.",
    translation: "My Lord, increase me in knowledge.",
    reference: "Surah Ta-Ha 20:114",
  },
  {
    id: "d9",
    category: "guidance",
    title: "Steadfastness of Heart",
    arabic: "يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ",
    transliteration: "Ya Muqallibal-quloob, thabbit qalbi 'ala deenik.",
    translation: "O Turner of the hearts, make my heart firm upon Your religion.",
    reference: "Jami` at-Tirmidhi 3522",
  },
  {
    id: "d10",
    category: "family",
    title: "For Parents",
    arabic: "رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
    transliteration: "Rabbir-hamhuma kama rabbayani sagheera.",
    translation: "My Lord, have mercy upon them as they brought me up when I was small.",
    reference: "Surah Al-Isra 17:24",
  },
  {
    id: "d11",
    category: "family",
    title: "For Spouse and Offspring",
    arabic: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا",
    transliteration: "Rabbana hab lana min azwajina wa dhurriyyatina qurrata a'yunin waj'alna lil-muttaqeena imama.",
    translation: "Our Lord, grant us from among our wives and offspring comfort to our eyes and make us a leader for the righteous.",
    reference: "Surah Al-Furqan 25:74",
  },
];
