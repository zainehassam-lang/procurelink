'use client';
import { useRef } from 'react';

export default function Carousel({ title, children }:
  { title: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="my-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex gap-2">
          <button className="btn secondary" onClick={() => ref.current?.scrollBy({ left: -400, behavior: 'smooth' })}>◀</button>
          <button className="btn secondary" onClick={() => ref.current?.scrollBy({ left: 400, behavior: 'smooth' })}>▶</button>
        </div>
      </div>
      <div ref={ref} className="flex gap-4 overflow-x-auto snap-x snap-mandatory">
        {/* children are the cards */}
        {children}
      </div>
    </div>
  );
}
