import Image from 'next/image';

export default function PosterCard({
  title, subtitle, badge, imgSrc, actions
}: {
  title: string; subtitle?: string; badge?: string; imgSrc: string; actions?: React.ReactNode;
}) {
  return (
    <div className="poster">
      <Image src={imgSrc} alt={title} width={320} height={220} />
      <div className="meta">
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
