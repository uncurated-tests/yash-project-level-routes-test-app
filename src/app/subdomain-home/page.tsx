import { headers } from 'next/headers';

export default function SubdomainHome() {
  const headersList = headers();
  const host = headersList.get('host');

  return (
    <main>
      <h1>Subdomain Home</h1>
      <p>You reached this page via host-based routing!</p>
      <p>Current host: <code>{host}</code></p>

      <h2>Use Cases</h2>
      <ul>
        <li>Test <code>has</code> condition with host matching</li>
        <li>Test subdomain-based routing (e.g., app.example.com vs www.example.com)</li>
        <li>Test host prefix/suffix matching</li>
      </ul>

      <h3>Example Rule (Match app. subdomain)</h3>
      <pre style={{ background: '#f5f5f5', padding: '1rem' }}>{`{
  "src": "/(.*)",
  "dest": "/subdomain-home",
  "has": [{ "type": "host", "value": { "pre": "app." } }]
}`}</pre>

      <h3>Example Rule (Match specific host)</h3>
      <pre style={{ background: '#f5f5f5', padding: '1rem' }}>{`{
  "src": "/(.*)",
  "dest": "/subdomain-home",
  "has": [{ "type": "host", "value": "app.example.com" }]
}`}</pre>
    </main>
  );
}
