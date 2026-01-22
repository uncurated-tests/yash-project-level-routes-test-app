import { PathIndicator } from '@/components/PathIndicator';

export default function LoginPage() {
  return (
    <main>
      <PathIndicator />
      
      <h1>Login</h1>
      <p>This is the login page - a target for auth-based redirects.</p>

      <div className="card" style={{ background: 'var(--warning-light)', borderColor: 'var(--warning)' }}>
        <h4 style={{ color: 'var(--warning)', margin: '0 0 0.5rem 0' }}>
          Redirected Here?
        </h4>
        <p style={{ margin: 0 }}>
          If you were redirected from <code>/protected</code>, the auth rule is working!
        </p>
      </div>

      <h2>Set Auth Cookie</h2>
      <p>After &quot;logging in&quot;, set a cookie to access protected pages:</p>
      <pre><code>document.cookie = &quot;auth=valid; path=/&quot;</code></pre>

      <h2>Test Links</h2>
      <ul>
        <li><a href="/protected">Try /protected</a> (should redirect here without auth)</li>
        <li><a href="/">Back to Home</a></li>
      </ul>

      <h2>Mock Login Form</h2>
      <form action="#" method="post" style={{ maxWidth: '300px' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
            Username
          </label>
          <input type="text" name="username" placeholder="Enter username" style={{ width: '100%' }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
            Password
          </label>
          <input type="password" name="password" placeholder="Enter password" style={{ width: '100%' }} />
        </div>
        <button type="submit">Login</button>
      </form>
    </main>
  );
}
