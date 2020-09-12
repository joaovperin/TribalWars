/**
 * Utilities to work with JS events
 *
 * @author joaovperin
 */
if (!window.TwFramework) {
    window.TwFramework = {}
}
new Promise(exportModule => {
    (async () => {
        'use strict';

        // Namespace/module
        const ModuleName = 'event.event-utils';

        // Public API
        $.extend(window.TwFramework, {
            onVisibilityChange: (callback) => _visibilityChangeListeners.push(callback)
        });

        const _visibilityChangeListeners = [];

        // Visibility change checker
        (function () {
            let hidden = "hidden";

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
                let v = "visible",
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
        })();

        console.log("[TwFramework] ~> Module '", ModuleName, "' successfully loaded!");
        return exportModule(true);
    })();
});