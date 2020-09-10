// ==UserScript==
// @name                Advanced Command Scheduler
// @version     	    1.0.0
// @description         Schedule attacks and supports, optimized for maximum precision. The browser tab needs focus!
// @author              joaovperin
// @icon                https://i.imgur.com/7WgHTT8.gif
// @include             https://**.tribalwars.com.*/game.php?**&screen=place*&try=confirm
// @downloadURL         https://raw.githubusercontent.com/joaovperin/TribalWars/stable/UserScripts/AdvancedCommandScheduler.user.js
// @updateURL           https://raw.githubusercontent.com/joaovperin/TribalWars/stable/UserScripts/AdvancedCommandScheduler.user.js
// ==/UserScript==

(() => {
    'use strict';

    //****************************** Configuration ******************************//
    const defaultOffset = 30;
    const worldBackwardDelay = 50;
    const loopStartTime = 1500;
    //*************************** End Configuration ***************************//

    const CommandSender = {
        confirmButton: null,
        duration: null,
        dateNow: null,
        offset: null,
        init: function () {

            UI.InfoMessage('A ABA DEVE PERMANECER EM FOCO! CASO CONTRÁRIO, O ENVIO IRÁ FALHAR.', 3000, true);

            // Create some Html
            $($('#command-data-form').find('tbody')[0]).append(
                `<tr>
                    <td>Chegada:</td><td><input type="datetime-local" id="CStime" step=".001"></td>
                 </tr>
                 <tr>
                    <td>Delay da internet:</td>
                    <td><input type="number" id="CSoffset"><button type="button" id="CSbutton" class="btn">Confirm</button></td>
                 </tr>`
            );
            this.confirmButton = $('#troop_confirm_go');
            this.duration = $('#command-data-form').find('td:contains("Duração:")').next().text().split(':').map(Number);
            this.offset = localStorage.getItem('CS.offset') || defaultOffset;
            this.dateNow = this.convertToInput((() => {
                var d = new Date();
                d.setSeconds(d.getSeconds() + 10);
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
                // Exec asynchronous
                setTimeout(function () {
                    console.log('Starting loop at = ', new Date().toISOString());
                    ((day, hour, minute, second, millisecond) => {
                        console.log('CS.param.second = ', second);
                        console.log('CS.param.millisecond = ', millisecond);
                        var _interval = 0;
                        console.log('CS.offset = ', CommandSender.offset);
                        console.log('CS.offsetFromServer = ', Timing.offset_from_server);
                        var _nextFn = () => {
                            const realOffset = parseInt(CommandSender.offset) - worldBackwardDelay;
                            console.log('CS.realOffset = ', realOffset);
                            if (CommandSender.createServerDate(realOffset).getSeconds() >= second) {
                                console.log('CS.second = ', second, '. Waiting for command...');
                                // Calculate the real Offset
                                _nextFn = () => {
                                    const realDate = CommandSender.createServerDate(realOffset);
                                    if (realDate.getMilliseconds() >= millisecond) {
                                        // To avoid multiple threads
                                        if (CommandSender.sent === true) {
                                            return true;
                                        }
                                        CommandSender.sent = true;
                                        CommandSender.confirmButton.click();
                                        console.log('Command SENT at ', realDate.toISOString(), '.');
                                        window.clearInterval(_interval);
                                        return true;
                                    }
                                    return false;
                                };
                            }
                            return false;
                        };

                        // RUN, Barry, Run!
                        (() => {
                            console.log('LOOP STARING AT = ', new Date(Timing.getCurrentServerTime()).toISOString());
                            for (let i = 0; i < loopStartTime + 500; i++) {
                                setTimeout(() => _nextFn(), i);
                            }
                        })();
                    })(
                        /* Day, Hour, Minute, Second, ms */
                        attackTime.getDay(),
                        attackTime.getHours(),
                        attackTime.getMinutes(),
                        attackTime.getSeconds(),
                        attackTime.getMilliseconds()
                    );
                    // Delay to start the loop
                }, (attackTime - Timing.getCurrentServerTime()) - loopStartTime);
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
        createServerDate: function (delay) {
            return new Date(Timing.getCurrentServerTime() + (delay || 0));
        },
        convertToInput: function (t) {
            t.setHours(t.getHours() + this.duration[0]);
            t.setMinutes(t.getMinutes() + this.duration[1]);
            t.setSeconds(t.getSeconds() + this.duration[2]);
            const a = {
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
    // Start in a loop for faster loading
    const _temporaryLoop = setInterval(function () {
        if (document.getElementById('command-data-form') && jQuery) {
            CommandSender.init();
            clearInterval(_temporaryLoop);
        }
    }, 1);

})();