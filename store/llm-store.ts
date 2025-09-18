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
      console.log('[LLM] init');
      const meta = await getMetadata();
      if (!meta) {
        console.log('[LLM] metadata: none');
        set({ modelStatus: 'not_installed', modelMeta: null });
        return;
      }
      const ok = await verifyModel(meta);
      console.log('[LLM] verifyModel:', ok);
      set({ modelStatus: ok ? 'ready' : 'not_installed', modelMeta: ok ? meta : null });
    } catch (e: any) {
      console.log('[LLM] init error:', e?.message);
      set({ modelStatus: 'error', error: e?.message || 'Init failed' });
    }
  },

  downloadModel: async (url, filename, meta) => {
    try {
      console.log('[LLM] download start', { url, filename });
      set({ modelStatus: 'downloading', progress: 0, error: null });
      currentHandle = await startDownload(url, filename, (pct) => {
        const p = Math.max(0, Math.min(100, pct));
        set({ progress: p });
      });
      // @ts-ignore - run the download
      const result = await currentHandle.download.downloadAsync();
      console.log('[LLM] download finished', result?.uri);
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
      console.log('[LLM] verify after download:', ok);
      if (!ok) throw new Error('Model verification failed');
      set({ modelStatus: 'ready', modelMeta: toWrite, progress: 100 });
    } catch (e: any) {
      console.log('[LLM] download error:', e?.message);
      set({ modelStatus: 'error', error: e?.message || 'Download failed' });
    } finally {
      currentHandle = null;
    }
  },

  cancelDownload: async () => {
    if (currentHandle) {
      console.log('[LLM] cancel download');
      await currentHandle.cancel();
      currentHandle = null;
    }
    set({ modelStatus: 'not_installed', progress: 0 });
  },
  deleteModel: async () => {
    const { modelMeta } = get();
    if (modelMeta) {
      console.log('[LLM] delete model', modelMeta.filename);
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
