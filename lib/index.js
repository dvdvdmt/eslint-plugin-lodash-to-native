'use strict';

module.exports = {
  configs: {
    recommended: {
      rules: {
        'lodash-to-native/map': 'warn',
      },
    },
  },
  rules: {
    map: require('./rules/map.js'),
  },
};
