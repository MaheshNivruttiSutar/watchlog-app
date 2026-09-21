/**
 * Babel is only for Jest. Vite still compiles the app; Webpack still uses ts-loader.
 * Tests compile to CommonJS so Jest 29 can load `"type": "module"` source.
 */
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
    ['@babel/preset-typescript', { allowDeclareFields: true }],
  ],
  plugins: [
    function transformImportMeta() {
      return {
        name: 'watchlog-import-meta',
        visitor: {
          MetaProperty(path) {
            const { node } = path;
            if (node.meta.name !== 'import' || node.property.name !== 'meta') {
              return;
            }
            path.replaceWithSourceString(
              '({ env: { DEV: true, PROD: false, MODE: "test", VITE_TMDB_API_KEY: process.env.VITE_TMDB_API_KEY || "" }, url: "file://jest-test.js" })',
            );
          },
        },
      };
    },
  ],
};
