import { PathIndicator } from '@/components/PathIndicator';

const posts = [
  { slug: 'hello-world', title: 'Hello World', description: 'Getting started with the blog' },
  { slug: 'routing-rules', title: 'Understanding Routing Rules', description: 'Deep dive into rewrites and redirects' },
  { slug: 'advanced-patterns', title: 'Advanced Patterns', description: 'Complex regex and path-to-regexp patterns' },
  { slug: 'testing-guide', title: 'Testing Guide', description: 'How to test your routing configuration' },
];

export default function BlogIndex() {
  return (
    <main>
      <PathIndicator />
      
      <h1>Blog</h1>
      <p>Sample blog posts for testing routing rules.</p>

      <h2>Test Scenarios</h2>
      <div className="card">
        <h4>Rewrite Test</h4>
        <p>Create a rule to rewrite <code>/posts/:slug</code> to <code>/blog/:slug</code>, then visit <a href="/posts/hello-world">/posts/hello-world</a></p>
      </div>
      <div className="card">
        <h4>Redirect Test</h4>
        <p>Create a rule to redirect <code>/old-blog/:slug</code> to <code>/blog/:slug</code>, then visit <a href="/old-blog/hello-world">/old-blog/hello-world</a></p>
      </div>

      <h2>Posts</h2>
      <div className="card">
        <ul className="link-list">
          {posts.map((post) => (
            <li key={post.slug}>
              <a href={`/blog/${post.slug}`}>
                <div>
                  <strong>{post.title}</strong>
                  <p style={{ margin: 0, fontSize: '0.8125rem' }}>{post.description}</p>
                </div>
                <span className="arrow">&rarr;</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <h2>Direct Links</h2>
      <p>These links go directly to blog posts:</p>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <a href={`/blog/${post.slug}`}>/blog/{post.slug}</a>
          </li>
        ))}
      </ul>

      <h2>Rewrite Target Links</h2>
      <p>These should 404 unless you set up a rewrite rule:</p>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <a href={`/posts/${post.slug}`}>/posts/{post.slug}</a> &rarr; should rewrite to /blog/{post.slug}
          </li>
        ))}
      </ul>
    </main>
  );
}
