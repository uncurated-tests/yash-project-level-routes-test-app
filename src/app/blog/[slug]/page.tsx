import { headers } from 'next/headers';

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
      <h1>Blog Post: {slug}</h1>
      <p>This is the blog post page for slug: <code>{slug}</code></p>

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
