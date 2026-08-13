/** Shared Tailwind class strings for repeated UI patterns (token-based). */

import type { WatchlistStatus } from '../types/watchlistItem';

export const btn =
  'inline-flex items-center justify-center px-4 py-2 border-0 rounded-button text-sm font-semibold cursor-pointer transition-[background,color,opacity] duration-150 disabled:cursor-not-allowed disabled:opacity-50';

export const btnPrimary = `${btn} bg-accent text-white hover:enabled:bg-accent-hover`;

export const btnSecondary = `${btn} bg-surface-overlay text-muted hover:enabled:text-foreground`;

export const btnDanger = `${btn} bg-transparent text-danger shadow-[inset_0_0_0_1px_var(--color-danger)] hover:enabled:bg-danger hover:enabled:text-white hover:enabled:shadow-none`;

export const btnSearch = 'box-border h-control shrink-0 px-5 rounded-control';

export const textLink = 'text-sm font-semibold text-accent hover:underline';

export const textMuted = 'text-muted';

/** Filter / chip toggles — pair with Radix ToggleGroup.Item (`data-state=on|off`). */
export const chipToggleItem =
  'px-4 py-1.5 border border-border rounded-chip bg-surface-raised text-sm font-medium text-muted cursor-pointer hover:text-foreground data-[state=on]:border-accent data-[state=on]:bg-accent data-[state=on]:text-white focus-visible:outline-none focus-visible:shadow-focus disabled:cursor-not-allowed disabled:bg-surface disabled:text-disabled disabled:hover:text-disabled';

/** Search type toggles — pair with Radix ToggleGroup.Item. */
export const typeChipToggleItem =
  'inline-flex items-center justify-center box-border h-control px-3.5 border border-border rounded-control bg-surface-raised text-[0.8125rem] font-semibold text-muted cursor-pointer hover:text-foreground data-[state=on]:border-accent data-[state=on]:bg-accent data-[state=on]:text-white focus-visible:outline-none focus-visible:shadow-focus';

export function badgeClass(position: 'left' | 'right', type: 'movie' | 'book'): string {
  const side = position === 'left' ? 'left-2' : 'right-2';
  const color = type === 'movie' ? 'bg-movie' : 'bg-book';
  return `absolute top-2 ${side} px-2 py-0.5 rounded text-xs font-semibold uppercase text-white ${color}`;
}

/**
 * Status → visual style map for watchlist cards.
 * One object per status keeps variants easy to scan and change.
 */
export const cardStatusVariants: Record<
  WatchlistStatus,
  { label: string; card: string; badge: string }
> = {
  want: { 
    label: 'Want',
    card: 'border-status-want/55 hover:border-status-want',
    badge: 'bg-status-want-soft text-status-want ring-1 ring-inset ring-status-want/25',
  },
  watching: {
    label: 'Watching',
    card: 'border-status-watching/65 hover:border-status-watching',
    badge: 'bg-status-watching-soft text-status-watching ring-1 ring-inset ring-status-watching/30',
  },
  reading: {
    label: 'Reading',
    card: 'border-status-reading/65 hover:border-status-reading',
    badge: 'bg-status-reading-soft text-status-reading ring-1 ring-inset ring-status-reading/35',
  },
  done: {
    label: 'Done',
    card: 'border-status-done/65 hover:border-status-done',
    badge: 'bg-status-done-soft text-status-done ring-1 ring-inset ring-status-done/30',
  },
};

export function cardStatusVariant(status: WatchlistStatus) {
  return cardStatusVariants[status];
}
