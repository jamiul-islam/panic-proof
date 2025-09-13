import type { DownloadResumable } from 'expo-file-system';

// Lazy import FileSystem to avoid requiring the module until needed
async function getFS() {
  const FileSystem = await import('expo-file-system');
  return FileSystem;
}

export type ModelMetadata = {
  filename: string;
  version: string;
  size?: number;
  sha256?: string;
  lastUpdated?: string;
};

export const MODEL_DIR = 'llm';
export const METADATA_FILE = 'metadata.json';

export async function getModelDirUri() {
  const FS = await getFS();
  return FS.documentDirectory + MODEL_DIR + '/';
}

export async function ensureModelDir() {
  const FS = await getFS();
  const dir = await getModelDirUri();
  const info = await FS.getInfoAsync(dir);
  if (!info.exists) {
    await FS.makeDirectoryAsync(dir, { intermediates: true });
  }
  return dir;
}

export async function getModelPath(filename: string) {
  const dir = await getModelDirUri();
  return dir + filename;
}

export async function getMetadata(): Promise<ModelMetadata | null> {
  const FS = await getFS();
  const dir = await getModelDirUri();
  const path = dir + METADATA_FILE;
  const info = await FS.getInfoAsync(path);
  if (!info.exists) return null;
  try {
    const txt = await FS.readAsStringAsync(path);
    return JSON.parse(txt);
  } catch {
    return null;
  }
}

export async function setMetadata(meta: ModelMetadata) {
  const FS = await getFS();
  const dir = await ensureModelDir();
  const path = dir + METADATA_FILE;
  await FS.writeAsStringAsync(path, JSON.stringify(meta));
}

export async function clearMetadata() {
  const FS = await getFS();
  const dir = await ensureModelDir();
  const path = dir + METADATA_FILE;
  try {
    await FS.deleteAsync(path, { idempotent: true });
  } catch {}
}

export type DownloadHandle = {
  download: DownloadResumable;
  cancel: () => Promise<void>;
};

export async function startDownload(url: string, targetFilename: string, onProgress?: (pct: number) => void): Promise<DownloadHandle> {
  const FS = await getFS();
  await ensureModelDir();
  const dest = await getModelPath(targetFilename);
  const callback = onProgress
    ? ({ totalBytesWritten, totalBytesExpectedToWrite }: any) => {
        if (totalBytesExpectedToWrite > 0) {
          onProgress((totalBytesWritten / totalBytesExpectedToWrite) * 100);
        }
      }
    : undefined;
  const download = FS.createDownloadResumable(url, dest, {}, callback as any);
  return {
    download,
    cancel: async () => {
      try {
        await download.pauseAsync();
      } catch {}
      try {
        await FS.deleteAsync(dest, { idempotent: true });
      } catch {}
    },
  };
}

export async function verifyModel(meta: ModelMetadata): Promise<boolean> {
  // Basic verification: file exists and (optionally) matches size
  const FS = await getFS();
  const path = await getModelPath(meta.filename);
  const info = await FS.getInfoAsync(path);
  if (!info.exists) return false;
  if (meta.size && info.size != null && info.size !== meta.size) return false;
  // SHA-256 verification could be added with expo-crypto if desired
  return true;
}

export async function removeModel(meta: ModelMetadata) {
  const FS = await getFS();
  const path = await getModelPath(meta.filename);
  try {
    await FS.deleteAsync(path, { idempotent: true });
  } catch {}
  await clearMetadata();
}
