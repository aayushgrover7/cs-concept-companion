import type { ConceptExplanation, Theme } from '../../types';
import { createShadowHost, clampToViewport, type ShadowHost } from './host';
import {
  bookmarkFilledIcon,
  bookmarkIcon,
  checkIcon,
  chevronDownIcon,
  chevronUpIcon,
  closeIcon,
  copyIcon,
  refreshIcon,
} from './icons';

export interface CardCallbacks {
  onClose(): void;
  onRetry(): void;
  onRegenerate(): void;
  onSave(explanation: ConceptExplanation): Promise<boolean>;
  onExplainRelated(concept: string): void;
  isSaved(concept: string): Promise<boolean>;
}

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className = '',
  text = '',
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function iconButton(icon: string, label: string, extraClass = ''): HTMLButtonElement {
  const button = el('button', `btn icon-btn ${extraClass}`.trim());
  button.type = 'button';
  button.setAttribute('aria-label', label);
  button.title = label;
  button.innerHTML = icon;
  return button;
}

/** The inline explanation card, rendered inside a closed shadow root. */
export class ExplanationCard {
  private shadowHost: ShadowHost | null = null;
  private card: HTMLElement | null = null;
  private anchorRect: DOMRect | null = null;
  private expanded = false;

  constructor(
    private theme: Theme,
    private callbacks: CardCallbacks,
  ) {}

  get visible(): boolean {
    return this.shadowHost !== null;
  }

  contains(target: EventTarget | null): boolean {
    return target instanceof Node && this.shadowHost?.host.contains(target) === true;
  }

  setTheme(theme: Theme): void {
    this.theme = theme;
    this.shadowHost?.setTheme(theme);
  }

  close(): void {
    this.shadowHost?.destroy();
    this.shadowHost = null;
    this.card = null;
    this.expanded = false;
  }

  showLoading(anchorRect?: DOMRect): void {
    const body = el('div');
    body.appendChild(el('div', 'skeleton-line skeleton-title'));
    for (const width of ['w90', 'w75', 'w90', 'w60']) {
      body.appendChild(el('div', `skeleton-line ${width}`));
    }
    this.render(body, { anchorRect, label: 'Loading explanation' });
  }

  showError(message: string, retryable: boolean, anchorRect?: DOMRect): void {
    const box = el('div', 'error-box');
    box.appendChild(el('div', 'error-title', 'Could not explain that'));
    box.appendChild(el('p', 'error-msg', message));
    if (retryable) {
      const retry = el('button', 'btn retry-btn', 'Try again');
      retry.type = 'button';
      retry.addEventListener('click', () => this.callbacks.onRetry());
      box.appendChild(retry);
    }
    this.render(box, { anchorRect, label: 'Explanation error' });
  }

  showExplanation(explanation: ConceptExplanation, anchorRect?: DOMRect): void {
    const body = el('div');
    body.appendChild(el('p', 'short', explanation.shortExplanation));

    if (explanation.notCsConcept) {
      body.appendChild(el('p', 'not-cs', 'Tip: this works best on specific technical terms.'));
      if (explanation.relatedConcepts.length > 0) {
        body.appendChild(this.chips(explanation.relatedConcepts));
      }
      this.render(body, { explanation, label: `About ${explanation.concept}`, anchorRect });
      return;
    }

    const details = el('div');
    details.hidden = !this.expanded;

    if (explanation.detailedExplanation) {
      details.appendChild(this.section('In more depth', explanation.detailedExplanation));
    }
    if (explanation.example) {
      const section = el('div', 'section');
      section.appendChild(el('div', 'section-label', 'Example'));
      section.appendChild(el('pre', 'example', explanation.example));
      details.appendChild(section);
    }
    if (explanation.analogy) {
      const section = el('div', 'section');
      section.appendChild(el('div', 'section-label', 'Analogy'));
      const p = el('p', 'analogy', explanation.analogy);
      section.appendChild(p);
      details.appendChild(section);
    }
    if (explanation.whyItMatters) {
      details.appendChild(this.section('Why it matters', explanation.whyItMatters));
    }
    if (explanation.relatedConcepts.length > 0) {
      const section = el('div', 'section');
      section.appendChild(el('div', 'section-label', 'Related concepts'));
      section.appendChild(this.chips(explanation.relatedConcepts));
      details.appendChild(section);
    }

    const toggle = el('button', 'btn expand-btn');
    toggle.type = 'button';
    const setToggleState = (): void => {
      toggle.innerHTML = this.expanded
        ? `${chevronUpIcon}<span>Show less</span>`
        : `${chevronDownIcon}<span>Show more</span>`;
      toggle.setAttribute('aria-expanded', String(this.expanded));
    };
    setToggleState();
    toggle.addEventListener('click', () => {
      this.expanded = !this.expanded;
      details.hidden = !this.expanded;
      setToggleState();
    });

    body.appendChild(details);
    body.appendChild(toggle);
    this.render(body, { explanation, label: `Explanation of ${explanation.concept}`, anchorRect });
  }

  private section(label: string, text: string): HTMLElement {
    const section = el('div', 'section');
    section.appendChild(el('div', 'section-label', label));
    section.appendChild(el('p', '', text));
    return section;
  }

