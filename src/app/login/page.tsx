export default function LoginPage() {
  return (
    <main>
      <h1>Login Page</h1>
      <p>You were redirected here because you don't have valid authentication.</p>

      <h2>Use Cases</h2>
      <ul>
        <li>Target for auth redirect rules</li>
        <li>Test <code>has</code>/<code>missing</code> cookie conditions that redirect to login</li>
      </ul>

      <h3>Example Rule</h3>
      <pre style={{ background: '#f5f5f5', padding: '1rem' }}>{`{
  "src": "/protected",
  "dest": "/login",
  "missing": [{ "type": "cookie", "key": "auth" }]
}`}</pre>

      <form style={{ marginTop: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label>
            Username:
            <input type="text" style={{ marginLeft: '0.5rem' }} />
          </label>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>
            Password:
            <input type="password" style={{ marginLeft: '0.5rem' }} />
          </label>
        </div>
        <button type="submit">Login</button>
      </form>
    </main>
  );
}
