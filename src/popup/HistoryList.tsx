import type { HistoryEntry } from '../types';
import { formatDate } from '../utils/text';
import { EmptyState } from './EmptyState';

interface HistoryListProps {
  items: HistoryEntry[];
  searching: boolean;
}

export function HistoryList({ items, searching }: HistoryListProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        title={searching ? 'No matches' : 'Nothing explained yet'}
        message={
          searching
            ? 'No recent concepts match that search.'
            : 'Highlight a term like “recursion” or “hash table” on any page and click Explain — your recent lookups will appear here.'
        }
      />
    );
  }

  return (
    <ul className="list" aria-label="Recently explained concepts">
      {items.map((entry) => (
        <li key={entry.id} className="item card-panel">
          <div className="item-head">
            <span className="item-title">{entry.concept}</span>
            <span className="item-date">{formatDate(entry.explainedAt)}</span>
          </div>
          <p className="item-body">{entry.shortExplanation}</p>
          {entry.sourceUrl.startsWith('http') && (
            <div className="item-meta">
              <a
                className="item-source"
                href={entry.sourceUrl}
                target="_blank"
                rel="noreferrer"
                title={`Open source: ${entry.sourceTitle}`}
              >
                {entry.sourceTitle || 'source'}
              </a>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
