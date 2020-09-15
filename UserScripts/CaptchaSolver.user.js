// ==UserScript==
// @name                Catpcha Solver
// @version     	    1.0.1
// @description         Solve your captchas for you, so you don't need to worry getting banned
// @author              joaovperin
// @icon                https://i.imgur.com/7WgHTT8.gif
// @include             https://**.tribalwars.com.*/*
// @downloadURL         https://raw.githubusercontent.com/joaovperin/TribalWars/master/UserScripts/CaptchaSolver.user.js
// @updateURL           https://raw.githubusercontent.com/joaovperin/TribalWars/master/UserScripts/CaptchaSolver.user.js
// ==/UserScript==

/**
 * THIS SCRIPT WAS FORKED FROM Lucas Martins!! Turbinando TW. All credits to him!
 *
 * https://www.youtube.com/watch?v=HE2tBbc7-gA
 */
(() => {
    'use strict';

    //****************************** Configuration ******************************//
    const excludedDomains = ['miped.ru', 'indiegala', 'gleam.io'];
    //*************************** End Configuration ***************************//

    const domain = (window.location != window.parent.location) ? document.referrer.toString() : document.location.toString();
    // Filter excluded domains
    for (let i in excludedDomains) {
        if (domain.indexOf(excludedDomains[i]) !== -1) {
            return;
        }
    }


    // Auto-solve capcha (if possible)
    if (location.href.indexOf('google.com/recaptcha') > -1) {
        var clickCheck = setInterval(function () {
            if (document.querySelectorAll('.recaptcha-checkbox-checkmark').length > 0) {
                clearInterval(clickCheck);
                document.querySelector('.recaptcha-checkbox-checkmark').click();
            }
        }, 100);
    } else {
        const forms = document.forms;
        for (let i = 0; i < forms.length; i++) {
            if (forms[i].innerHTML.indexOf('google.com/recaptcha') > -1) {
                const rc_form = forms[i];
                var solveCheck = setInterval(function () {
                    if (grecaptcha.getResponse().length > 0) {
                        clearInterval(solveCheck);
                        rc_form.submit();
                    }
                }, 100);
            }
        }
        // Fallback: a checkbox designed div without a form (they are starting to be smart hehe)
        ((_selector) => {
            if ($(_selector)()) {
                $(_selector).click();
            }
        })('.recaptcha-checkbox.recaptcha-checkbox-unchecked.rc-anchor-checkbox');
    }

})();