import { useEffect, useState } from 'react';
import {
  getProfilerCommits,
  getRenderCounts,
  PROFILE_STORAGE_KEY,
  summarizeProfiler,
} from '../debug/renderCounts';

/** Dev-only HUD: render counts plus React Profiler commit stats. */
function SearchProfileHud() {
  const [visible, setVisible] = useState(false);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [commitsById, setCommitsById] = useState<Record<string, number>>({});
  const [longestCommitMs, setLongestCommitMs] = useState(0);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    if (window.localStorage.getItem(PROFILE_STORAGE_KEY) !== '1') return;
    setVisible(true);
    const id = window.setInterval(() => {
      setCounts(getRenderCounts());
      const summary = summarizeProfiler(getProfilerCommits());
      setCommitsById(summary.commitsById);
      setLongestCommitMs(summary.longestCommitMs);
    }, 150);
    return () => window.clearInterval(id);
  }, []);

  if (!visible) return null;

  return (
    <aside
      className="fixed right-3 bottom-3 z-50 max-w-xs rounded-card border border-border bg-surface-raised p-3 text-xs text-foreground shadow-card"
      data-testid="search-profile-hud"
    >
      <p className="m-0 mb-2 font-semibold uppercase tracking-wide text-muted">
        Search Profiler
      </p>
      <pre className="m-0 whitespace-pre-wrap font-mono">
        {JSON.stringify(
          {
            functionBodyRuns: counts,
            profilerCommits: commitsById,
            longestCommitMs: Number(longestCommitMs.toFixed(2)),
          },
          null,
          2,
        )}
      </pre>
    </aside>
  );
}

export default SearchProfileHud;
