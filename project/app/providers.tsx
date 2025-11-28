'use client';

import { SessionProvider } from 'next-auth/react';

export function Providers({ children }: { children: React.ReactNode }) {
  // Get the base URL from environment or use relative path
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  
  return (
    <SessionProvider 
      basePath="/api/auth"
      refetchOnWindowFocus={false}
    >
      {children}
    </SessionProvider>
  );
}
