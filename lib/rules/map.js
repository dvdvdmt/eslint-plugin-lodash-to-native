'use strict';

const {getVariableByName} = require('eslint/lib/rules/utils/ast-utils.js');

module.exports = {
  meta: {
    docs: {
      description: 'Replaces _.map() to native Array.map() whenever its possible.',
      category: 'Refactoring',
      recommended: false,
    },
    messages: {
      replaceLodashMap: 'Replace _.map() with Array.map()',
      replaceWithoutCollectionTypeChecking: 'Can be replaced by Array.map() without type checking',
    },
    fixable: 'code',
  },

  create: function(context) {
    return {
      CallExpression: function(node) {
        if (isLodash(node) && isMap(node) && hasFirstArgument(node)) {
          const firstArg = node.arguments[0];
          if (isDefinedAs(firstArg, 'ObjectExpression')) {
            // do nothing if the first argument of _.map() is object
            return;
          }
          if (isDefinedAs(firstArg, 'ArrayExpression')) {
            context.report({
              node: node,
              messageId: 'replaceWithoutCollectionTypeChecking',
            });
          } else {
            context.report({node: node, messageId: 'replaceLodashMap'});
          }
        }
      },
    };

    function isLodash(node) {
      return node.callee.object.name === '_';
    }

    function isMap(node) {
      return node.callee.property.name === 'map';
    }

    function hasFirstArgument(node) {
      return !!node.arguments[0];
    }

    function isDefinedAs(node, nodeType) {
      if (node.type === nodeType) {
        return true;
      }

      if (node.type === 'Identifier') {
        const scope = context.getScope();
        const variable = getVariableByName(scope, node.name);
        if (variable && variable.defs.length) {
          const [firstDefinition] = variable.defs;
          return isDefinedAs(firstDefinition.node.init, nodeType);
        }
      }

      return false;
    }
  },
};
