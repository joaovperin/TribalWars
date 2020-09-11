/**
 * Utilities to work with JS events
 *
 * @author joaovperin
 */
if (!window.TwFramework) {
    window.TwFramework = {}
}

(async (ModuleLoader) => {

    await ModuleLoader.load('utils/event-utils');

    const ModuleName = 'event-utils';
    const _oldTitle = document.title;
    TwFramework.onVisibilityChange(evt => {
        if (evt.hasFocus) document.title = _oldTitle;
        if (!evt.hasFocus) document.title = '[OI] ' + _oldTitle;
    });

    // Public API
    $.extend(window.TwFramework, {
        onVisibilityChange: (callback) => _visibilityChangeListeners.push(callback)
    });

    const _visibilityChangeListeners = [];

    // Visibility change checker
    (function (_onChangeFn) {
        var hidden = "hidden";

        // Standards:
        if (hidden in document)
            document.addEventListener("visibilitychange", onchange);
        else if ((hidden = "mozHidden") in document)
            document.addEventListener("mozvisibilitychange", onchange);
        else if ((hidden = "webkitHidden") in document)
            document.addEventListener("webkitvisibilitychange", onchange);
        else if ((hidden = "msHidden") in document)
            document.addEventListener("msvisibilitychange", onchange);
        // IE 9 and lower:
        else if ("onfocusin" in document)
            document.onfocusin = document.onfocusout = onchange;
        // All others:
        else
            window.onpageshow = window.onpagehide = window.onfocus = window.onblur = onchange;

        function onchange(evt) {
            var v = "visible",
                h = "hidden",
                evtMap = {
                    focus: v,
                    focusin: v,
                    pageshow: v,
                    blur: h,
                    focusout: h,
                    pagehide: h
                };

            evt = evt || window.event
            if (!evt) evt = {};
            if (evt.type in evtMap)
                evt.windowStatus = evtMap[evt.type];
            else
                evt.windowStatus = this[hidden] ? "hidden" : "visible";
            document.body.className = evt.windowStatus;
            // Fire event listeners assynchronously
            const _evtData = {
                hasFocus: (evt.windowStatus === 'visible')
            };
            _visibilityChangeListeners.forEach(_listener => _listener(_evtData));
        }

        // set the initial state (but only if browser supports the Page Visibility API)
        if (document[hidden] !== undefined)
            onchange({
                type: document[hidden] ? "blur" : "focus"
            });
        return true;
    })();

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