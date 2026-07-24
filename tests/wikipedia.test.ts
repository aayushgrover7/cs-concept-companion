import { afterEach, describe, expect, it, vi } from 'vitest';
import { WikipediaProvider } from '../src/services/wikipediaProvider';
import { ExplanationError } from '../src/services/provider';
import { DEFAULT_SETTINGS, type ExplanationRequest } from '../src/types';

const provider = new WikipediaProvider();

function request(selectedText: string): ExplanationRequest {
  return {
    selectedText,
    surroundingText: '',
    pageTitle: '',
    pageUrl: 'https://example.com',
    nearestHeading: '',
  };
}

function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  } as Response;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('WikipediaProvider', () => {
  it('maps a summary into an explanation', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve(
          jsonResponse({
            type: 'standard',
            title: 'Polymorphism (computer science)',
            extract:
              'Polymorphism is the provision of a single interface to entities of different types. It is a core concept.',
            content_urls: { desktop: { page: 'https://en.wikipedia.org/wiki/Polymorphism' } },
          }),
        ),
      ),
    );

    const result = await provider.explain(request('some obscure phrase'), DEFAULT_SETTINGS);
    expect(result.concept).toBe('Polymorphism (computer science)');
    expect(result.shortExplanation).toContain('single interface');
    expect(result.source).toBe('Wikipedia');
  });

  it('falls back to search on a disambiguation page', async () => {
    const fetchMock = vi.fn((input: string) => {
      if (input.includes('action=query')) {
        return Promise.resolve(
          jsonResponse({ query: { search: [{ title: 'Tree (data structure)' }] } }),
        );
      }
      if (input.includes('/page/summary/') && input.includes('structure')) {
        return Promise.resolve(
          jsonResponse({
            type: 'standard',
            title: 'Tree (data structure)',
            extract: 'A tree is a widely used data structure.',
          }),
        );
      }
      return Promise.resolve(jsonResponse({ type: 'disambiguation', title: 'Tree' }));
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await provider.explain(request('Tree'), DEFAULT_SETTINGS);
    expect(result.concept).toBe('Tree (data structure)');
    expect(fetchMock.mock.calls.some((call) => String(call[0]).includes('action=query'))).toBe(
      true,
    );
  });

  it('enriches with curated example and analogy when the term is known', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve(
          jsonResponse({
            type: 'standard',
            title: 'Recursion',
            extract: 'Recursion occurs when a thing is defined in terms of itself.',
          }),
        ),
      ),
    );

    const result = await provider.explain(request('recursion'), DEFAULT_SETTINGS);
    expect(result.example).not.toBe('');
    expect(result.analogy).not.toBe('');
    expect(result.difficulty).toBe('intermediate');
  });

  it('throws a friendly error when nothing is found', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn((input: string) => {
        if (input.includes('/page/summary/')) return Promise.resolve(jsonResponse({}, 404));
        return Promise.resolve(jsonResponse({ query: { search: [] } }));
      }),
    );

    await expect(provider.explain(request('zzxqwerty'), DEFAULT_SETTINGS)).rejects.toBeInstanceOf(
      ExplanationError,
    );
  });
});
