// ==UserScript==
// @name                Command Schedulerx
// @version     	    1.0.1
// @description         Schedule commands so you don't have to worry about waking up at dawn to launch your OPs
// @author              joaovperin
// @icon                https://i.imgur.com/7WgHTT8.gif
// @include             https://**.tribalwars.com.*/game.php?**&screen=place*&try=confirm*
// @downloadURL         https://raw.githubusercontent.com/joaovperin/TribalWars/master/UserScripts/CommandScheduler.user.js
// @updateURL           https://raw.githubusercontent.com/joaovperin/TribalWars/master/UserScripts/CommandScheduler.user.js
// ==/UserScript==

/**
 * THIS SCRIPT WAS FORKED FROM Marcos V.S. Marques. All credits to him!
 *
 * tribalwarsbr100@gmail.com
 * https://www.youtube.com/channel/UCIngQdlpQxocFDB4Vk6yERg
 */
(() => {
    'use strict';

    //****************************** Configuration ******************************//
    const defaultOffset = 30;
    //*************************** End Configuration ***************************//

    console.warn('This script is deprecated! Use AdvancedCommandScheduler.user.js instead.');

    const CommandSender = {
        confirmButton: null,
        duration: null,
        dateNow: null,
        offset: null,
        init: function () {
            // Create some Html
            $($('#command-data-form').find('tbody')[0]).append(
                `<tr>
                    <td>Chegada:</td><td><input type="datetime-local" id="CStime" step=".001"></td>
                 </tr>
                 <tr>
                    <td>Delay:</td>
                    <td><input type="number" id="CSoffset"><button type="button" id="CSbutton" class="btn">Confirm</button></td>
                 </tr>`
            );
            this.confirmButton = $('#troop_confirm_go');
            this.duration = $('#command-data-form').find('td:contains("Duração:")').next().text().split(':').map(Number);
            this.offset = localStorage.getItem('CS.offset') || defaultOffset;
            this.dateNow = this.convertToInput((() => {
                var d = new Date();
                d.setSeconds(d.getSeconds() + 15);
                d.setMilliseconds(501);
                return d;
            })());
            $('#CSoffset').val(this.offset);
            $('#CStime').val(this.dateNow);
            $('#CSbutton').click(function () {
                const attackTime = CommandSender.getAttackTime();
                CommandSender.offset = parseInt($('#CSoffset').val());
                localStorage.setItem('CS.offset', CommandSender.offset);
                CommandSender.confirmButton.addClass('btn-disabled');
                setTimeout(function () {
                    CommandSender.confirmButton.click();
                }, attackTime - Timing.getCurrentServerTime() + CommandSender.offset);
                this.disabled = true;
            });
        },
        getAttackTime: function () {
            var d = new Date($('#CStime').val().replace('T', ' '));
            d.setHours(d.getHours() - this.duration[0]);
            d.setMinutes(d.getMinutes() - this.duration[1]);
            d.setSeconds(d.getSeconds() - this.duration[2]);
            return d;
        },
        convertToInput: function (t) {
            t.setHours(t.getHours() + this.duration[0]);
            t.setMinutes(t.getMinutes() + this.duration[1]);
            t.setSeconds(t.getSeconds() + this.duration[2]);
            var a = {
                y: t.getFullYear(),
                m: t.getMonth() + 1,
                d: t.getDate(),
                time: t.toTimeString().split(' ')[0],
                ms: t.getMilliseconds()
            };
            if (a.m < 10) {
                a.m = '0' + a.m;
            }
            if (a.d < 10) {
                a.d = '0' + a.d;
            }
            if (a.ms < 100) {
                a.ms = '0' + a.ms;
                if (a.ms < 10) {
                    a.ms = '0' + a.ms;
                }
            }
            return a.y + '-' + a.m + '-' + a.d + 'T' + a.time + '.' + a.ms;
        },
        addGlobalStyle: function (css) {
            var head, style;
            head = document.getElementsByTagName('head')[0];
            if (!head) {
                return;
            }
            style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = css;
            head.appendChild(style);
        }
    };

    CommandSender.addGlobalStyle('#CStime, #CSoffset {font-size: 9pt;font-family: Verdana,Arial;}#CSbutton {float:right;}');
    var a = setInterval(function () {
        if (document.getElementById('command-data-form') && jQuery) {
            CommandSender.init();
            clearInterval(a);
        }
    }, 1); // faster load

})();