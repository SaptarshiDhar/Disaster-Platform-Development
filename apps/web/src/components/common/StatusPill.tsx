import { cn } from '@/lib/utils/cn';

type StatusPillProps = {
  label: string;
  /** `ready` = configured and available; `pending` = deliberately not yet wired. */
  tone: 'ready' | 'pending';
};

/**
 * Small labelled indicator for integration status. Colour is reinforced by
 * text so it does not rely on hue alone.
 */
export function StatusPill({ label, tone }: StatusPillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium',
        tone === 'ready'
          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
          : 'border-amber-500/40 bg-amber-500/10 text-amber-300',
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'size-1.5 rounded-full',
          tone === 'ready' ? 'bg-emerald-400' : 'bg-amber-400',
        )}
      />
      {label}
      <span className="sr-only">
        {tone === 'ready' ? ' — configured' : ' — not yet configured'}
      </span>
    </span>
  );
}
