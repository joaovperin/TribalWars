// ==UserScript==
// @name                Premium Exchange - Alert Resources
// @version     	    1.0.1
// @description         Shows the total incoming troops (support and attack) in the village info screen
// @description         Plays chicken sound whenever there is something in the stock
// @author              joaovperin
// @icon                https://i.imgur.com/7WgHTT8.gif
// @include             https://**.tribalwars.com.*/game.php?**&screen=market*&mode=exchange*
// @downloadURL         https://raw.githubusercontent.com/joaovperin/TribalWars/stable/UserScripts/PremiumExchangeAlert.user.js
// @updateURL           https://raw.githubusercontent.com/joaovperin/TribalWars/stable/UserScripts/PremiumExchangeAlert.user.js
// ==/UserScript==


/**
 * THIS SCRIPT WAS FORKED FROM FunnyPocketBook. All credits to him!
 */
(async (ModuleLoader) => {
    'use strict';

    //****************************** Configuration ******************************//
    const checkInterval = 150;
    const playSound = true;
    const playAlert = true;
    const showVariation = true;
    const showCurrent = false;
    //*************************** End Configuration ***************************//

    // Dependency loading
    await ModuleLoader.loadModule('utils/event-utils');

    // Controls the window title
    const _originalTitle = document.title;
    TwFramework.onVisibilityChange(evt => {
        if (evt.hasFocus) document.title = _originalTitle;
        else document.title = `[PREMIUM_ALERT] ${_originalTitle}`;
    });

    let woodOld = parseInt(document.getElementById("premium_exchange_stock_wood").textContent);
    let stoneOld = parseInt(document.getElementById("premium_exchange_stock_stone").textContent);
    let ironOld = parseInt(document.getElementById("premium_exchange_stock_iron").textContent);

    const fmtDate = (dateValue) => {
        dateValue = dateValue || new Date();
        return dateValue.toLocaleString() + ' .' + dateValue.getMilliseconds();
    }

    const withSignal = (num) => {
        return (num == 0 ? '' : num > 0 ? '+' : '-') + num;
    }

    const _checkResourcesThread = setInterval(() => {
        let woodCurrent = parseInt(document.getElementById("premium_exchange_stock_wood").textContent);
        let stoneCurrent = parseInt(document.getElementById("premium_exchange_stock_stone").textContent);
        let ironCurrent = parseInt(document.getElementById("premium_exchange_stock_iron").textContent);
        if (woodCurrent != woodOld || stoneCurrent != stoneOld || ironCurrent != ironOld) {
            if (playSound) {
                TribalWars.playSound("chicken");
            }
            if (playAlert) {
                UI.Notification.show("https://dsbr.innogamescdn.com/asset/c092731a/graphic/resources/premium.png", 'Atenção!', 'Recursos disponíveis!');
            }
            const preffix = '~>' + fmtDate();
            if (showCurrent) {
                console.log(preffix, 'Wood: ', woodCurrent, 'Stone: ', stoneCurrent, 'Iron: ', ironCurrent);
            }
            if (showVariation) {
                const vWood = (woodCurrent - woodOld),
                    vStone = (stoneCurrent - stoneOld),
                    vIron = (ironCurrent - ironOld);
                console.log(preffix, 'Wood: ', withSignal(vWood), 'Stone: ', withSignal(vStone), 'Iron: ', withSignal(vIron));
            }
        }
        woodOld = parseInt(document.getElementById("premium_exchange_stock_wood").textContent);
        stoneOld = parseInt(document.getElementById("premium_exchange_stock_stone").textContent);
        ironOld = parseInt(document.getElementById("premium_exchange_stock_iron").textContent);
    }, checkInterval);

    return _checkResourcesThread;

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