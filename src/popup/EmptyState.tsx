interface EmptyStateProps {
  title: string;
  message: string;
}

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div className="list">
      <div className="empty">
        <div className="empty-art" aria-hidden="true">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 19V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v13"
              stroke="var(--muted)"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M4 19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v0a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2Z"
              stroke="var(--muted)"
              strokeWidth="1.6"
            />
            <path
              d="M9 8.5h6M9 12h4"
              stroke="var(--accent)"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h2>{title}</h2>
        <p>{message}</p>
      </div>
    </div>
  );
}
