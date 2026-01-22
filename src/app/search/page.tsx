import { PathIndicator } from '@/components/PathIndicator';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const hasQuery = 'q' in params;

  return (
    <main>
      <PathIndicator />
      
      <h1>Search</h1>
      <p>Test query parameter-based routing rules.</p>

      <div className="card" style={{ 
        background: hasQuery ? 'var(--success-light)' : 'var(--warning-light)', 
        borderColor: hasQuery ? 'var(--success)' : 'var(--warning)' 
      }}>
        <h4 style={{ color: hasQuery ? 'var(--success)' : 'var(--warning)', margin: '0 0 0.5rem 0' }}>
          {hasQuery ? 'Query Parameter Present' : 'No Query Parameter'}
        </h4>
        <p style={{ margin: 0 }}>
          {hasQuery 
            ? `Searching for: "${params.q}"`
            : 'Add ?q=something to test query-based routing'
          }
        </p>
      </div>

      <h2>Try It</h2>
      <form method="get" style={{ marginBottom: '1.5rem' }}>
        <input 
          type="text" 
          name="q" 
          placeholder="Enter search query..." 
          defaultValue={typeof params.q === 'string' ? params.q : ''}
          style={{ marginRight: '0.5rem', width: '200px' }}
        />
        <button type="submit">Search</button>
      </form>

      <div className="card-grid">
        <div className="card">
          <h4>With Query</h4>
          <p><a href="/search?q=test">/search?q=test</a></p>
        </div>
        <div className="card">
          <h4>Without Query</h4>
          <p><a href="/search">/search</a></p>
        </div>
        <div className="card">
          <h4>Multiple Params</h4>
          <p><a href="/search?q=test&page=2">/search?q=test&page=2</a></p>
        </div>
      </div>

      <h2>Example Rules</h2>

      <h3>Rewrite to /search-results if query present</h3>
      <pre><code>{`{
  "src": "/search",
  "dest": "/search-results",
  "has": [{ "type": "query", "key": "q" }]
}`}</code></pre>

      <h3>Match specific query value</h3>
      <pre><code>{`{
  "src": "/search",
  "dest": "/empty-search",
  "has": [{ "type": "query", "key": "q", "value": "" }]
}`}</code></pre>

      <h2>Current Query Parameters</h2>
      <pre><code>{JSON.stringify(params, null, 2)}</code></pre>
    </main>
  );
}
