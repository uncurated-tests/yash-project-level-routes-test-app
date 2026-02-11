import { headers } from 'next/headers';
import { PathIndicator } from '@/components/PathIndicator';
import { HeadersDisplay } from '@/components/HeadersDisplay';

export default async function VariantAPage() {
  const headersList = await headers();
  const allHeaders: Record<string, string> = {};
  headersList.forEach((value, key) => {
    allHeaders[key] = value;
  });

  return (
    <main>
      <PathIndicator />

      <h1>Experiment: Variant A</h1>
      <p>
        You are seeing <strong>Variant A</strong> of the A/B test experiment.
      </p>

      <div className="card" style={{
        background: 'var(--accent-light)',
        borderColor: 'var(--accent)'
      }}>
        <h4 style={{ color: 'var(--accent)', margin: '0 0 0.5rem 0' }}>
          Variant A
        </h4>
        <p style={{ margin: 0 }}>
          If you arrived here via <code>/experiment</code>, the A/B rewrite rule is working correctly.
          Check the browser URL bar &mdash; it should still show <code>/experiment</code> (rewrite
          preserves the original URL).
        </p>
      </div>

      <h2>Verification</h2>
      <ul>
        <li>Browser URL should show: <code>/experiment</code></li>
        <li>Actual rendered path (below): <code>/experiment/variant-a</code></li>
        <li>This confirms the rewrite is transparent to the user</li>
      </ul>

      <HeadersDisplay
        headers={allHeaders}
        highlight={['x-ab-group', 'cookie']}
      />
    </main>
  );
}
