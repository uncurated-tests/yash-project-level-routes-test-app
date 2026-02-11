import { headers } from 'next/headers';
import { PathIndicator } from '@/components/PathIndicator';
import { HeadersDisplay } from '@/components/HeadersDisplay';

interface DocsSlugPageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function DocsSlugPage({ params }: DocsSlugPageProps) {
  const { slug } = await params;
  const headersList = await headers();

  const allHeaders: Record<string, string> = {};
  headersList.forEach((value, key) => {
    allHeaders[key] = value;
  });

  const fullPath = `/docs/${slug.join('/')}`;

  return (
    <main>
      <PathIndicator />

      <h1>Docs: {slug.join(' / ')}</h1>
      <p>
        Catch-all docs page. In production, this path would be rewritten to an external
        documentation provider.
      </p>

      <div className="card">
        <h4>Path Details</h4>
        <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
          <li>Full path: <code>{fullPath}</code></li>
          <li>Segments: <code>{JSON.stringify(slug)}</code></li>
          <li>Depth: {slug.length} level{slug.length !== 1 ? 's' : ''}</li>
        </ul>
      </div>

      <p>
        If you see this page, the external docs rewrite is not active for this path.
        When the rewrite is active, this request would be proxied to the external docs provider.
      </p>

      <HeadersDisplay
        headers={allHeaders}
        highlight={['host', 'x-forwarded']}
      />
    </main>
  );
}
