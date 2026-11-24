import { Chapter, ChapterAudioResponse, ChapterDetailResponse, ChaptersResponse, VersesResponse } from "@/types/quran";

const QURAN_API_BASE = "https://api.quran.com/api/v4";

// Reciter 7 = Mishary Rashid Alafasy (vocal-only, widely listened and verified)
export const DEFAULT_RECITER_ID = 7;
export const DEFAULT_RECITER_NAME = "Mishary Rashid Alafasy";

export function getAyahAudioUrl(surah: number, ayahInSurah: number): string {
  const s = String(surah).padStart(3, "0");
  const a = String(ayahInSurah).padStart(3, "0");
  return `https://verses.quran.com/Alafasy/mp3/${s}${a}.mp3`;
}

export interface ParahAyah {
  number: number; // global ayah number (1 - 6236)
  numberInSurah: number;
  surahNumber: number;
  surahNameArabic: string;
  surahNameEnglish: string;
  textUthmani: string;
  translation: string;
  audioUrl: string;
}

export async function getAllChapters(): Promise<Chapter[]> {
  const url = `${QURAN_API_BASE}/chapters?language=en`;
  const response = await fetch(url, {
    next: { revalidate: 86400 }, // Cache 24 hours
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch chapters: ${response.statusText}`);
  }

  const data: ChaptersResponse = await response.json();
  return data.chapters;
}

export async function getChapterDetails(chapterId: number): Promise<Chapter> {
  const url = `${QURAN_API_BASE}/chapters/${chapterId}?language=en`;
  const response = await fetch(url, {
    next: { revalidate: 86400 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch chapter ${chapterId}: ${response.statusText}`);
  }

  const data: ChapterDetailResponse = await response.json();
  return data.chapter;
}

export async function getChapterVerses(
  chapterId: number,
  page: number = 1,
  perPage: number = 300
): Promise<VersesResponse> {
  // 131: The Clear Quran by Dr. Mustafa Khattab / Saheeh International
  const url = `${QURAN_API_BASE}/verses/by_chapter/${chapterId}?language=en&words=false&translations=131&fields=text_uthmani&page=${page}&per_page=${perPage}`;
  
  const response = await fetch(url, {
    next: { revalidate: 86400 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch verses for chapter ${chapterId}: ${response.statusText}`);
  }

  return response.json();
}

export async function getChapterAudio(
  chapterId: number,
  reciterId: number = DEFAULT_RECITER_ID
): Promise<ChapterAudioResponse> {
  const url = `${QURAN_API_BASE}/chapter_recitations/${reciterId}/${chapterId}`;
  
  const response = await fetch(url, {
    next: { revalidate: 86400 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch audio for chapter ${chapterId}: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch Parah (Juz 1-30) verses using verified AlQuran Cloud API with Quran.com fallback
 */
export async function getParahVerses(juzNumber: number): Promise<ParahAyah[]> {
  try {
    const [uthmaniRes, translationRes] = await Promise.all([
      fetch(`https://api.alquran.cloud/v1/juz/${juzNumber}/quran-uthmani`, {
        next: { revalidate: 86400 },
      }),
      fetch(`https://api.alquran.cloud/v1/juz/${juzNumber}/en.sahih`, {
        next: { revalidate: 86400 },
      }),
    ]);

    if (uthmaniRes.ok && translationRes.ok) {
      const uthmaniData = await uthmaniRes.json();
      const translationData = await translationRes.json();

      if (uthmaniData?.data?.ayahs && translationData?.data?.ayahs) {
        const translationsMap = new Map<number, string>();
        for (const a of translationData.data.ayahs) {
          translationsMap.set(a.number, a.text);
        }

        return uthmaniData.data.ayahs.map((ayah: any): ParahAyah => {
          const surahNum = ayah.surah?.number || 1;
          const numInSurah = ayah.numberInSurah || 1;
          return {
            number: ayah.number,
            numberInSurah: numInSurah,
            surahNumber: surahNum,
            surahNameArabic: ayah.surah?.name || "",
            surahNameEnglish: ayah.surah?.englishName || `Surah ${surahNum}`,
            textUthmani: ayah.text,
            translation: translationsMap.get(ayah.number) || "",
            audioUrl: getAyahAudioUrl(surahNum, numInSurah),
          };
        });
      }
    }
  } catch (err) {
    console.warn("AlQuran Cloud fetch error, attempting fallback to Quran.com:", err);
  }

  // Fallback to Quran.com API by Juz
  const fallbackUrl = `${QURAN_API_BASE}/verses/by_juz/${juzNumber}?language=en&words=false&translations=131&fields=text_uthmani&per_page=350`;
  const fallbackRes = await fetch(fallbackUrl, {
    next: { revalidate: 86400 },
  });

  if (!fallbackRes.ok) {
    throw new Error(`Failed to fetch verses for Juz ${juzNumber}`);
  }

  const fallbackData: VersesResponse = await fallbackRes.json();
  return fallbackData.verses.map((v) => {
    const parts = v.verse_key.split(":");
    const surahNum = parseInt(parts[0], 10) || 1;
    const ayahInSurah = parseInt(parts[1], 10) || v.verse_number;
    return {
      number: v.id,
      numberInSurah: ayahInSurah,
      surahNumber: surahNum,
      surahNameArabic: "",
      surahNameEnglish: `Surah ${surahNum}`,
      textUthmani: v.text_uthmani,
      translation: v.translations?.[0]?.text?.replace(/<[^>]*>/g, "") || "",
      audioUrl: getAyahAudioUrl(surahNum, ayahInSurah),
    };
  });
}
