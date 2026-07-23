import type { Theme } from '../../types';
import { shadowStyles } from './styles';

export interface ShadowHost {
  host: HTMLElement;
  root: HTMLElement;
  setTheme(theme: Theme): void;
  destroy(): void;
}

function resolveTheme(theme: Theme): 'light' | 'dark' {
  if (theme !== 'system') return theme;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Create a fixed-position shadow-DOM host. The host carries positioning; the
 * inner .root carries theme variables and typography.
 */
export function createShadowHost(id: string, theme: Theme): ShadowHost {
  const host = document.createElement('div');
  host.id = id;
  host.style.cssText =
    'position:fixed;top:0;left:0;z-index:2147483646;width:0;height:0;overflow:visible;';

  const shadow = host.attachShadow({ mode: 'closed' });
  const style = document.createElement('style');
  style.textContent = shadowStyles;
  shadow.appendChild(style);

  const root = document.createElement('div');
  root.className = 'root';
  root.dataset.theme = resolveTheme(theme);
  shadow.appendChild(root);

  document.documentElement.appendChild(host);

  return {
    host,
    root,
    setTheme(next: Theme) {
      root.dataset.theme = resolveTheme(next);
    },
    destroy() {
      host.remove();
    },
  };
}

/** Clamp a desired position so a box stays inside the viewport with a margin. */
export function clampToViewport(
  x: number,
  y: number,
  width: number,
  height: number,
  margin = 12,
): { x: number; y: number } {
  return {
    x: Math.min(Math.max(x, margin), Math.max(margin, window.innerWidth - width - margin)),
    y: Math.min(Math.max(y, margin), Math.max(margin, window.innerHeight - height - margin)),
  };
}
