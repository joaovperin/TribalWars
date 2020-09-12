// ==UserScript==
// @name                Attack Identifier
// @version     	    1.0.2
// @description         Identify incoming attacks for you
// @author              joaovperin
// @icon                https://i.imgur.com/7WgHTT8.gif
// @include             https://**.tribalwars.com.*/game.php?**&mode=incomings**&subtype=attacks*
// @downloadURL         https://raw.githubusercontent.com/joaovperin/TribalWars/stable/UserScripts/AttackIdentifier.user.js
// @updateURL           https://raw.githubusercontent.com/joaovperin/TribalWars/stable/UserScripts/AttackIdentifier.user.js
// ==/UserScript==

/**
 * THIS SCRIPT WAS FORKED FROM Igor Esperandio!! All credits to him!
 *
 * https://www.youtube.com/watch?v=HE2tBbc7-gA
 */
(async (ModuleLoader) => {
    'use strict';

    //****************************** Configuration ******************************//
    const mediumReloadTime = 10000;
    const reloadTimeRange = 300;
    //*************************** End Configuration ***************************//

    // Dependency loading
    await ModuleLoader.loadModule('utils/event-utils');

    // Controls the window title
    const _originalTitle = document.title;
    TwFramework.onVisibilityChange(evt => {
        if (evt.hasFocus) document.title = _originalTitle;
        else document.title = `[IDENTIFIER] ${_originalTitle}`;
    });

    // Update page
    const intervalRange = Math.floor(Math.random() * (mediumReloadTime - reloadTimeRange / 2) + mediumReloadTime / 2);
    setInterval(function () {
        $("#select_all").click();
    }, intervalRange);
    setInterval(function () {
        $('.btn[value=Etiqueta]').click();
    }, intervalRange + 1000);

})({
    // ModuleLoader functions
    loadModule: moduleName => {
        const modulePath = moduleName.replace('.', '/');
        const moduleUrl = `https://raw.githubusercontent.com/joaovperin/TribalWars/master/Modules/${modulePath}.js`;
        console.debug('[TwScripts] Loading ', modulePath, ' from URL ', moduleUrl, '...');
        return $.ajax({
            method: "GET",
            url: moduleUrl,
            dataType: "text"
        }).done(res => {
            console.debug(res);
            eval(res);
        }).fail(req => console.error("[TwScripts] Fail loading module '", moduleName, "'."));
    }
});