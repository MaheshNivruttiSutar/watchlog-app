/**
 * Module Federation share-scope contract.
 *
 * Host and remote must declare the same singleton packages. Webpack then
 * loads one copy of each into the page instead of one copy per app.
 *
 * eager: false — React is not stuffed into the first chunk. That is why
 * both apps use an async bootstrap (import('./bootstrap')).
 */
const SHARED_SINGLETONS = {
  react: {
    singleton: true,
    requiredVersion: '18.3.1',
    eager: false,
  },
  'react-dom': {
    singleton: true,
    requiredVersion: '18.3.1',
    eager: false,
  },
  'react-router-dom': {
    singleton: true,
    requiredVersion: '6.28.0',
    eager: false,
  },
};

function getSharedSingletons() {
  return {
    react: { ...SHARED_SINGLETONS.react },
    'react-dom': { ...SHARED_SINGLETONS['react-dom'] },
    'react-router-dom': { ...SHARED_SINGLETONS['react-router-dom'] },
  };
}

function listSharedSingletonNames() {
  return Object.keys(SHARED_SINGLETONS);
}

module.exports = {
  SHARED_SINGLETONS,
  getSharedSingletons,
  listSharedSingletonNames,
};
