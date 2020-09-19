/**
 * A module to store and read configurations
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
        const ModuleName = 'utils.config-utils';

        /** Script configurations */
        const _Configurations = {
            masterKey: 'TwFrameworkConfigs'
        };

        const _getKey = (pageURL, key) => {
            // https://br103.tribalwars.com.br/game.php?village=1234&screen=main
            const p = new URL(pageURL).searchParams;
            return `village.${p.get('village')}.${key}`;
        };

        const _readConfiguration = (pageURL, key, defaultValue) => {
            let cfg = JSON.parse(localStorage.getItem(_Configurations.masterKey));
            const [lvl_1, lvl_2, lvl_3] = _getKey(pageURL, key).split('\.');
            // If has the page key, return that
            if (cfg[lvl_1]) {
                if (cfg[lvl_1][lvl_2]) {
                    if (cfg[lvl_1][lvl_2][lvl_3]) {
                        return cfg[lvl_1][lvl_2][lvl_3];
                    }
                }
            }
            // If has the page key, return the default value
            return defaultValue || null;
        };
        const _saveConfiguration = (pageURL, key, value) => {
            let cfg = JSON.parse(localStorage.getItem(_Configurations.masterKey));
            const [lvl_1, lvl_2, lvl_3] = _getKey(pageURL, key).split('\.');
            // If has the page key, return that
            if (!cfg[lvl_1]) {
                cfg[lvl_1] = {};
            }
            if (!cfg[lvl_1][lvl_2]) {
                cfg[lvl_1][lvl_2] = {};
            }
            cfg[lvl_1][lvl_2][lvl_3] = value;
            localStorage.setItem(_Configurations.masterKey, JSON.stringify(cfg));
        };

        // Public API
        $.extend(window.TwFramework, {
            readConfiguration: (key, defaultValue) => {
                const url = window.location.href;
                return _readConfiguration(url, key, defaultValue);
            },
            saveConfiguration: (key, value) => {
                const url = window.location.href;
                return _saveConfiguration(url, key, value);
            }
        });

        // Create configuration object if not exists
        if (!localStorage.getItem(_Configurations.masterKey)) {
            localStorage.setItem(_Configurations.masterKey, JSON.stringify({}));
        }

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