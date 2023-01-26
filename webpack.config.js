const path = require("path");
module.exports = (phase) => {
  const env = {
    SITE_URL: process.env.SITE_URL,
    CMS_URL:process.env.CMS_URL,
  };
  return {
    env,
    sassOptions: {
      includePaths: [path.join(__dirname, "styles")],
    },
    webpack(config, { buildId, dev, isServer, defaultLoaders, webpack }) {
      config.module.rules.push({
        test: /\.svg$/,
        use: [{ loader: '@svgr/webpack', options: { icon: true } }],
      });
      config.plugins.push(
        new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery"
     }));

      return config;
    },
  };
};