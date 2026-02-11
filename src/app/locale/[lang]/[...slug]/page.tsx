import { headers } from 'next/headers';
import { PathIndicator } from '@/components/PathIndicator';
import { HeadersDisplay } from '@/components/HeadersDisplay';

interface LocaleSlugPageProps {
  params: Promise<{ lang: string; slug: string[] }>;
}

export default async function LocaleSlugPage({ params }: LocaleSlugPageProps) {
  const { lang, slug } = await params;
  const headersList = await headers();

  const allHeaders: Record<string, string> = {};
  headersList.forEach((value, key) => {
    allHeaders[key] = value;
  });

  const fullPath = `/locale/${lang}/${slug.join('/')}`;

  return (
    <main>
      <PathIndicator />

      <h1>Locale Content: {lang}/{slug.join('/')}</h1>
      <p>Locale-prefixed catch-all page for testing geo/locale-based routing with subpaths.</p>

      <div className="card">
        <h4>Path Details</h4>
        <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
          <li>Full path: <code>{fullPath}</code></li>
          <li>Locale: <code>{lang}</code></li>
          <li>Content path: <code>{slug.join('/')}</code></li>
          <li>Segments: <code>{JSON.stringify(slug)}</code></li>
        </ul>
      </div>

      <h2>Example Rule</h2>
      <pre><code>{`// Rewrite all paths for German users to locale-prefixed versions
{
  "src": "^/(?!locale/)(.*)$",
  "dest": "/locale/de/$1",
  "has": [{
    "type": "header",
    "key": "x-vercel-ip-country",
    "value": "DE"
  }]
}`}</code></pre>

      <HeadersDisplay
        headers={allHeaders}
        highlight={['x-vercel-ip-country', 'accept-language']}
      />
    </main>
  );
}
