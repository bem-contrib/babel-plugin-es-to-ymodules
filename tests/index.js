const pluginTester = require('babel-plugin-tester')
const path = require('path')
const plugin = require('../lib')

pluginTester({
    plugin: plugin.default,
    pluginName : 'es-to-ymodules',
    fixtures: path.join(__dirname, 'fixtures'),
    tests : [
        {
            title : 'Thorw error, if module name not defined',
            code : 'export default {}',
            snapshot : false,
            error : /Module name required/
        },
    ]
});
