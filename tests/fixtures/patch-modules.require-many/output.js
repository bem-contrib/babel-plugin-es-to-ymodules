'use strict';

modules.require(['test', 'test2'], (test, test2) => {
  test2 = _extractDefaultValue(test2);
  test = _extractDefaultValue(test);

  function _extractDefaultValue(obj) {
    return obj && obj.__esModule ? obj.default : obj;
  }
});

modules.require(['test', 'test2'], function (test, test2) {
  test2 = _extractDefaultValue(test2);
  test = _extractDefaultValue(test);

  function _extractDefaultValue(obj) {
    return obj && obj.__esModule ? obj.default : obj;
  }
});
