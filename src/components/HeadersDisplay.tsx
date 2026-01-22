interface HeadersDisplayProps {
  headers: Record<string, string>;
  title?: string;
  defaultOpen?: boolean;
  highlight?: string[];
}

export function HeadersDisplay({ 
  headers, 
  title = 'Request Headers',
  defaultOpen = false,
  highlight = []
}: HeadersDisplayProps) {
  const highlightedHeaders = Object.entries(headers).filter(([key]) =>
    highlight.some(h => key.toLowerCase().includes(h.toLowerCase()))
  );
  
  const hasHighlighted = highlightedHeaders.length > 0;

  return (
    <div className="headers-display">
      <details open={defaultOpen}>
        <summary>
          {title} ({Object.keys(headers).length})
          {hasHighlighted && (
            <span className="badge badge-success" style={{ marginLeft: '0.5rem' }}>
              {highlightedHeaders.length} custom
            </span>
          )}
        </summary>
        {hasHighlighted && (
          <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)', background: 'var(--success-light)' }}>
            <strong style={{ fontSize: '0.75rem', color: 'var(--success)' }}>HIGHLIGHTED HEADERS</strong>
            <pre style={{ background: 'transparent', margin: '0.5rem 0 0 0', padding: 0, fontSize: '0.8125rem' }}>
              {JSON.stringify(Object.fromEntries(highlightedHeaders), null, 2)}
            </pre>
          </div>
        )}
        <pre>
          <code>{JSON.stringify(headers, null, 2)}</code>
        </pre>
      </details>
    </div>
  );
}
