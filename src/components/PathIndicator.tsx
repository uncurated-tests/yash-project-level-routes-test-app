'use client';

import { usePathname } from 'next/navigation';

export function PathIndicator({ serverPath }: { serverPath?: string }) {
  const clientPath = usePathname();
  
  return (
    <div className="path-indicator">
      <span className="label">Path:</span>
      <span className="path">{serverPath || clientPath}</span>
    </div>
  );
}
