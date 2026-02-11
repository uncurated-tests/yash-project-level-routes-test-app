import { headers } from 'next/headers';
import { PathIndicator } from '@/components/PathIndicator';
import { HeadersDisplay } from '@/components/HeadersDisplay';

const KNOWN_BOT_PATTERNS = [
  'Googlebot', 'Bingbot', 'Slurp', 'DuckDuckBot', 'Baiduspider',
  'YandexBot', 'facebookexternalhit', 'Twitterbot', 'LinkedInBot',
  'WhatsApp', 'Discordbot', 'Applebot', 'AhrefsBot', 'SemrushBot',
  'MJ12bot', 'DotBot', 'PetalBot', 'bytespider',
];

function detectBot(userAgent: string | null): { isBot: boolean; matchedPattern: string | null } {
  if (!userAgent) return { isBot: false, matchedPattern: null };
  const ua = userAgent.toLowerCase();
  for (const pattern of KNOWN_BOT_PATTERNS) {
    if (ua.includes(pattern.toLowerCase())) {
      return { isBot: true, matchedPattern: pattern };
    }
  }
  return { isBot: false, matchedPattern: null };
}

export default async function BotTestPage() {
  const headersList = await headers();

  const allHeaders: Record<string, string> = {};
  headersList.forEach((value, key) => {
    allHeaders[key] = value;
  });

  const userAgent = headersList.get('user-agent');
  const skipTelemetry = headersList.get('x-skip-telemetry');
  const { isBot, matchedPattern } = detectBot(userAgent);

  return (
    <main>
      <PathIndicator />

      <h1>Bot Detection / Skip O11y Test</h1>
      <p>
        Test marking bot requests to skip observability logging. Route rules can match
        on <code>User-Agent</code> patterns and set custom headers that downstream services
        use to skip telemetry.
      </p>

      <div className="card" style={{
        background: isBot ? '#fff3e0' : 'var(--success-light)',
        borderColor: isBot ? '#ff9800' : 'var(--success)'
      }}>
        <h4 style={{
          color: isBot ? '#e65100' : 'var(--success)',
          margin: '0 0 0.5rem 0'
        }}>
          {isBot ? `Bot Detected: ${matchedPattern}` : 'Not a Bot'}
        </h4>
        <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
          <li>User-Agent: <code style={{ wordBreak: 'break-all' }}>{userAgent || '(not set)'}</code></li>
          <li>x-skip-telemetry: <code>{skipTelemetry || '(not set)'}</code></li>
        </ul>
      </div>

      {skipTelemetry && (
        <div className="card" style={{
          background: 'var(--accent-light)',
          borderColor: 'var(--accent)'
        }}>
          <h4 style={{ color: 'var(--accent)', margin: '0 0 0.5rem 0' }}>
            Skip Telemetry Header Active
          </h4>
          <p style={{ margin: 0 }}>
            The <code>x-skip-telemetry</code> header is set to <code>{skipTelemetry}</code>.
            This confirms the route rule is injecting the header for this request.
          </p>
        </div>
      )}

      <h2>How to Test</h2>
      <pre><code>{`# Simulate a bot request
curl -H "User-Agent: Googlebot/2.1" \\
  https://your-app.vercel.app/bot-test

# Simulate a normal browser request
curl -H "User-Agent: Mozilla/5.0" \\
  https://your-app.vercel.app/bot-test

# Check if the skip header is in the response
curl -I -H "User-Agent: Googlebot/2.1" \\
  https://your-app.vercel.app/bot-test`}</code></pre>

      <h2>Example Rules</h2>

      <h3>Mark Bots to Skip Telemetry</h3>
      <pre><code>{`{
  "src": "^/(.*)$",
  "headers": {
    "x-skip-telemetry": "1",
    "x-bot-detected": "true"
  },
  "has": [{
    "type": "header",
    "key": "user-agent",
    "value": { "re": "(?i).*(bot|crawl|spider|slurp|feed|fetch).*" }
  }],
  "continue": true
}`}</code></pre>

      <h3>Block Specific Bots</h3>
      <pre><code>{`{
  "src": "^/(.*)$",
  "status": 403,
  "has": [{
    "type": "header",
    "key": "user-agent",
    "value": { "re": "(?i).*(AhrefsBot|SemrushBot|MJ12bot|DotBot).*" }
  }]
}`}</code></pre>

      <h3>Rate-limit Crawlers with Headers</h3>
      <pre><code>{`{
  "src": "^/(.*)$",
  "headers": {
    "x-skip-telemetry": "1",
    "X-Robots-Tag": "noindex, nofollow",
    "Cache-Control": "no-store"
  },
  "has": [{
    "type": "header",
    "key": "user-agent",
    "value": { "re": "(?i).*(PetalBot|bytespider|GPTBot).*" }
  }],
  "continue": true
}`}</code></pre>

      <h2>Known Bot Patterns</h2>
      <div className="card">
        <p>The following user-agent patterns are commonly matched:</p>
        <pre><code>{KNOWN_BOT_PATTERNS.join('\n')}</code></pre>
      </div>

      <HeadersDisplay
        headers={allHeaders}
        highlight={['user-agent', 'x-skip-telemetry', 'x-bot-detected', 'x-robots-tag']}
      />
    </main>
  );
}
