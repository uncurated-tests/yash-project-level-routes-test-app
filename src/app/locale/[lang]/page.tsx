import { headers } from 'next/headers';
import { PathIndicator } from '@/components/PathIndicator';
import { HeadersDisplay } from '@/components/HeadersDisplay';

interface LocalePageProps {
  params: Promise<{ lang: string }>;
}

const LOCALE_NAMES: Record<string, string> = {
  en: 'English',
  de: 'German (Deutsch)',
  fr: 'French (Francais)',
  es: 'Spanish (Espanol)',
  it: 'Italian (Italiano)',
  nl: 'Dutch (Nederlands)',
  ja: 'Japanese',
  ko: 'Korean',
  zh: 'Chinese',
  pt: 'Portuguese',
};

export default async function LocalePage({ params }: LocalePageProps) {
  const { lang } = await params;
  const headersList = await headers();

  const allHeaders: Record<string, string> = {};
  headersList.forEach((value, key) => {
    allHeaders[key] = value;
  });

  const country = headersList.get('x-vercel-ip-country');
  const localeName = LOCALE_NAMES[lang] || lang;

  return (
    <main>
      <PathIndicator />

      <h1>Locale: {localeName}</h1>
      <p>
        This page represents locale-specific content. Users are routed here based on
        geo headers or Accept-Language matching via project-level route rules.
      </p>

      <div className="card" style={{
        background: 'var(--accent-light)',
        borderColor: 'var(--accent)'
      }}>
        <h4 style={{ color: 'var(--accent)', margin: '0 0 0.5rem 0' }}>
          Locale Details
        </h4>
        <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
          <li>Locale code: <code>{lang}</code></li>
          <li>Locale name: {localeName}</li>
          <li>Detected country: <code>{country || '(not available)'}</code></li>
          <li>Accept-Language: <code>{headersList.get('accept-language') || '(not set)'}</code></li>
        </ul>
      </div>

      <h2>Example Rules</h2>

      <h3>Geo-based Locale Redirect</h3>
      <pre><code>{`// German users -> /locale/de
{
  "src": "^/$",
  "dest": "/locale/de",
  "has": [{
    "type": "header",
    "key": "x-vercel-ip-country",
    "value": "DE"
  }]
}

// French users -> /locale/fr
{
  "src": "^/$",
  "dest": "/locale/fr",
  "has": [{
    "type": "header",
    "key": "x-vercel-ip-country",
    "value": "FR"
  }]
}`}</code></pre>

      <h3>Accept-Language Based</h3>
      <pre><code>{`{
  "src": "^/$",
  "dest": "/locale/de",
  "has": [{
    "type": "header",
    "key": "accept-language",
    "value": { "re": "^de.*" }
  }]
}`}</code></pre>

      <h2>All Locale Pages</h2>
      <ul>
        {Object.entries(LOCALE_NAMES).map(([code, name]) => (
          <li key={code}><a href={`/locale/${code}`}>/locale/{code}</a> - {name}</li>
        ))}
      </ul>

      <HeadersDisplay
        headers={allHeaders}
        highlight={['x-vercel-ip-country', 'accept-language']}
      />
    </main>
  );
}
