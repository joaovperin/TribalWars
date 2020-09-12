/**
 * Module description
 *
 * @author joaovperin
 */
if (!window.TwFramework) {
    window.TwFramework = {}
}
new Promise(exportModule => {
    (async (ModuleLoader) => {
        'use strict';

        // (Needed) Namespace/module
        const ModuleName = 'examples.example-module';

        /** (Optional)  Dependency loading */
        await ModuleLoader.loadModule('utils.event-utils');

        /** (Optional) Script configurations */
        const _Configurations = {};

        // (Optional) Public API
        $.extend(window.TwFramework, {
            // (Optional) Public method that stores something
            setName: name => {
                if (_Configurations.name) {
                    return console.error('Name already set!');
                }
                _Configurations.name = name;
            },
            // (Optional) Public method that uses something stored
            sayHello: (name) => console.log('Hello, ', (_Configurations.name || 'Stranger'), '!')
        });

        // (Optional) Global variables goes here...
        const _myVar = ['Hey'];

        // (Optional) Code goes here...
        console.table(_myVar);

        // (Needed) Confirm the script is ready!
        console.log("[TwFramework] ~> Module '", ModuleName, "' successfully loaded!");
        return exportModule(true);
    })({
        loadModule: name => {
            const modulePath = name.replace('.', '/');
            return new Promise((resolve, reject) => {
                $.ajax({
                        method: "GET",
                        dataType: "text",
                        url: `https://raw.githubusercontent.com/joaovperin/TribalWars/master/Modules/${modulePath}.js`
                    })
                    .done(res => resolve(eval(res)))
                    .fail(req => reject(console.error("Fail loading module '", name, "'.")));
            })
        }
    });
});