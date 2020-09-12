/**
 * Module description
 *
 * @author joaovperin
 */
if (!window.TwFramework) {
    window.TwFramework = {}
}

(async (ModuleLoader) => {

    // Namespace/module
    const ModuleName = 'examples.example-module';

    // Dependency loading
    await ModuleLoader.loadModule('utils.event-utils');


    // Public API
    $.extend(window.TwFramework, {
        sayHello: (name) => console.log('Hello, ', (name || 'Stranger'), '!')
    });

    // Global variables goes here...
    const _myVar = ['Hey'];

    // Code goes here...
    console.table(myVar);

    // Confirm the script is ready!
    console.log("[TwFramework] ~> Module '", ModuleName, "' successfully loaded!");
    return true;
})({
    loadModule: name => {
        const modulePath = name.replace('.', '/');
        return $.ajax({
            method: "GET",
            url: `https://raw.githubusercontent.com/joaovperin/TribalWars/master/Modules/${modulePath}.js`,
            dataType: "text"
        }).done(res => eval(res)).fail(req => console.error("Fail loading module '", name, "'."));
    }
});