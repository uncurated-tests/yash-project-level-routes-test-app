import { headers } from 'next/headers';
import { PathIndicator } from '@/components/PathIndicator';
import { HeadersDisplay } from '@/components/HeadersDisplay';

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

  const hasGeoHeaders = Object.values(geoHeaders).some(v => v !== null);

  const allHeaders: Record<string, string> = {};
  headersList.forEach((value, key) => {
    allHeaders[key] = value;
  });

  return (
    <main>
      <PathIndicator />
      
      <h1>Geo Routing Test</h1>
      <p>Test geographic/location-based routing rules using Vercel&apos;s geo headers.</p>

      <div className="card" style={{ 
        background: hasGeoHeaders ? 'var(--success-light)' : 'var(--warning-light)', 
        borderColor: hasGeoHeaders ? 'var(--success)' : 'var(--warning)' 
      }}>
        <h4 style={{ color: hasGeoHeaders ? 'var(--success)' : 'var(--warning)', margin: '0 0 0.5rem 0' }}>
          {hasGeoHeaders ? 'Geo Headers Detected' : 'No Geo Headers'}
        </h4>
        {hasGeoHeaders ? (
          <pre style={{ background: 'transparent', margin: 0 }}>
            <code>{JSON.stringify(geoHeaders, null, 2)}</code>
          </pre>
        ) : (
          <p style={{ margin: 0 }}>
            Geo headers are added by Vercel in production. Deploy to see them.
          </p>
        )}
      </div>

      <h2>Example Rules</h2>

      <h3>Redirect EU Users</h3>
      <pre><code>{`{
  "src": "/(.*)",
  "dest": "/eu/$1",
  "has": [{
    "type": "header",
    "key": "x-vercel-ip-country",
    "value": { "inc": ["DE", "FR", "IT", "ES", "NL", "BE", "AT"] }
  }]
}`}</code></pre>

      <h3>Block Specific Country</h3>
      <pre><code>{`{
  "src": "/(.*)",
  "status": 403,
  "has": [{
    "type": "header",
    "key": "x-vercel-ip-country",
    "value": "XX"
  }]
}`}</code></pre>

      <h3>Regional Content</h3>
      <pre><code>{`{
  "src": "/pricing",
  "dest": "/pricing-us",
  "has": [{
    "type": "header",
    "key": "x-vercel-ip-country",
    "value": "US"
  }]
}`}</code></pre>

      <h2>Available Geo Headers</h2>
      <ul>
        <li><code>x-vercel-ip-country</code> - ISO 3166-1 alpha-2 country code</li>
        <li><code>x-vercel-ip-country-region</code> - ISO 3166-2 region code</li>
        <li><code>x-vercel-ip-city</code> - City name</li>
        <li><code>x-vercel-ip-latitude</code> - Latitude</li>
        <li><code>x-vercel-ip-longitude</code> - Longitude</li>
        <li><code>x-vercel-ip-timezone</code> - Timezone (e.g., America/New_York)</li>
      </ul>

      <HeadersDisplay 
        headers={allHeaders} 
        highlight={['x-vercel-ip']}
      />
    </main>
  );
}
