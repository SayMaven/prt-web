// lib/db.ts

const DB_NAME = "AudioEditorDB";
const STORE_NAME = "projects";
const DB_VERSION = 1;

export interface ProjectData {
  id: string;
  audioBlob: Blob;
  regions: Array<{ start: number; end: number; color: string; content?: string }>;
  zoom: number;
  timestamp: number;
}

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e: any) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = (e: any) => resolve(e.target.result);
    request.onerror = (e: any) => reject(e.target.error);
  });
};

export const saveProject = async (data: ProjectData) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(data);

    request.onsuccess = () => resolve("Saved");
    request.onerror = () => reject("Failed to save");
  });
};

export const loadProject = async (id: string): Promise<ProjectData | null> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = (e: any) => resolve(e.target.result || null);
    request.onerror = () => reject("Failed to load");
  });
};