  private chips(concepts: string[]): HTMLElement {
    const wrap = el('div', 'chips');
    for (const concept of concepts) {
      const chip = el('button', 'chip', concept);
      chip.type = 'button';
      chip.setAttribute('aria-label', `Explain ${concept}`);
      chip.addEventListener('click', () => this.callbacks.onExplainRelated(concept));
      wrap.appendChild(chip);
    }
    return wrap;
  }

  private render(
    body: HTMLElement,
    options: { explanation?: ConceptExplanation; label: string; anchorRect?: DOMRect },
  ): void {
    if (options.anchorRect) this.anchorRect = options.anchorRect;
    const previous = this.shadowHost;
    this.shadowHost = createShadowHost('cs-concept-companion-card', this.theme);

    const card = el('div', 'card');
    card.setAttribute('role', 'dialog');
    card.setAttribute('aria-label', options.label);
    card.tabIndex = -1;
    this.card = card;

    card.appendChild(this.header(options.explanation));

    const bodyWrap = el('div', 'card-body');
    bodyWrap.appendChild(body);
    card.appendChild(bodyWrap);

    if (options.explanation && !options.explanation.notCsConcept) {
      card.appendChild(this.footer(options.explanation));
    } else if (options.explanation) {
      const footer = el('div', 'card-footer');
      footer.appendChild(el('span', 'source', options.explanation.source));
      card.appendChild(footer);
    }

    this.shadowHost.root.appendChild(card);
    this.position();
    previous?.destroy();
    card.focus({ preventScroll: true });
  }

  private header(explanation?: ConceptExplanation): HTMLElement {
    const header = el('div', 'card-header');
    const titleWrap = el('div', 'card-title-wrap');
    titleWrap.appendChild(el('div', 'card-eyebrow', 'CS Concept Companion'));

    if (explanation) {
      titleWrap.appendChild(el('h2', 'card-title', explanation.concept));
      if (!explanation.notCsConcept) {
        const badges = el('div', 'badges');
        badges.appendChild(el('span', 'badge difficulty', explanation.difficulty));
        badges.appendChild(el('span', 'badge', explanation.source));
        titleWrap.appendChild(badges);
      }
    } else {
      titleWrap.appendChild(el('h2', 'card-title', 'Looking that up…'));
    }

    header.appendChild(titleWrap);

    const close = iconButton(closeIcon, 'Close explanation');
    close.addEventListener('click', () => this.callbacks.onClose());
    header.appendChild(close);
    return header;
  }

  private footer(explanation: ConceptExplanation): HTMLElement {
    const footer = el('div', 'card-footer');

    const save = el('button', 'btn');
    save.type = 'button';
    const setSaveState = (saved: boolean): void => {
      save.innerHTML = saved
        ? `${bookmarkFilledIcon}<span>Saved</span>`
        : `${bookmarkIcon}<span>Save</span>`;
      save.classList.toggle('saved', saved);
      save.setAttribute('aria-label', saved ? 'Saved to your library' : 'Save concept to library');
      save.disabled = saved;
    };
    setSaveState(false);
    void this.callbacks.isSaved(explanation.concept).then((saved) => {
      if (saved) setSaveState(true);
    });
    save.addEventListener('click', () => {
      void this.callbacks.onSave(explanation).then((ok) => setSaveState(ok));
    });

    const copy = el('button', 'btn');
    copy.type = 'button';
    copy.innerHTML = `${copyIcon}<span>Copy</span>`;
    copy.setAttribute('aria-label', 'Copy explanation to clipboard');
    copy.addEventListener('click', () => {
      const text = [
        explanation.concept,
        '',
        explanation.shortExplanation,
        explanation.example ? `\nExample:\n${explanation.example}` : '',
        explanation.whyItMatters ? `\nWhy it matters: ${explanation.whyItMatters}` : '',
      ]
        .join('\n')
        .trim();
      void navigator.clipboard.writeText(text).then(() => {
        copy.innerHTML = `${checkIcon}<span>Copied</span>`;
        setTimeout(() => {
          copy.innerHTML = `${copyIcon}<span>Copy</span>`;
        }, 1500);
      });
    });

    const regenerate = iconButton(refreshIcon, 'Regenerate explanation');
    regenerate.addEventListener('click', () => this.callbacks.onRegenerate());

    footer.appendChild(save);
    footer.appendChild(copy);
    footer.appendChild(regenerate);
    footer.appendChild(el('div', 'spacer'));
    footer.appendChild(el('span', 'source', explanation.source));
    return footer;
  }

  private position(): void {
    if (!this.shadowHost || !this.card) return;
    const rect = this.anchorRect;
    const cardRect = this.card.getBoundingClientRect();
    const width = cardRect.width || 360;
    const height = cardRect.height || 240;

    const x = rect ? rect.left : window.innerWidth / 2 - width / 2;
    let y = rect ? rect.bottom + 10 : window.innerHeight / 2 - height / 2;
    if (rect && y + height > window.innerHeight - 12) {
      y = rect.top - height - 10;
    }
    const clamped = clampToViewport(x, y, width, height);
    this.shadowHost.host.style.transform = `translate(${Math.round(clamped.x)}px, ${Math.round(clamped.y)}px)`;
  }
}
