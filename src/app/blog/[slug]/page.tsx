import { headers } from 'next/headers';
import { PathIndicator } from '@/components/PathIndicator';
import { HeadersDisplay } from '@/components/HeadersDisplay';

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const headersList = await headers();
  const allHeaders: Record<string, string> = {};
  headersList.forEach((value, key) => {
    allHeaders[key] = value;
  });

  return (
    <main>
      <PathIndicator />
      
      <h1>Blog: {slug}</h1>
      <p>This is the blog post page. The slug parameter is: <code>{slug}</code></p>

      <div className="card" style={{ background: 'var(--success-light)', borderColor: 'var(--success)' }}>
        <h4 style={{ color: 'var(--success)', margin: '0 0 0.5rem 0' }}>If you came from a rewrite...</h4>
        <p style={{ margin: 0 }}>
          Check the URL in your browser - it should still show the original path (e.g., <code>/posts/{slug}</code>) 
          even though this page is at <code>/blog/{slug}</code>.
        </p>
      </div>

      <h2>Test This Page</h2>
      <div className="card-grid">
        <div className="card">
          <h4>Direct Link</h4>
          <p><a href={`/blog/${slug}`}>/blog/{slug}</a></p>
        </div>
        <div className="card">
          <h4>Via Rewrite</h4>
          <p><a href={`/posts/${slug}`}>/posts/{slug}</a> (needs rule)</p>
        </div>
        <div className="card">
          <h4>Via Redirect</h4>
          <p><a href={`/old-blog/${slug}`}>/old-blog/{slug}</a> (needs rule)</p>
        </div>
      </div>

      <h2>Example Rules for This Page</h2>
      
      <h3>Rewrite /posts/:slug to /blog/:slug</h3>
      <pre><code>{`{
  "src": "/posts/:slug",
  "dest": "/blog/:slug"
}`}</code></pre>

      <h3>Redirect /old-blog/:slug to /blog/:slug</h3>
      <pre><code>{`{
  "src": "/old-blog/:slug",
  "dest": "/blog/:slug",
  "status": 308
}`}</code></pre>

      <h2>Other Blog Posts</h2>
      <ul>
        <li><a href="/blog/hello-world">/blog/hello-world</a></li>
        <li><a href="/blog/routing-rules">/blog/routing-rules</a></li>
        <li><a href="/blog/advanced-patterns">/blog/advanced-patterns</a></li>
      </ul>

      <HeadersDisplay 
        headers={allHeaders} 
        highlight={['x-', 'x-matched-path']}
      />
    </main>
  );
}
