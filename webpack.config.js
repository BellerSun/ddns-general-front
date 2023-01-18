const { convertLegacyToken } = require('@ant-design/compatible/lib');
const {theme} = require("antd/lib");
const { defaultAlgorithm, defaultSeed } = theme;
const mapToken = defaultAlgorithm(defaultSeed);
const v4Token = convertLegacyToken(mapToken);

module.exports = {
  // ... other config
  loader: 'less-loader',
  options: {
    lessOptions: {
      modifyVars: v4Token,
    },
  },
};
