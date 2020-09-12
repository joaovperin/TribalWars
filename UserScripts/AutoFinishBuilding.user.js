// ==UserScript==
// @name                Auto Finish Buildings
// @version     	    1.0.2
// @description         Auto-click on the 'finish' green button (when it appears)
// @author              joaovperin
// @icon                https://i.imgur.com/7WgHTT8.gif
// @include             https://**.tribalwars.com.*/game.php?**&screen=main*
// @downloadURL         https://raw.githubusercontent.com/joaovperin/TribalWars/master/UserScripts/AutoFinishBuilding.user.js
// @updateURL           https://raw.githubusercontent.com/joaovperin/TribalWars/master/UserScripts/AutoFinishBuilding.user.js
// ==/UserScript==

(async (ModuleLoader) => {
    'use strict';
    //****************************** Configuration ******************************//
    const mediumDelay = 1000;
    const delayRange = 300;
    //*************************** End Configuration ***************************//

    const intervalRange = Math.floor(Math.random() * (mediumDelay - delayRange / 2) + mediumDelay / 2);

    // Dependency loading
    await ModuleLoader.loadModule('utils/event-utils');

    // Controls the window title
    const _originalTitle = document.title;
    TwFramework.onVisibilityChange(evt => {
        if (evt.hasFocus) document.title = _originalTitle;
        else document.title = `[AUTO_FINISH] ${_originalTitle}`;
    });


    // Loop
    setInterval(() => {

        const tr = $('[id="buildqueue"]').find('tr').eq(1);
        const text = tr.find('td').eq(1).find('span').eq(0).text().split(" ").join("").split("\n").join("");
        const timeSplit = text.split(':');

        // Free completition
        if (timeSplit[0] * 60 * 60 + timeSplit[1] * 60 + timeSplit[2] * 1 < 3 * 60) {
            tr.find('td').eq(2).find('a').eq(2).click();
        }
        // Completed mission
        $('[class="btn btn-confirm-yes"]').click();

    }, intervalRange);

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