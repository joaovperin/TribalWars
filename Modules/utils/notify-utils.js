/**
 * A module to help with notifiying the user
 *
 * @author joaovperin
 */
if (!window.TwFramework) {
    window.TwFramework = {}
}
new Promise(exportModule => {
    (async (ModuleLoader) => {
        'use strict';

        // Namespace/module
        const ModuleName = 'utils.notify-utils';

        // Dependency loading
        await ModuleLoader.loadModule('utils.event-utils');

        /** Script configurations */
        const _Configurations = {};

        // Public API
        $.extend(window.TwFramework, {
            setIdleTitlePreffix: (preffix, originalTitle) => {
                if (_Configurations.setIdleTitlePreffix) {
                    return console.error('Cannot set idle title 2 times!');
                }
                _Configurations.idleTitlePreffix = originalTitle;

                // Update title with preffix
                const _updateTitlefn = evt => {
                    if (!evt) return;
                    const _originalTitle = _Configurations.idleTitlePreffix;
                    if (evt.hasFocus) document.title = _originalTitle;
                    else document.title = `[${preffix}] ${_originalTitle}`;
                };

                // Set the event listener and call the function on the window load
                TwFramework.onVisibilityChange(_updateTitlefn);
                _updateTitlefn({
                    hasFocus: false
                });
            }
        });

        // Confirm the script is ready!
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