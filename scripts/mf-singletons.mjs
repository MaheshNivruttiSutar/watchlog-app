/**
 * Inspect webpack stats for React / react-dom / react-router-dom.
 *
 * A singleton is duplicated *inside one compilation* when more than one
 * javascript/auto copy of that package is emitted. consume-shared modules
 * are Federation stubs — they should exist. A single javascript/auto copy
 * is the standalone fallback provider, not a second runtime React.
 */

export const SINGLETON_PACKAGES = ['react', 'react-dom', 'react-router-dom'];

function moduleName(mod) {
  return String(mod?.name || mod?.identifier || '');
}

function moduleType(mod) {
  return String(mod?.moduleType || '');
}

function walkModules(stats, visit) {
  const queue = Array.isArray(stats?.modules) ? [...stats.modules] : [];

  while (queue.length > 0) {
    const mod = queue.shift();
    visit(mod);
    if (Array.isArray(mod?.modules)) {
      queue.push(...mod.modules);
    }
  }
}

function isPackageEntry(name, packageName) {
  return (
    name.endsWith(`node_modules/${packageName}/index.js`) ||
    name.includes(`node_modules/${packageName}/dist/index.js`)
  );
}

function isConsumeShared(name, type, packageName) {
  if (name.includes(`webpack/sharing/consume/default/${packageName}/`)) {
    return true;
  }

  return (
    type.includes('consume-shared') &&
    (name.includes(`/${packageName}/`) || name.endsWith(`/${packageName}`))
  );
}

export function listSingletonHits(stats, packageName) {
  const javascriptCopies = [];
  let consumeShared = 0;

  walkModules(stats, (mod) => {
    const name = moduleName(mod);
    const type = moduleType(mod);

    if (isConsumeShared(name, type, packageName)) {
      consumeShared += 1;
      return;
    }

    if (type.includes('consume-shared') || name.includes('webpack/sharing/')) {
      return;
    }

    if (type === 'javascript/auto' && isPackageEntry(name, packageName)) {
      javascriptCopies.push({
        name,
        size: Number(mod.size) || 0,
      });
    }
  });

  return { consumeShared, javascriptCopies };
}

export function analyzeCompilation(stats) {
  return SINGLETON_PACKAGES.map((packageName) => {
    const hits = listSingletonHits(stats, packageName);
    return {
      packageName,
      javascriptCopyCount: hits.javascriptCopies.length,
      consumeShared: hits.consumeShared,
      ok: hits.javascriptCopies.length <= 1,
    };
  });
}

export function analyzeHostAndRemote(statsPair) {
  const hostRows = analyzeCompilation(statsPair.host);
  const remoteRows = analyzeCompilation(statsPair.remote);

  const findings = SINGLETON_PACKAGES.map((packageName) => {
    const hostRow = hostRows.find((row) => row.packageName === packageName);
    const remoteRow = remoteRows.find((row) => row.packageName === packageName);
    const remoteConsumes = (remoteRow?.consumeShared ?? 0) > 0;
    const hostConsumes = (hostRow?.consumeShared ?? 0) > 0;
    const noDoubleBundle =
      (hostRow?.javascriptCopyCount ?? 0) <= 1 &&
      (remoteRow?.javascriptCopyCount ?? 0) <= 1;

    return {
      packageName,
      hostCopies: hostRow?.javascriptCopyCount ?? 0,
      remoteCopies: remoteRow?.javascriptCopyCount ?? 0,
      hostConsumeShared: hostRow?.consumeShared ?? 0,
      remoteConsumeShared: remoteRow?.consumeShared ?? 0,
      ok: Boolean(
        hostRow?.ok &&
          remoteRow?.ok &&
          hostConsumes &&
          remoteConsumes &&
          noDoubleBundle,
      ),
    };
  });

  return {
    ok: findings.every((row) => row.ok),
    findings,
  };
}

export function formatReport(result) {
  const lines = [
    'WatchLog Module Federation — singleton check',
    '============================================',
  ];

  for (const row of result.findings) {
    const mark = row.ok ? 'OK' : 'FAIL';
    lines.push(
      `${mark} ${row.packageName}: hostCopies=${row.hostCopies} remoteCopies=${row.remoteCopies} hostConsumeShared=${row.hostConsumeShared} remoteConsumeShared=${row.remoteConsumeShared}`,
    );
  }

  lines.push(
    result.ok
      ? 'Result: no singleton bundled twice inside either compilation'
      : 'Result: duplicate singleton detected',
  );

  return lines.join('\n');
}
