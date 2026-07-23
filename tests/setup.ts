import { beforeEach } from 'vitest';

/** Minimal in-memory chrome.storage.local mock for storage-layer tests. */
class MemoryStorage {
  private data = new Map<string, unknown>();

  get(key: string): Promise<Record<string, unknown>> {
    return Promise.resolve(this.data.has(key) ? { [key]: this.data.get(key) } : {});
  }

  set(items: Record<string, unknown>): Promise<void> {
    for (const [key, value] of Object.entries(items)) this.data.set(key, value);
    return Promise.resolve();
  }

  remove(keys: string | string[]): Promise<void> {
    for (const key of Array.isArray(keys) ? keys : [keys]) this.data.delete(key);
    return Promise.resolve();
  }

  clear(): void {
    this.data.clear();
  }
}

const local = new MemoryStorage();

(globalThis as Record<string, unknown>).chrome = {
  storage: { local },
};

beforeEach(() => {
  local.clear();
});
