import pluginTester from 'babel-plugin-tester';
import path from 'path'
import plugin from '../src'

pluginTester({
    plugin: plugin,
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
