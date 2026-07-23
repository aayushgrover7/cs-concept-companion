/** Small inline SVG icons (stroke follows currentColor). */

const s = (paths: string, size = 14): string =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

/** Logo mark: code brackets around a lightbulb filament. */
export const logoIcon = (size = 16): string =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M7 5 3.5 12 7 19" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M17 5l3.5 7L17 19" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="12" cy="10.2" r="3.4" stroke="currentColor" stroke-width="2"/>
    <path d="M12 13.6v2.6M10.7 18.4h2.6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>`;

export const closeIcon = s('<path d="M18 6 6 18M6 6l12 12"/>');
export const copyIcon = s(
  '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',
);
export const checkIcon = s('<path d="M20 6 9 17l-5-5"/>');
export const bookmarkIcon = s('<path d="M19 21 12 16 5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"/>');
export const bookmarkFilledIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M19 21 12 16 5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"/></svg>`;
export const refreshIcon = s('<path d="M21 12a9 9 0 1 1-2.64-6.36M21 3v6h-6"/>');
export const chevronDownIcon = s('<path d="m6 9 6 6 6-6"/>', 12);
export const chevronUpIcon = s('<path d="m18 15-6-6-6 6"/>', 12);
