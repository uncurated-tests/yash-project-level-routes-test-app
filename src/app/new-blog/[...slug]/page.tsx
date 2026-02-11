import { headers } from 'next/headers';
import { PathIndicator } from '@/components/PathIndicator';
import { HeadersDisplay } from '@/components/HeadersDisplay';

interface NewBlogPageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function NewBlogPage({ params }: NewBlogPageProps) {
  const { slug } = await params;
  const headersList = await headers();

  const allHeaders: Record<string, string> = {};
  headersList.forEach((value, key) => {
    allHeaders[key] = value;
  });

  const fullPath = `/new-blog/${slug.join('/')}`;

  return (
    <main>
      <PathIndicator />

      <h1>New Blog: {slug.join(' / ')}</h1>
      <p>
        This is the target for complex redirect patterns. Old blog URLs with multiple path
        segments (year, month, slug) get redirected here with simplified paths.
      </p>

      <div className="card">
        <h4>Path Details</h4>
        <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
          <li>Full path: <code>{fullPath}</code></li>
          <li>Segments: <code>{JSON.stringify(slug)}</code></li>
          <li>Depth: {slug.length} level{slug.length !== 1 ? 's' : ''}</li>
        </ul>
      </div>

      <h2>Complex Redirect Examples</h2>

      <h3>Drop Date Segments</h3>
      <pre><code>{`// /old-blog/2024/01/my-post -> /new-blog/my-post (redirect, drops year/month)
{
  "src": "^/old-blog/[0-9]{4}/[0-9]{2}/(.+)$",
  "dest": "/new-blog/$1",
  "status": 308
}`}</code></pre>

      <h3>Flatten Deep Paths</h3>
      <pre><code>{`// /archive/category/subcategory/post -> /new-blog/post
{
  "src": "^/archive/(?:.+/)*([^/]+)$",
  "dest": "/new-blog/$1",
  "status": 301
}`}</code></pre>

      <h3>Bulk Path Migration with Wildcard</h3>
      <pre><code>{`// /v1/blog/* -> /new-blog/*
{
  "src": "^/v1/blog/(.*)$",
  "dest": "/new-blog/$1",
  "status": 308
}`}</code></pre>

      <h2>Test Links</h2>
      <p>These will only redirect when the rules are active:</p>
      <ul>
        <li><a href="/old-blog/2024/01/hello-world">/old-blog/2024/01/hello-world</a> &rarr; /new-blog/hello-world</li>
        <li><a href="/old-blog/2023/12/another-post">/old-blog/2023/12/another-post</a> &rarr; /new-blog/another-post</li>
        <li><a href="/v1/blog/some-article">/v1/blog/some-article</a> &rarr; /new-blog/some-article</li>
      </ul>

      <HeadersDisplay headers={allHeaders} />
    </main>
  );
}
