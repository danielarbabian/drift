import { CORNER_INDICATORS } from '@/lib/constants';

export function CornerIndicators() {
  return (
    <>
      {CORNER_INDICATORS.map((indicator, index) => (
        <div
          key={index}
          className={`absolute ${indicator.position} w-2 h-2 bg-white/20 rounded-full animate-pulse`}
          style={{ animationDelay: indicator.delay }}
        />
      ))}
    </>
  );
}
