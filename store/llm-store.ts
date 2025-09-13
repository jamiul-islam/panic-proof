import { create } from 'zustand';
import type { LlmProvider } from '@/types/llm';
import { getServiceFor } from '@/services/llm';
import { startDownload, setMetadata, getMetadata, verifyModel, removeModel, type ModelMetadata } from '@/services/llm/files';

type ModelStatus = 'not_installed' | 'downloading' | 'ready' | 'error';

interface LlmState {
  provider: LlmProvider;
  modelStatus: ModelStatus;
  modelMeta: ModelMetadata | null;
  progress: number;
  error?: string | null;
  setProvider: (p: LlmProvider) => void;
  init: () => Promise<void>;
  downloadModel: (url: string, filename: string, meta: Omit<ModelMetadata, 'filename' | 'lastUpdated'>) => Promise<void>;
  cancelDownload: () => Promise<void>;
  deleteModel: () => Promise<void>;
}

let currentHandle: { cancel: () => Promise<void>; download?: any } | null = null;

export const useLlmStore = create<LlmState>((set, get) => ({
  provider: 'online',
  modelStatus: 'not_installed',
  modelMeta: null,
  progress: 0,
  error: null,

  setProvider: (p) => set({ provider: p }),

  init: async () => {
    try {
      const meta = await getMetadata();
      if (!meta) {
        set({ modelStatus: 'not_installed', modelMeta: null });
        return;
      }
      const ok = await verifyModel(meta);
      set({ modelStatus: ok ? 'ready' : 'not_installed', modelMeta: ok ? meta : null });
    } catch (e: any) {
      set({ modelStatus: 'error', error: e?.message || 'Init failed' });
    }
  },

  downloadModel: async (url, filename, meta) => {
    try {
      set({ modelStatus: 'downloading', progress: 0, error: null });
      currentHandle = await startDownload(url, filename, (pct) => set({ progress: pct }));
      // @ts-ignore - run the download
      const result = await currentHandle.download.downloadAsync();
      if (!result || !result.uri) throw new Error('Download failed');
      const toWrite: ModelMetadata = {
        filename,
        version: meta.version,
        size: meta.size,
        sha256: meta.sha256,
        lastUpdated: new Date().toISOString(),
      };
      await setMetadata(toWrite);
      const ok = await verifyModel(toWrite);
      if (!ok) throw new Error('Model verification failed');
      set({ modelStatus: 'ready', modelMeta: toWrite, progress: 100 });
    } catch (e: any) {
      set({ modelStatus: 'error', error: e?.message || 'Download failed' });
    } finally {
      currentHandle = null;
    }
  },

  cancelDownload: async () => {
    if (currentHandle) {
      await currentHandle.cancel();
      currentHandle = null;
    }
    set({ modelStatus: 'not_installed', progress: 0 });
  },
  deleteModel: async () => {
    const { modelMeta } = get();
    if (modelMeta) {
      await removeModel(modelMeta);
    }
    set({ modelStatus: 'not_installed', modelMeta: null, progress: 0 });
    // Optional: reset provider to online when local model is removed
    set({ provider: 'online' });
  },
}));

export function getSelectedService() {
  const { provider } = useLlmStore.getState();
  return getServiceFor(provider);
}
