import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Project Routes Test App',
  description: 'Test app for project-level routing rules',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
        <nav style={{ marginBottom: '2rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem' }}>
          <a href="/" style={{ marginRight: '1rem' }}>Home</a>
          <a href="/blog" style={{ marginRight: '1rem' }}>Blog</a>
          <a href="/api-target" style={{ marginRight: '1rem' }}>API Target</a>
          <a href="/headers-test" style={{ marginRight: '1rem' }}>Headers</a>
          <a href="/protected" style={{ marginRight: '1rem' }}>Protected</a>
        </nav>
        {children}
      </body>
    </html>
  );
}
