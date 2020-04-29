'use strict';

var createError = require('errno').create;

var PacglobalNodeError = createError('PacglobalNodeError');

var RPCError = createError('RPCError', PacglobalNodeError);

module.exports = {
  Error: PacglobalNodeError,
  RPCError: RPCError
};
