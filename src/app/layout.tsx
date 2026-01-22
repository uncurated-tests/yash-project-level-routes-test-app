import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Project Routes Test App',
  description: 'Test app for project-level routing rules',
};

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/headers-test', label: 'Headers' },
  { href: '/protected', label: 'Protected' },
  { href: '/search', label: 'Search' },
  { href: '/geo', label: 'Geo' },
  { href: '/api/data', label: 'API' },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav>
          <ul>
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        {children}
      </body>
    </html>
  );
}
