import type { ProfilerOnRenderCallback } from 'react';

export const PROFILE_STORAGE_KEY = 'watchlog-profile';
export const PROFILE_BASELINE_STORAGE_KEY = 'watchlog-profile-baseline';

export interface ProfilerCommit {
  id: string;
  phase: 'mount' | 'update' | 'nested-update';
  actualDuration: number;
  baseDuration: number;
  commitTime: number;
}

declare global {
  interface Window {
    __WATCHLOG_RENDERS__?: Record<string, number>;
    __WATCHLOG_PROFILER__?: ProfilerCommit[];
  }
}

function hasDevFlag(key: string): boolean {
  return (
    typeof window !== 'undefined' &&
    import.meta.env.DEV &&
    window.localStorage.getItem(key) === '1'
  );
}

function isProfiling(): boolean {
  return hasDevFlag(PROFILE_STORAGE_KEY);
}

/** Skip debounce/memo/deferred so a before recording can be captured in-app. */
export function isProfileBaseline(): boolean {
  return hasDevFlag(PROFILE_BASELINE_STORAGE_KEY);
}

/** Count a function-body run. No-op unless localStorage watchlog-profile=1 in dev. */
export function countRender(name: string): void {
  if (!isProfiling()) return;
  window.__WATCHLOG_RENDERS__ ??= {};
  window.__WATCHLOG_RENDERS__[name] =
    (window.__WATCHLOG_RENDERS__[name] ?? 0) + 1;
}

export function resetRenderCounts(): void {
  if (typeof window === 'undefined') return;
  window.__WATCHLOG_RENDERS__ = {};
  window.__WATCHLOG_PROFILER__ = [];
}

export function getRenderCounts(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  return { ...(window.__WATCHLOG_RENDERS__ ?? {}) };
}

export function getProfilerCommits(): ProfilerCommit[] {
  if (typeof window === 'undefined') return [];
  return [...(window.__WATCHLOG_PROFILER__ ?? [])];
}

/** Same callback React DevTools Profiler listens to for a named subtree. */
export const onSearchProfilerRender: ProfilerOnRenderCallback = (
  id,
  phase,
  actualDuration,
  baseDuration,
  _startTime,
  commitTime,
) => {
  if (!isProfiling()) return;
  window.__WATCHLOG_PROFILER__ ??= [];
  window.__WATCHLOG_PROFILER__.push({
    id,
    phase,
    actualDuration,
    baseDuration,
    commitTime,
  });
};

export function summarizeProfiler(commits: ProfilerCommit[]): {
  commitsById: Record<string, number>;
  longestCommitMs: number;
} {
  const commitsById: Record<string, number> = {};
  let longestCommitMs = 0;
  for (const commit of commits) {
    commitsById[commit.id] = (commitsById[commit.id] ?? 0) + 1;
    if (commit.actualDuration > longestCommitMs) {
      longestCommitMs = commit.actualDuration;
    }
  }
  return { commitsById, longestCommitMs };
}
