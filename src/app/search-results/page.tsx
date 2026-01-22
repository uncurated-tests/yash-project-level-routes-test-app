export default function SearchResultsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const query = searchParams.q;

  return (
    <main>
      <h1>Search Results</h1>
      {query ? (
        <p>Showing results for: <strong>{query}</strong></p>
      ) : (
        <p>No search query provided.</p>
      )}

      <h2>Use Cases</h2>
      <ul>
        <li>Target for query-based rewrite rules</li>
        <li>Verify query params are preserved through rewrites</li>
      </ul>

      <h2>Query Parameters</h2>
      <pre style={{ background: '#f5f5f5', padding: '1rem', overflow: 'auto' }}>
        {JSON.stringify(searchParams, null, 2)}
      </pre>

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#e8f5e9' }}>
        <p>Mock search results would appear here...</p>
        <ul>
          <li>Result 1 for "{query}"</li>
          <li>Result 2 for "{query}"</li>
          <li>Result 3 for "{query}"</li>
        </ul>
      </div>
    </main>
  );
}
