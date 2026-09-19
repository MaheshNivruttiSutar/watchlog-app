const path = require('node:path');
const webpack = require('webpack');
const dotenv = require('dotenv');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { ModuleFederationPlugin } = webpack.container;
const { getSharedSingletons } = require('./sharedSingletons.cjs');
const { withBundleAnalyzer } = require('./analyzer.cjs');

const projectRoot = path.resolve(__dirname, '..');
const parsedEnvironment =
  dotenv.config({ path: path.join(projectRoot, '.env') }).parsed ?? {};

const remotePort = 3001;

module.exports = (env = {}, argv) => {
  const mode = argv.mode === 'production' ? 'production' : 'development';
  const isDevelopment = mode === 'development';

  return {
    name: 'watchlog-remote',
    mode,
    context: projectRoot,
    entry: './src/remote/standaloneEntry.ts',
    devtool: isDevelopment ? 'eval-cheap-module-source-map' : 'source-map',
    output: {
      path: path.join(projectRoot, 'dist-remote'),
      publicPath: `http://localhost:${remotePort}/`,
      uniqueName: 'watchlog',
      clean: true,
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      extensionAlias: {
        '.js': ['.js', '.ts'],
      },
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
                declaration: false,
                noEmit: false,
              },
            },
          },
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: ['@tailwindcss/postcss'],
                },
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new ModuleFederationPlugin({
        name: 'watchlog',
        filename: 'remoteEntry.js',
        exposes: {
          './WatchLogApp': './src/remote/WatchLogApp.tsx',
        },
        shared: getSharedSingletons(),
      }),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'remote.html'),
      }),
      new webpack.DefinePlugin({
        'import.meta.env': JSON.stringify({
          DEV: isDevelopment,
          PROD: !isDevelopment,
          MODE: mode,
          VITE_TMDB_API_KEY:
            parsedEnvironment.VITE_TMDB_API_KEY ??
            parsedEnvironment.TMDB_API_KEY ??
            '',
        }),
      }),
      ...withBundleAnalyzer({
        enabled: Boolean(env.analyze),
        reportFilename: path.join(projectRoot, 'docs/mf-remote-report.html'),
        statsFilename: path.join(projectRoot, 'docs/mf-remote-stats.json'),
      }),
    ],
    devServer: {
      port: remotePort,
      historyApiFallback: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },
  };
};
