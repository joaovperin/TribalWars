// ==UserScript==
// @name                Premium Exchange - Alert Resources
// @version     	    1.0.0
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
(() => {
    'use strict';

    //****************************** Configuration ******************************//
    const checkInterval = 150;
    const playSound = true;
    const playAlert = true;
    const showVariation = true;
    const showCurrent = false;
    //*************************** End Configuration ***************************//

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

})();