import { Chapter, ChapterAudioResponse, ChapterDetailResponse, ChaptersResponse, VersesResponse } from "@/types/quran";

const QURAN_API_BASE = "https://api.quran.com/api/v4";

// Reciter 7 = Mishary Rashid Alafasy (vocal-only, widely listened and verified)
export const DEFAULT_RECITER_ID = 7;
export const DEFAULT_RECITER_NAME = "Mishary Rashid Alafasy";

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
