
import { Translation } from "../types";

export interface VerseData {
  number: number;
  text: string;
  isNotice?: boolean;
}

export interface BibleBook {
  name: string;
  chapters: number;
  isHistorical?: boolean;
}

const DB_NAME = 'HolyBibleDB_v2';
const STORE_NAME = 'Chapters_Cache';
const DB_VERSION = 1;

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const getFromDB = async (key: string): Promise<VerseData[] | null> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch { return null; }
};

const saveToDB = async (key: string, data: VerseData[]) => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.put(data, key);
  } catch {}
};

export const BIBLE_BOOKS: BibleBook[] = [
  { name: "Genesis", chapters: 50 }, { name: "Exodus", chapters: 40 }, { name: "Leviticus", chapters: 27 },
  { name: "Numbers", chapters: 36 }, { name: "Deuteronomy", chapters: 34 }, { name: "Joshua", chapters: 24 },
  { name: "Judges", chapters: 21 }, { name: "Ruth", chapters: 4 }, { name: "1 Samuel", chapters: 31 },
  { name: "2 Samuel", chapters: 24 }, { name: "1 Kings", chapters: 22 }, { name: "2 Kings", chapters: 25 },
  { name: "1 Chronicles", chapters: 29 }, { name: "2 Chronicles", chapters: 36 }, { name: "Ezra", chapters: 10 },
  { name: "Nehemiah", chapters: 13 }, { name: "Esther", chapters: 10 }, { name: "Job", chapters: 42 },
  { name: "Psalms", chapters: 150 }, { name: "Proverbs", chapters: 31 }, { name: "Ecclesiastes", chapters: 12 },
  { name: "Song of Solomon", chapters: 8 }, { name: "Isaiah", chapters: 66 }, { name: "Jeremiah", chapters: 52 },
  { name: "Lamentations", chapters: 5 }, { name: "Ezekiel", chapters: 48 }, { name: "Daniel", chapters: 12 },
  { name: "Hosea", chapters: 14 }, { name: "Joel", chapters: 3 }, { name: "Amos", chapters: 9 },
  { name: "Obadiah", chapters: 1 }, { name: "Jonah", chapters: 4 }, { name: "Micah", chapters: 7 },
  { name: "Nahum", chapters: 3 }, { name: "Habakkuk", chapters: 3 }, { name: "Zephaniah", chapters: 3 },
  { name: "Haggai", chapters: 2 }, { name: "Zechariah", chapters: 14 }, { name: "Malachi", chapters: 4 },
  { name: "Matthew", chapters: 28 }, { name: "Mark", chapters: 16 }, { name: "Luke", chapters: 24 },
  { name: "John", chapters: 21 }, { name: "Acts", chapters: 28 }, { name: "Romans", chapters: 16 },
  { name: "1 Corinthians", chapters: 16 }, { name: "2 Corinthians", chapters: 13 }, { name: "Galatians", chapters: 6 },
  { name: "Ephesians", chapters: 6 }, { name: "Philippians", chapters: 4 }, { name: "Colossians", chapters: 4 },
  { name: "1 Thessalonians", chapters: 5 }, { name: "2 Thessalonians", chapters: 3 }, { name: "1 Timothy", chapters: 6 },
  { name: "2 Timothy", chapters: 4 }, { name: "Titus", chapters: 3 }, { name: "Philemon", chapters: 1 },
  { name: "Hebrews", chapters: 13 }, { name: "James", chapters: 5 }, { name: "1 Peter", chapters: 5 },
  { name: "2 Peter", chapters: 3 }, { name: "1 John", chapters: 5 }, { name: "2 John", chapters: 1 },
  { name: "3 John", chapters: 1 }, { name: "Jude", chapters: 1 }, { name: "Revelation", chapters: 22 }
];

export const HISTORICAL_BOOKS: BibleBook[] = [
  { name: "Tobit", chapters: 14, isHistorical: true },
  { name: "Judith", chapters: 16, isHistorical: true },
  { name: "Wisdom", chapters: 19, isHistorical: true },
  { name: "Sirach", chapters: 51, isHistorical: true },
  { name: "Baruch", chapters: 6, isHistorical: true },
  { name: "1 Maccabees", chapters: 16, isHistorical: true },
  { name: "2 Maccabees", chapters: 15, isHistorical: true }
];

const fetchWithRetry = async (url: string, retries = 2): Promise<any> => {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      if (i === retries) throw err;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
};

export const getVerseText = async (translation: Translation, book: string, chapter: string): Promise<VerseData[]> => {
  const key = `${translation}_${book}_${chapter}`;
  const cached = await getFromDB(key);
  if (cached) return cached;

  try {
    const translationQuery = translation.toLowerCase();
    const data = await fetchWithRetry(`https://bible-api.com/${book}%20${chapter}?translation=${translationQuery}`);
    
    if (!data.verses || data.verses.length === 0) {
      throw new Error("No verses returned");
    }

    const verses = data.verses.map((v: any) => ({ 
      number: v.verse, 
      text: v.text.trim() 
    }));
    
    saveToDB(key, verses);
    return verses;
  } catch (error) {
    console.error("Bible Engine Error:", error);
    return [{ number: 0, text: "AI unavailable right now. Please continue reading (Check your connection).", isNotice: true }];
  }
};

export const isChapterOffline = async (translation: Translation, book: string, chapter: string): Promise<boolean> => {
  return !!(await getFromDB(`${translation}_${book}_${chapter}`));
};

export const downloadFullKJV = async (onProgress: (p: number) => void) => {
  const books = [...BIBLE_BOOKS, ...HISTORICAL_BOOKS];
  const total = books.reduce((acc, b) => acc + b.chapters, 0);
  let current = 0;
  for (const book of books) {
    for (let c = 1; c <= book.chapters; c++) {
      try {
        await getVerseText(Translation.KJV, book.name, c.toString());
      } catch (e) {
        console.warn(`Sync failed for ${book.name} ${c}`);
      }
      current++;
      onProgress(Math.floor((current / total) * 100));
      // Adaptive delay to prevent UI freezing
      if (current % 15 === 0) await new Promise(r => setTimeout(r, 20));
    }
  }
};

export const prefetchAdjacent = (translation: Translation, book: string, chapter: string) => {
  const cNum = parseInt(chapter);
  const books = [...BIBLE_BOOKS, ...HISTORICAL_BOOKS];
  const b = books.find(x => x.name === book);
  if (!b) return;
  if (cNum < b.chapters) getVerseText(translation, book, (cNum + 1).toString());
  if (cNum > 1) getVerseText(translation, book, (cNum - 1).toString());
};
