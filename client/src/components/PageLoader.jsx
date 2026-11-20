import React from 'react';

export default function PageLoader() {
  return (
    <div
      role="status"
      aria-label="Loading page content"
      className="min-h-[50vh] flex flex-col items-center justify-center py-20 px-4"
    >
      <div className="relative w-12 h-12 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-[#D4A24C]/20 border-t-[#D4A24C] animate-spin" />
        <div className="absolute w-2 h-2 rounded-full bg-[#D4A24C] animate-pulse" />
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
