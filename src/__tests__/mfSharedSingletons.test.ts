import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const {
  getSharedSingletons,
  listSharedSingletonNames,
} = require('../../webpack/sharedSingletons.cjs');

describe('Module Federation shared singletons', () => {
  it('declares React and the router as singletons with pinned versions', () => {
    expect(listSharedSingletonNames()).toEqual([
      'react',
      'react-dom',
      'react-router-dom',
    ]);

    const shared = getSharedSingletons();

    expect(shared.react).toEqual({
      singleton: true,
      requiredVersion: '18.3.1',
      eager: false,
    });
    expect(shared['react-dom']).toEqual({
      singleton: true,
      requiredVersion: '18.3.1',
      eager: false,
    });
    expect(shared['react-router-dom']).toEqual({
      singleton: true,
      requiredVersion: '6.28.0',
      eager: false,
    });
  });

  it('is the shared block used by both webpack configs', () => {
    const remoteConfig = require('../../webpack/remote.config.cjs')(
      {},
      { mode: 'production' },
    );
    const hostConfig = require('../../host-shell/webpack.config.cjs')(
      {},
      { mode: 'production' },
    );

    const remoteShared = findFederationShared(remoteConfig);
    const hostShared = findFederationShared(hostConfig);

    expect(remoteShared).toEqual(getSharedSingletons());
    expect(hostShared).toEqual(getSharedSingletons());
  });
});

function findFederationShared(webpackConfig: { plugins?: unknown[] }) {
  const plugin = webpackConfig.plugins?.find(
    (entry) =>
      Boolean(entry) &&
      typeof entry === 'object' &&
      'constructor' in entry &&
      (entry as { constructor: { name: string } }).constructor.name ===
        'ModuleFederationPlugin',
  ) as { options?: { shared?: unknown } } | undefined;

  return plugin?.options?.shared;
}
