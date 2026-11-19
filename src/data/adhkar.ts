export interface AdhkarItem {
  id: string;
  category: "morning" | "evening" | "after_salah" | "sleep";
  arabic: string;
  transliteration: string;
  translation: string;
  source: string;
  targetCount: number;
}

export const ADHKAR_COLLECTION: AdhkarItem[] = [
  // Morning Adhkar
  {
    id: "m1",
    category: "morning",
    arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    transliteration: "Asbahna wa asbahal-mulku lillah, wal-hamdu lillah, la ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa Huwa 'ala kulli shay'in Qadeer.",
    translation: "We have reached the morning and at this very time all sovereignty belongs to Allah. All praise is due to Allah. None has the right to be worshipped but Allah alone, Who has no partner. His is the sovereignty and His is the praise, and He can do all things.",
    source: "Sahih Muslim 2723",
    targetCount: 1,
  },
  {
    id: "m2",
    category: "morning",
    arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",
    transliteration: "Allahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namootu wa ilaykan-nushoor.",
    translation: "O Allah, by You we have reached the morning, and by You we reach the evening. By You we live, and by You we die, and unto You is our resurrection.",
    source: "Jami` at-Tirmidhi 3391",
    targetCount: 1,
  },
  {
    id: "m3",
    category: "morning",
    arabic: "اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لاَ يَغْفِرُ الذُّنُوبَ إِلاَّ أَنْتَ",
    transliteration: "Allahumma Anta Rabbi la ilaha illa Anta, khalaqtani wa ana 'abduka, wa ana 'ala 'ahdika wa wa'dika mastata'tu, a'oodhu bika min sharri ma sana'tu, aboo'u laka bini'matika 'alayya, wa aboo'u bidhanbi faghfir li fa-innahu la yaghfirudh-dhunooba illa Anta.",
    translation: "O Allah, You are my Lord; none has the right to be worshipped but You. You created me and I am Your slave, and I abide by Your covenant and promise as best I can. I seek refuge in You from the evil of what I have done. I acknowledge Your favor upon me and I acknowledge my sin, so forgive me, for none forgives sins but You. (Sayyid al-Istighfar)",
    source: "Sahih al-Bukhari 6306",
    targetCount: 1,
  },
  {
    id: "m4",
    category: "morning",
    arabic: "بِسْمِ اللَّهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلاَ فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    transliteration: "Bismillahi-lladhi la yadurru ma'as-mihi shay'un fil-ardi wa la fis-sama'i wa Huwas-Sami'ul-'Aleem.",
    translation: "In the name of Allah, with Whose name nothing can cause harm in the earth nor in the heavens, and He is the All-Hearing, the All-Knowing.",
    source: "Sunan Abi Dawud 5088",
    targetCount: 3,
  },
  {
    id: "m5",
    category: "morning",
    arabic: "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالإِسْلاَمِ دِينًا، وَبِمُحَمَّدٍ صلى الله عليه وسلم نَبِيًّا",
    transliteration: "Radeetu billahi Rabban, wa bil-Islami deenan, wa bi-Muhammadin sallallahu 'alayhi wa sallama Nabiyya.",
    translation: "I am pleased with Allah as my Lord, with Islam as my religion, and with Muhammad (peace and blessings be upon him) as my Prophet.",
    source: "Sunan Abi Dawud 5072",
    targetCount: 3,
  },
  {
    id: "m6",
    category: "morning",
    arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ: عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ",
    transliteration: "Subhanallahi wa bihamdihi: 'Adada khalqihi, wa rida nafsihi, wa zinata 'arshihi, wa midada kalimatihi.",
    translation: "Glory be to Allah and praise is to Him: by the multitude of His creation, by His pleasure, by the weight of His Throne, and by the ink of His words.",
    source: "Sahih Muslim 2726",
    targetCount: 3,
  },

  // Evening Adhkar
  {
    id: "e1",
    category: "evening",
    arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ",
    transliteration: "Amsayna wa amsal-mulku lillah, wal-hamdu lillah, la ilaha illallahu wahdahu la sharika lah.",
    translation: "We have reached the evening and at this very time all sovereignty belongs to Allah. All praise is due to Allah. None has the right to be worshipped but Allah alone, Who has no partner.",
    source: "Sahih Muslim 2723",
    targetCount: 1,
  },
  {
    id: "e2",
    category: "evening",
    arabic: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ",
    transliteration: "Allahumma bika amsayna, wa bika asbahna, wa bika nahya, wa bika namootu wa ilaykal-maseer.",
    translation: "O Allah, by You we have reached the evening, and by You we reach the morning. By You we live, and by You we die, and unto You is our return.",
    source: "Jami` at-Tirmidhi 3391",
    targetCount: 1,
  },
  {
    id: "e3",
    category: "evening",
    arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    transliteration: "A'oodhu bikalimatil-lahit-tammati min sharri ma khalaq.",
    translation: "I seek refuge in the perfect words of Allah from the evil of what He has created.",
    source: "Sahih Muslim 2709",
    targetCount: 3,
  },
  {
    id: "e4",
    category: "evening",
    arabic: "بِسْمِ اللَّهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلاَ فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    transliteration: "Bismillahi-lladhi la yadurru ma'as-mihi shay'un fil-ardi wa la fis-sama'i wa Huwas-Sami'ul-'Aleem.",
    translation: "In the name of Allah, with Whose name nothing can cause harm in the earth nor in the heavens, and He is the All-Hearing, the All-Knowing.",
    source: "Sunan Abi Dawud 5088",
    targetCount: 3,
  },

  // After Salah
  {
    id: "as1",
    category: "after_salah",
    arabic: "أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ. اللَّهُمَّ أَنْتَ السَّلاَمُ وَمِنْكَ السَّلاَمُ، تَبَارَكْتَ يَا ذَا الْجَلاَلِ وَالإِكْرَامِ",
    transliteration: "Astaghfirullah, Astaghfirullah, Astaghfirullah. Allahumma Antas-Salamu wa minkas-salam, tabarakta ya Dhal-Jalali wal-Ikram.",
    translation: "I ask Allah for forgiveness (3x). O Allah, You are Peace and from You comes peace. Blessed are You, O Owner of majesty and honor.",
    source: "Sahih Muslim 591",
    targetCount: 1,
  },
  {
    id: "as2",
    category: "after_salah",
    arabic: "سُبْحَانَ اللَّهِ (٣٣)، الْحَمْدُ لِلَّهِ (٣٣)، اللَّهُ أَكْبَرُ (٣٣)، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    transliteration: "SubhanAllah (33x), Alhamdulillah (33x), Allahu Akbar (33x), La ilaha illallahu wahdahu la sharika lah...",
    translation: "Glory be to Allah (33 times), Praise be to Allah (33 times), Allah is the Greatest (33 times), None has the right to be worshipped but Allah alone...",
    source: "Sahih Muslim 597",
    targetCount: 1,
  },
  {
    id: "as3",
    category: "after_salah",
    arabic: "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ، وَشُكْرِكَ، وَحُسْنِ عِبَادَتِكَ",
    transliteration: "Allahumma a'inni 'ala dhikrika, wa shukrika, wa husni 'ibadatika.",
    translation: "O Allah, help me to remember You, to thank You, and to worship You in an excellent manner.",
    source: "Sunan Abi Dawud 1522",
    targetCount: 1,
  },

  // Sleep
  {
    id: "s1",
    category: "sleep",
    arabic: "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ، فَإِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ",
    transliteration: "Bismika Rabbi wada'tu janbi, wa bika arfa'uh, fa in amsakta nafsi farhamha, wa in arsaltaha fahfazha bima tahfazu bihi 'ibadakas-saliheen.",
    translation: "In Your name my Lord, I lie down and in Your name I rise up. If You take my soul, have mercy upon it, and if You send it back, protect it with that which You protect Your righteous slaves.",
    source: "Sahih al-Bukhari 6320",
    targetCount: 1,
  },
  {
    id: "s2",
    category: "sleep",
    arabic: "اللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا",
    transliteration: "Allahumma bismika amootu wa ahya.",
    translation: "O Allah, in Your name I die and I live.",
    source: "Sahih al-Bukhari 6324",
    targetCount: 1,
  },
];
