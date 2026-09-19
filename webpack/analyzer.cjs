function withBundleAnalyzer({ enabled, reportFilename, statsFilename }) {
  if (!enabled) {
    return [];
  }

  const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

  return [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename,
      generateStatsFile: true,
      statsFilename,
      statsOptions: {
        source: false,
      },
    }),
  ];
}

module.exports = { withBundleAnalyzer };
