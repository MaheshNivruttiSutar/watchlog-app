const path = require('node:path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const { getSharedSingletons } = require('../webpack/sharedSingletons.cjs');
const { withBundleAnalyzer } = require('../webpack/analyzer.cjs');

const hostPort = 3000;
const remoteEntryUrl = 'http://localhost:3001/remoteEntry.js';

module.exports = (env = {}, argv) => {
  const mode = argv.mode === 'production' ? 'production' : 'development';
  const isDevelopment = mode === 'development';

  return {
    name: 'watchlog-host',
    mode,
    entry: './src/index.ts',
    devtool: isDevelopment ? 'eval-cheap-module-source-map' : 'source-map',
    output: {
      path: path.join(__dirname, 'dist'),
      publicPath: `http://localhost:${hostPort}/`,
      uniqueName: 'watchlogHost',
      clean: true,
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              compilerOptions: {
                noEmit: false,
              },
            },
          },
        },
      ],
    },
    plugins: [
      new ModuleFederationPlugin({
        name: 'watchlogHost',
        remotes: {
          watchlog: `watchlog@${remoteEntryUrl}`,
        },
        shared: getSharedSingletons(),
      }),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'index.html'),
      }),
      ...withBundleAnalyzer({
        enabled: Boolean(env.analyze),
        reportFilename: path.join(__dirname, '..', 'docs/mf-host-report.html'),
        statsFilename: path.join(__dirname, '..', 'docs/mf-host-stats.json'),
      }),
    ],
    devServer: {
      port: hostPort,
      historyApiFallback: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },
  };
};
