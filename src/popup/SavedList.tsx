import type { SavedConcept } from '../types';
import { formatDate } from '../utils/text';
import { EmptyState } from './EmptyState';

interface SavedListProps {
  items: SavedConcept[];
  searching: boolean;
  onDelete(id: string): void;
}

function copyText(item: SavedConcept): void {
  const text = [
    item.concept,
    '',
    item.shortExplanation,
    item.example ? `\nExample:\n${item.example}` : '',
  ]
    .join('\n')
    .trim();
  void navigator.clipboard.writeText(text);
}

export function SavedList({ items, searching, onDelete }: SavedListProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        title={searching ? 'No matches' : 'Your library is empty'}
        message={
          searching
            ? 'No saved concepts match that search.'
            : 'When an explanation is worth keeping, click Save on the card and it will live here for review.'
        }
      />
    );
  }

  return (
    <ul className="list" aria-label="Saved concepts">
      {items.map((item) => (
        <li key={item.id} className="item card-panel">
          <div className="item-head">
            <span className="item-title">{item.concept}</span>
            <span className="item-date">{formatDate(item.savedAt)}</span>
          </div>
          <p className="item-body">{item.shortExplanation}</p>
          <div className="item-meta">
            <span className="badge-difficulty">{item.difficulty}</span>
            {item.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="chip">
                {tag}
              </span>
            ))}
            <div className="item-actions">
              {item.sourceUrl.startsWith('http') && (
                <a
                  className="item-source"
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  title={`Open source: ${item.sourceTitle}`}
                >
                  {item.sourceTitle || 'source'}
                </a>
              )}
              <button
                className="btn ghost"
                onClick={() => copyText(item)}
                aria-label={`Copy explanation of ${item.concept}`}
              >
                Copy
              </button>
              <button
                className="btn ghost danger"
                onClick={() => onDelete(item.id)}
                aria-label={`Delete ${item.concept} from library`}
              >
                Delete
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
