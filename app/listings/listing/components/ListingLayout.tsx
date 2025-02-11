'use client';

import { useEffect } from 'react';

export function ListingLayout({ children }: { children: React.ReactNode }) {


  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
} 