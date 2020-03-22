'use strict';

const rule = require('../../../lib/rules/map');
const {RuleTester} = require('eslint');

const ruleTester = new RuleTester();

ruleTester.run('map', rule, {
  valid: [
    '_.foo([], fn)',
    '[1,2,3].map(fn)',
    '_.map({a:1, b:2, c:3}, fn)',
    'var a = {}; _.map(a,b);',
  ],

  invalid: [
    {
      code: '_.map(a,b)',
      errors: [{messageId: 'replaceWithCondition'}],
      output: 'Array.isArray(a) ? a.map(b) : _.map(a, b)',
    },
    {
      code: '_.map([1,2,3], fn)',
      errors: [{messageId: 'replaceDirectly'}],
      output: '[1,2,3].map(fn)',
    },
    {
      code: 'var a = [1,2,3]; _.map(a, fn)',
      errors: [{messageId: 'replaceDirectly'}],
      output: 'var a = [1,2,3]; a.map(fn)',
    },
    {
      code: `(function() {
  const collection = [1, 2, 3];
  const mapFn = (el) => el * 2;
  _.map(collection, mapFn);
})();`,
      errors: [{messageId: 'replaceDirectly'}],
      output: `(function() {
  const collection = [1, 2, 3];
  const mapFn = (el) => el * 2;
  collection.map(mapFn);
})();`,
      parserOptions: {ecmaVersion: 6},
    },
  ],
});
