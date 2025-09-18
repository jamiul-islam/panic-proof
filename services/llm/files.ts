import * as FileSystem from 'expo-file-system';

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
  return (FileSystem.documentDirectory || FileSystem.cacheDirectory || '') + MODEL_DIR + '/';
}

export async function ensureModelDir() {
  const dir = await getModelDirUri();
  const info = await FileSystem.getInfoAsync(dir);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }
  return dir;
}

export async function getModelPath(filename: string) {
  const dir = await getModelDirUri();
  return dir + filename;
}

export async function getMetadata(): Promise<ModelMetadata | null> {
  const dir = await getModelDirUri();
  const path = dir + METADATA_FILE;
  const info = await FileSystem.getInfoAsync(path);
  if (!info.exists) return null;
  try {
    const txt = await FileSystem.readAsStringAsync(path);
    return JSON.parse(txt);
  } catch {
    return null;
  }
}

export async function setMetadata(meta: ModelMetadata) {
  const dir = await ensureModelDir();
  const path = dir + METADATA_FILE;
  await FileSystem.writeAsStringAsync(path, JSON.stringify(meta));
}

export async function clearMetadata() {
  const dir = await ensureModelDir();
  const path = dir + METADATA_FILE;
  try {
    await FileSystem.deleteAsync(path, { idempotent: true });
  } catch {}
}

export type DownloadHandle = {
  download: FileSystem.DownloadResumable;
  cancel: () => Promise<void>;
};

export async function startDownload(url: string, targetFilename: string, onProgress?: (pct: number) => void): Promise<DownloadHandle> {
  await ensureModelDir();
  const dest = await getModelPath(targetFilename);
  const callback = onProgress
    ? ({ totalBytesWritten, totalBytesExpectedToWrite }: any) => {
        if (totalBytesExpectedToWrite > 0) {
          onProgress((totalBytesWritten / totalBytesExpectedToWrite) * 100);
        }
      }
    : undefined;
  const download = FileSystem.createDownloadResumable(url, dest, {}, callback as any);
  return {
    download,
    cancel: async () => {
      try {
        await download.pauseAsync();
      } catch {}
      try {
        await FileSystem.deleteAsync(dest, { idempotent: true });
      } catch {}
    },
  };
}

export async function verifyModel(meta: ModelMetadata): Promise<boolean> {
  // Basic verification: file exists and (optionally) matches size
  const path = await getModelPath(meta.filename);
  const info = await FileSystem.getInfoAsync(path);
  if (!info.exists) return false;
  if (meta.size && info.size != null && info.size !== meta.size) return false;
  // SHA-256 verification could be added with expo-crypto if desired
  return true;
}

export async function removeModel(meta: ModelMetadata) {
  const path = await getModelPath(meta.filename);
  try {
    await FileSystem.deleteAsync(path, { idempotent: true });
  } catch {}
  await clearMetadata();
}
