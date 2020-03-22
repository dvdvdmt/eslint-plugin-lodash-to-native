'use strict';

const {getVariableByName} = require('eslint/lib/rules/utils/ast-utils.js');

module.exports = {
  meta: {
    docs: {
      description: 'Replaces _.map() to native Array.map() whenever its possible.',
      category: 'Refactoring',
      recommended: true,
    },
    messages: {
      replaceWithCondition: 'Replace to Array.map() with collection type checking',
      replaceDirectly: 'Replace to Array.map()',
    },
    fixable: 'code',
  },

  create: function(context) {
    const sourceCode = context.getSourceCode();

    return {
      CallExpression: function(node) {
        if (isLodashMap(node) && hasTwoArguments(node)) {
          const [collectionNode, mapFnNode] = node.arguments;
          if (isDefinedAs(collectionNode, 'ObjectExpression')) {
            // do nothing if the first argument of _.map() is object
            return;
          }
          const collectionStr = sourceCode.getText(collectionNode);
          const mapFnStr = sourceCode.getText(mapFnNode);
          if (isDefinedAs(collectionNode, 'ArrayExpression')) {
            context.report({
              node: node,
              messageId: 'replaceDirectly',
              fix: function(fixer) {
                return fixer.replaceText(node, getDirectReplace(collectionStr, mapFnStr));
              },
            });
          } else {
            context.report({
              node: node,
              messageId: 'replaceWithCondition',
              fix: function(fixer) {
                return fixer.replaceText(node, getConditionalReplace(collectionStr, mapFnStr));
              },
            });
          }
        }
      },
    };

    function isLodashMap(node) {
      return node.callee.object.name === '_' && node.callee.property.name === 'map';
    }

    function hasTwoArguments(node) {
      return node.arguments.length === 2;
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

function getConditionalReplace(collectionStr, mapFnStr) {
  return `Array.isArray(${collectionStr}) ? ${getDirectReplace(
    collectionStr,
    mapFnStr
  )} : _.map(${collectionStr}, ${mapFnStr})`;
}

function getDirectReplace(collectionStr, mapFnStr) {
  return `${collectionStr}.map(${mapFnStr})`;
}
