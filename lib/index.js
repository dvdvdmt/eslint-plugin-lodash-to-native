'use strict';

module.exports = {
  configs: {
    recommended: {
      plugins: ['lodash-to-native'],
      rules: {
        map: 'warn',
      },
    },
  },
  rules: {
    map: require('./rules/map.js'),
  },
};
