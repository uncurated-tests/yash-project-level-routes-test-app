export default function OldPage() {
  return (
    <main>
      <h1>Old Page</h1>
      <p>This page exists to test redirect rules.</p>
      <p>If you see this, no redirect rule is active for this path.</p>

      <h2>Use Cases</h2>
      <ul>
        <li>Source for permanent redirect (308) to new location</li>
        <li>Source for temporary redirect (307) tests</li>
      </ul>

      <h3>Example Redirect Rule</h3>
      <pre style={{ background: '#f5f5f5', padding: '1rem' }}>{`{
  "src": "/old-page",
  "dest": "/",
  "status": 308
}`}</pre>
    </main>
  );
}
