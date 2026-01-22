export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  return (
    <main>
      <h1>Search Page</h1>
      <p>This page is for testing query string conditions.</p>

      <h2>Use Cases</h2>
      <ul>
        <li>Test <code>has</code> condition with query params</li>
        <li>Test rewrites that depend on query string presence</li>
      </ul>

      <h3>Example Rule (Rewrite if query has 'q')</h3>
      <pre style={{ background: '#f5f5f5', padding: '1rem' }}>{`{
  "src": "/search",
  "dest": "/search-results",
  "has": [{ "type": "query", "key": "q" }]
}`}</pre>

      <h2>Current Query Parameters</h2>
      <pre style={{ background: '#f5f5f5', padding: '1rem', overflow: 'auto' }}>
        {JSON.stringify(params, null, 2)}
      </pre>

      <form method="get" style={{ marginTop: '1rem' }}>
        <input type="text" name="q" placeholder="Search query..." />
        <button type="submit" style={{ marginLeft: '0.5rem' }}>Search</button>
      </form>
    </main>
  );
}
