import type { Theme } from '../../types';
import { createShadowHost, clampToViewport, type ShadowHost } from './host';
import { logoIcon } from './icons';

/** The small floating "Explain" pill that appears near a selection. */
export class FloatingButton {
  private shadowHost: ShadowHost | null = null;

  constructor(
    private theme: Theme,
    private onClick: () => void,
  ) {}

  show(anchorRect: DOMRect): void {
    this.hide();
    this.shadowHost = createShadowHost('cs-concept-companion-fab', this.theme);

    const button = document.createElement('button');
    button.className = 'fab';
    button.type = 'button';
    button.setAttribute('aria-label', 'Explain highlighted text with CS Concept Companion');
    button.innerHTML = `${logoIcon(15)}<span>Explain</span>`;
    button.addEventListener('mousedown', (event) => event.preventDefault()); // keep the selection
    button.addEventListener('click', () => this.onClick());
    this.shadowHost.root.appendChild(button);

    // Prefer just below the end of the selection; flip above near the bottom edge.
    const estimatedWidth = 96;
    const estimatedHeight = 32;
    let y = anchorRect.bottom + 8;
    if (y + estimatedHeight > window.innerHeight - 12) {
      y = anchorRect.top - estimatedHeight - 8;
    }
    const { x, y: clampedY } = clampToViewport(
      anchorRect.left + anchorRect.width / 2 - estimatedWidth / 2,
      y,
      estimatedWidth,
      estimatedHeight,
    );
    this.shadowHost.host.style.transform = `translate(${Math.round(x)}px, ${Math.round(clampedY)}px)`;
  }

  hide(): void {
    this.shadowHost?.destroy();
    this.shadowHost = null;
  }

  setTheme(theme: Theme): void {
    this.theme = theme;
    this.shadowHost?.setTheme(theme);
  }

  get visible(): boolean {
    return this.shadowHost !== null;
  }

  contains(target: EventTarget | null): boolean {
    return target instanceof Node && this.shadowHost?.host.contains(target) === true;
  }
}
