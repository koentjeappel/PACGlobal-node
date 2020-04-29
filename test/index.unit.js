'use strict';

var should = require('chai').should();

describe('Index Exports', function() {
  it('will export pacglobal-lib', function() {
    var pacglobal = require('../');
    should.exist(pacglobal.lib);
    should.exist(pacglobal.lib.Transaction);
    should.exist(pacglobal.lib.Block);
  });
});
