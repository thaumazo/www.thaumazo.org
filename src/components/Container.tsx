import React from 'react';
export default function Container({ children }: { children: React.ReactNode }) {
  return <div className="relative mx-auto flex max-w-6xl flex-col gap-4 p-4 px-4">{children}</div>;
}
