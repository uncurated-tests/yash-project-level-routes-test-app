import { headers } from 'next/headers';

export default async function GeoPage() {
  const headersList = await headers();

  // Common geo headers from Vercel
  const geoHeaders = {
    'x-vercel-ip-country': headersList.get('x-vercel-ip-country'),
    'x-vercel-ip-country-region': headersList.get('x-vercel-ip-country-region'),
    'x-vercel-ip-city': headersList.get('x-vercel-ip-city'),
    'x-vercel-ip-latitude': headersList.get('x-vercel-ip-latitude'),
    'x-vercel-ip-longitude': headersList.get('x-vercel-ip-longitude'),
    'x-vercel-ip-timezone': headersList.get('x-vercel-ip-timezone'),
  };

  const allHeaders: Record<string, string> = {};
  headersList.forEach((value, key) => {
    allHeaders[key] = value;
  });

  return (
    <main>
      <h1>Geo Routing Test Page</h1>
      <p>This page helps test geo-based routing rules.</p>

      <h2>Use Cases</h2>
      <ul>
        <li>Test <code>has</code> with header matching for country codes</li>
        <li>Test routing based on <code>x-vercel-ip-country</code></li>
        <li>Test geo-based redirects or content variations</li>
      </ul>

      <h3>Example Rule (Redirect EU users)</h3>
      <pre style={{ background: '#f5f5f5', padding: '1rem' }}>{`{
  "src": "/(.*)",
  "dest": "/eu/$1",
  "has": [{
    "type": "header",
    "key": "x-vercel-ip-country",
    "value": { "inc": ["DE", "FR", "IT", "ES", "NL"] }
  }]
}`}</pre>

      <h2>Detected Geo Headers</h2>
      <pre style={{ background: '#e3f2fd', padding: '1rem', overflow: 'auto' }}>
        {JSON.stringify(geoHeaders, null, 2)}
      </pre>

      <h2>All Headers</h2>
      <pre style={{ background: '#f5f5f5', padding: '1rem', overflow: 'auto' }}>
        {JSON.stringify(allHeaders, null, 2)}
      </pre>
    </main>
  );
}
