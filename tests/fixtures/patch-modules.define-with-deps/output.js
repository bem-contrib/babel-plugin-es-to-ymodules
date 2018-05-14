'use strict';

modules.define('test', ['a', 'b'], function (provide, a, b) {
  b = _extractDefaultValue(b);
  a = _extractDefaultValue(a);

  function _extractDefaultValue(obj) {
    return obj && obj.__esModule ? obj.default : obj;
  }
});
