/**
 * @fileoverview Replaces _.map() to native Array.map() whenever it is possible.
 * @author Dmitriy Davydov
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var requireIndex = require('requireindex');

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

// import all rules in lib/rules
module.exports.rules = requireIndex(__dirname + '/rules');
