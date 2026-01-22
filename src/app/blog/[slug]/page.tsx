import { headers } from 'next/headers';

export default function BlogPost({ params }: { params: { slug: string } }) {
  const headersList = headers();
  const allHeaders: Record<string, string> = {};
  headersList.forEach((value, key) => {
    allHeaders[key] = value;
  });

  return (
    <main>
      <h1>Blog Post: {params.slug}</h1>
      <p>This is the blog post page for slug: <code>{params.slug}</code></p>

      <h2>Use Cases</h2>
      <ul>
        <li>Test rewrites from <code>/posts/:slug</code> to <code>/blog/:slug</code></li>
        <li>Test redirects from <code>/old-blog/:slug</code> to <code>/blog/:slug</code></li>
        <li>Test path parameter substitution</li>
      </ul>

      <h2>Request Headers</h2>
      <pre style={{ background: '#f5f5f5', padding: '1rem', overflow: 'auto' }}>
        {JSON.stringify(allHeaders, null, 2)}
      </pre>
    </main>
  );
}
