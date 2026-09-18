// @vitest-environment jsdom

import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDebouncedValue } from '../hooks/useDebouncedValue';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;
let latestValue = '';

function Probe({ value, delayMs }: { value: string; delayMs: number }) {
  latestValue = useDebouncedValue(value, delayMs);
  return null;
}

function renderProbe(value: string, delayMs = 300) {
  act(() => {
    root.render(<Probe value={value} delayMs={delayMs} />);
  });
}

beforeEach(() => {
  vi.useFakeTimers();
  container = document.createElement('div');
  root = createRoot(container);
  latestValue = '';
});

afterEach(() => {
  act(() => {
    root.unmount();
  });
  vi.useRealTimers();
});

describe('useDebouncedValue', () => {
  it('delays updates until the quiet period finishes', () => {
    renderProbe('dune');
    expect(latestValue).toBe('dune');

    renderProbe('foundation');
    expect(latestValue).toBe('dune');

    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(latestValue).toBe('dune');

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(latestValue).toBe('foundation');
  });

  it('restarts the timer when the value changes again', () => {
    renderProbe('d');

    act(() => {
      vi.advanceTimersByTime(200);
    });
    renderProbe('dune');

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(latestValue).toBe('d');

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(latestValue).toBe('dune');
  });
});
