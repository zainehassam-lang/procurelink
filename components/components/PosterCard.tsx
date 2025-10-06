import Image from 'next/image';

export default function PosterCard({
  title, subtitle, badge, imgSrc, actions
}: {
  title: string; subtitle?: string; badge?: string; imgSrc: string; actions?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl overflow-hidden relative bg-[#1a1a22] border border-[#2a2a34] min-w-[240px] snap-start">
      <Image src={imgSrc} alt={title} width={320} height={200} />
      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-white">
        {subtitle && <div className="text-xs opacity-90">{subtitle}</div>}
        <div className="text-sm font-semibold">{title}</div>
        <div className="flex items-center justify-between mt-2">
          {badge ? <span className="badge px-2 py-0.5 rounded-md text-[10px]">{badge}</span> : <span />}
          <div className="flex gap-2">{actions}</div>
        </div>
      </div>
    </div>
  );
}
