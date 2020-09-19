// ==UserScript==
// @name                Catpcha Solver
// @version     	    1.0.6
// @description         Solve your captchas for you, so you don't need to worry getting banned
// @author              joaovperin
// @icon                https://i.imgur.com/7WgHTT8.gif
// @include             https://**.tribalwars.com.*
// @downloadURL         https://raw.githubusercontent.com/joaovperin/TribalWars/master/UserScripts/CaptchaSolver.user.js
// @updateURL           https://raw.githubusercontent.com/joaovperin/TribalWars/master/UserScripts/CaptchaSolver.user.js
// ==/UserScript==

/**
 * THIS SCRIPT WAS FORKED FROM Lucas Martins!! Turbinando TW.
 *
 * But I totally improved that, so the credits are mine ;)
 *
 * https://www.youtube.com/watch?v=HE2tBbc7-gA
 */
(() => {
    'use strict';

    //****************************** Configuration ******************************//
    //*************************** End Configuration ***************************//

    // Solve captcha function
    const _solveCaptchaFunction = _documentReference => {

        // https://www.tutorialrepublic.com/faq/how-to-detect-click-inside-iframe-using-javascript.php

        // Auto-solve capcha (if possible)
        if (_documentReference.location) {
            if (_documentReference.location.href.indexOf('google.com/recaptcha') > -1) {
                var clickCheck = setInterval(function () {
                    if (_documentReference.querySelectorAll('.recaptcha-checkbox-checkmark').length > 0) {
                        clearInterval(clickCheck);
                        _documentReference.querySelector('.recaptcha-checkbox-checkmark').click();
                    }
                }, 100);
            }
        } else if (_documentReference.forms) {
            const forms = _documentReference.forms;
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
        }

        // Fallback: a checkbox designed div without a form (they are starting to be smart hehe)
        const _selector = '.recaptcha-checkbox.recaptcha-checkbox-unchecked.rc-anchor-checkbox';
        const query = _documentReference.querySelectorAll(_selector);
        if (query && query.length > 0) {
            query.forEach(item => item.click());
            setTimeout(() => window.location.reload(true), 1372);
        }
    };

    /**
     * Starts the function to run on main document and also iFrames
     */
    setInterval(() => {
        _solveCaptchaFunction(document);
        document.querySelectorAll('iframe').forEach(item =>
            _solveCaptchaFunction(item.contentWindow.document.body)
        )
    }, 5327);

})();