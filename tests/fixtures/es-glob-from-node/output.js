'use strict';

modules.define('test', function (provide) {
  var exports = {};
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _a = require('a');

  Object.keys(_a).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _a[key];
      }
    });
  });
  provide(exports);
});
