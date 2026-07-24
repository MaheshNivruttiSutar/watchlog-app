import { useTheme } from '../context/ThemeContext';

function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface-raised text-foreground transition hover:bg-surface-overlay"
        >
            {isDark ? '☀️' : '🌙'}
        </button>
    );
}

export default ThemeToggle;