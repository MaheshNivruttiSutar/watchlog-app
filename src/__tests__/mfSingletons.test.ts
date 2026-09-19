import { describe, expect, it } from 'vitest';
import {
  analyzeCompilation,
  analyzeHostAndRemote,
  formatReport,
  listSingletonHits,
} from '../../scripts/mf-singletons.mjs';

function module(partial) {
  return partial;
}

describe('mf singleton stats analysis', () => {
  it('counts consume-shared stubs separately from javascript copies', () => {
    const stats = {
      modules: [
        module({
          name: 'webpack/sharing/consume/default/react/react',
          moduleType: 'consume-shared',
          size: 42,
        }),
        module({
          name: './node_modules/react/index.js',
          moduleType: 'javascript/auto',
          size: 8000,
        }),
        module({
          name: './node_modules/react-dom/index.js',
          moduleType: 'javascript/auto',
          size: 9000,
        }),
      ],
    };

    expect(listSingletonHits(stats, 'react')).toEqual({
      consumeShared: 1,
      javascriptCopies: [
        { name: './node_modules/react/index.js', size: 8000 },
      ],
    });
  });

  it('fails a compilation that emits two javascript copies of react', () => {
    const stats = {
      modules: [
        module({
          name: './node_modules/react/index.js',
          moduleType: 'javascript/auto',
          size: 100,
        }),
        module({
          name: './node_modules/react/index.js',
          moduleType: 'javascript/auto',
          size: 200,
        }),
      ],
    };

    const row = analyzeCompilation(stats).find(
      (entry) => entry.packageName === 'react',
    );
    expect(row?.ok).toBe(false);
    expect(row?.javascriptCopyCount).toBe(2);
  });

  it('passes host + remote when each has one fallback copy and consume-shared', () => {
    const compilation = {
      modules: [
        module({
          name: 'webpack/sharing/consume/default/react/react',
          moduleType: 'consume-shared',
        }),
        module({
          name: 'webpack/sharing/consume/default/react-dom/react-dom',
          moduleType: 'consume-shared',
        }),
        module({
          name: 'webpack/sharing/consume/default/react-router-dom/react-router-dom',
          moduleType: 'consume-shared',
        }),
        module({
          name: './node_modules/react/index.js',
          moduleType: 'javascript/auto',
          size: 1,
        }),
        module({
          name: './node_modules/react-dom/index.js',
          moduleType: 'javascript/auto',
          size: 1,
        }),
        module({
          name: './node_modules/react-router-dom/dist/index.js',
          moduleType: 'javascript/auto',
          size: 1,
        }),
      ],
    };

    const result = analyzeHostAndRemote({
      host: compilation,
      remote: compilation,
    });

    expect(result.ok).toBe(true);
    expect(formatReport(result)).toContain('no singleton bundled twice');
  });
});
