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
        {
            title : 'No thorw module name error, if plain ymodule',
            code : '/** */\n modules.define',
            snapshot : true
        },
        {
            title : 'Patch modules with short arrow',
            code : `modules.define('a', (p, a) => p(a))`,
            snapshot : true
        }
    ]
});
