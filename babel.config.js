module.exports = {
  presets: ['babel-preset-gatsby'],
  ignore: [
    // Exclude Netlify functions from Babel processing
    // They use CommonJS and don't need transpilation
    'netlify/functions/**/*',
  ],
};
