import { headers } from 'next/headers';
import { PathIndicator } from '@/components/PathIndicator';
import { HeadersDisplay } from '@/components/HeadersDisplay';

export default async function MicrositePage() {
  const headersList = await headers();
  const host = headersList.get('host');
  const forwardedHost = headersList.get('x-forwarded-host');

  const allHeaders: Record<string, string> = {};
  headersList.forEach((value, key) => {
    allHeaders[key] = value;
  });

  return (
    <main>
      <PathIndicator />

      <h1>Microsite Target</h1>
      <p>
        This page is the target for microsite routing rules. In production, a separate domain
        (like <code>promo.example.com</code>) would have its requests rewritten to this app.
      </p>

      <div className="card" style={{
        background: 'var(--accent-light)',
        borderColor: 'var(--accent)'
      }}>
        <h4 style={{ color: 'var(--accent)', margin: '0 0 0.5rem 0' }}>
          Host Information
        </h4>
        <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
          <li>Host: <code>{host}</code></li>
          <li>X-Forwarded-Host: <code>{forwardedHost || '(not set)'}</code></li>
        </ul>
      </div>

      <h2>Microsite Use Cases</h2>

      <h3>Domain to Project Rewrite</h3>
      <pre><code>{`// Route promo domain to this project's /microsite path
{
  "src": "^/(.*)$",
  "dest": "https://your-app.vercel.app/microsite/$1",
  "has": [{ "type": "host", "value": "promo.example.com" }]
}`}</code></pre>

      <h3>Domain + Geo Match</h3>
      <pre><code>{`// Route promo domain to locale-specific microsite content
{
  "src": "^/(.*)$",
  "dest": "https://your-app.vercel.app/locale/de/microsite/$1",
  "has": [
    { "type": "host", "value": "promo.example.com" },
    { "type": "header", "key": "x-vercel-ip-country", "value": "DE" }
  ]
}`}</code></pre>

      <h3>Wildcard Subdomain Microsites</h3>
      <pre><code>{`// Route any *.promo.example.com to the microsite
{
  "src": "^/(.*)$",
  "dest": "https://your-app.vercel.app/microsite/$1",
  "has": [{ "type": "host", "value": { "suf": ".promo.example.com" } }]
}`}</code></pre>

      <h2>How to Test Locally</h2>
      <p>Add entries to your <code>/etc/hosts</code> file:</p>
      <pre><code>{`127.0.0.1  promo.localhost
127.0.0.1  campaign.localhost`}</code></pre>
      <p>Then visit <code>http://promo.localhost:3000/microsite</code></p>

      <HeadersDisplay
        headers={allHeaders}
        highlight={['host', 'x-forwarded-host', 'x-vercel-ip']}
      />
    </main>
  );
}
