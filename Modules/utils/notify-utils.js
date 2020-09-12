/**
 * A module to help with notifiying the user
 *
 * @author joaovperin
 */
if (!window.TwFramework) {
    window.TwFramework = {}
}

(async (ModuleLoader) => {

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

            // Update title with preffix
            const _updateTitlefn = evt => {
                if (!evt) return;
                const _originalTitle = _Configurations.setIdleTitlePreffix.originalTitle;
                if (evt.hasFocus) document.title = _originalTitle;
                else document.title = `[${preffix}] ${_originalTitle}`;
            };

            // Set the event listener and call the function on the window load
            TwFramework.onVisibilityChange(_updateTitlefn);
            _updateTitlefn({
                hasFocus: false
            });

            // Saves settings on the global scope
            $.extend(_Configurations, {
                setIdleTitlePreffix: {
                    originalTitle: originalTitle
                }
            });
        }
    });

    // Confirm the script is ready!
    console.log("[TwFramework] ~> Module '", ModuleName, "' successfully loaded!");
    return true;
})({
    loadModule: name => {
        const modulePath = name.replace('.', '/');
        return $.ajax({
            method: "GET",
            url: `https://raw.githubusercontent.com/joaovperin/TribalWars/master/Framework/${modulePath}.js`,
            dataType: "text"
        }).done(res => eval(res)).fail(req => console.error("Fail loading module '", name, "'."));
    }
});