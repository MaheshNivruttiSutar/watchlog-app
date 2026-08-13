import * as Switch from '@radix-ui/react-switch';
import { useTheme } from '../context/ThemeContext';

/**
 * Light/dark theme control using Radix Switch.
 * Keyboard: Space/Enter toggles; focus ring is visible.
 */
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Switch.Root
      checked={isDark}
      onCheckedChange={() => toggleTheme()}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-chip border border-border bg-surface-overlay transition-colors data-[state=checked]:bg-accent data-[state=checked]:border-accent focus-visible:outline-none focus-visible:shadow-focus"
    >
      <Switch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-chip bg-surface-raised shadow-card transition-transform data-[state=checked]:translate-x-[1.35rem]" />
    </Switch.Root>
  );
}

export default ThemeToggle;
