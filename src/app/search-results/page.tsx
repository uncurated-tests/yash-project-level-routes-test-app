import { PathIndicator } from '@/components/PathIndicator';

export default async function SearchResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const query = params.q;

  return (
    <main>
      <PathIndicator />
      
      <h1>Search Results</h1>
      
      {query ? (
        <div className="card" style={{ background: 'var(--success-light)', borderColor: 'var(--success)' }}>
          <h4 style={{ color: 'var(--success)', margin: '0 0 0.5rem 0' }}>
            Results for: &quot;{query}&quot;
          </h4>
          <p style={{ margin: 0 }}>
            If you came from <code>/search?q={query}</code> via a rewrite, the rule is working!
          </p>
        </div>
      ) : (
        <div className="card" style={{ background: 'var(--warning-light)', borderColor: 'var(--warning)' }}>
          <h4 style={{ color: 'var(--warning)', margin: '0 0 0.5rem 0' }}>
            No Search Query
          </h4>
          <p style={{ margin: 0 }}>
            Try <a href="/search?q=test">/search?q=test</a> with a rewrite rule to see results.
          </p>
        </div>
      )}

      <h2>Mock Results</h2>
      {query ? (
        <div className="card">
          <ul className="link-list">
            <li><a href="#"><span>Result 1 for &quot;{query}&quot;</span><span className="arrow">&rarr;</span></a></li>
            <li><a href="#"><span>Result 2 for &quot;{query}&quot;</span><span className="arrow">&rarr;</span></a></li>
            <li><a href="#"><span>Result 3 for &quot;{query}&quot;</span><span className="arrow">&rarr;</span></a></li>
          </ul>
        </div>
      ) : (
        <p>Enter a search query to see results.</p>
      )}

      <h2>Query Parameters</h2>
      <pre><code>{JSON.stringify(params, null, 2)}</code></pre>

      <h2>Example Rule</h2>
      <pre><code>{`{
  "src": "/search",
  "dest": "/search-results",
  "has": [{ "type": "query", "key": "q" }]
}`}</code></pre>
    </main>
  );
}
