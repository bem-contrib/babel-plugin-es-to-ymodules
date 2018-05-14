'use strict';

modules.define('test', function (provide, _ymTest) {
  var exports = {};
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _ymTest2 = _interopRequireDefault(_ymTest);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  exports.default = _ymTest2.default;
  provide(exports);
});
