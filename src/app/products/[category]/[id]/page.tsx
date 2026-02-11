import { headers } from 'next/headers';
import { PathIndicator } from '@/components/PathIndicator';
import { HeadersDisplay } from '@/components/HeadersDisplay';

interface ProductPageProps {
  params: Promise<{ category: string; id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { category, id } = await params;
  const headersList = await headers();

  const allHeaders: Record<string, string> = {};
  headersList.forEach((value, key) => {
    allHeaders[key] = value;
  });

  return (
    <main>
      <PathIndicator />

      <h1>Product: {category} / {id}</h1>
      <p>
        Multi-segment redirect/rewrite target for product URLs. Tests pattern matching
        with multiple capture groups.
      </p>

      <div className="card">
        <h4>Route Parameters</h4>
        <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
          <li>Category: <code>{category}</code></li>
          <li>Product ID: <code>{id}</code></li>
          <li>Full path: <code>/products/{category}/{id}</code></li>
        </ul>
      </div>

      <h2>Complex Redirect Examples</h2>

      <h3>Rename Category Prefix</h3>
      <pre><code>{`// /products/old-electronics/* -> /products/electronics/*
{
  "src": "^/products/old-([^/]+)/(.+)$",
  "dest": "/products/$1/$2",
  "status": 308
}`}</code></pre>

      <h3>SKU to Category/ID Mapping</h3>
      <pre><code>{`// /sku/ELEC-12345 -> /products/electronics/12345
{
  "src": "^/sku/ELEC-([0-9]+)$",
  "dest": "/products/electronics/$1",
  "status": 301
}`}</code></pre>

      <h3>Legacy URL Pattern</h3>
      <pre><code>{`// /shop?cat=electronics&id=12345 -> /products/electronics/12345
{
  "src": "^/shop$",
  "dest": "/products/$cat/$id",
  "has": [
    { "type": "query", "key": "cat", "value": "(?P<cat>[^&]+)" },
    { "type": "query", "key": "id", "value": "(?P<id>[^&]+)" }
  ],
  "status": 308
}`}</code></pre>

      <h2>Test Links</h2>
      <ul>
        <li><a href="/products/electronics/12345">/products/electronics/12345</a></li>
        <li><a href="/products/clothing/abc-shirt">/products/clothing/abc-shirt</a></li>
        <li><a href="/products/books/978-1234">/products/books/978-1234</a></li>
      </ul>

      <HeadersDisplay headers={allHeaders} />
    </main>
  );
}
