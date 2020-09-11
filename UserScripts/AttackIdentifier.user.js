// ==UserScript==
// @name                Attack Identifier
// @version     	    1.0.0
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
(() => {
    'use strict';

    //****************************** Configuration ******************************//
    const mediumReloadTime = 10000;
    const reloadTimeRange = 300;
    //*************************** End Configuration ***************************//

    // Update page
    const intervalRange = Math.floor(Math.random() * (mediumReloadTime - reloadTimeRange / 2) + mediumReloadTime / 2);
    setInterval(function () {
        $("#select_all").click();
    }, intervalRange);
    setInterval(function () {
        $('.btn[value=Etiqueta]').click();
    }, intervalRange + 1000);

})();