'use strict';

modules.require('test', test => {
  test = _extractDefaultValue(test);

  function _extractDefaultValue(obj) {
    return obj && obj.__esModule ? obj.default : obj;
  }
});

modules.require('test', function (test) {
  test = _extractDefaultValue(test);

  function _extractDefaultValue(obj) {
    return obj && obj.__esModule ? obj.default : obj;
  }
});
