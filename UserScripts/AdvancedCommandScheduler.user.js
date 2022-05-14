// ==UserScript==
// @name                Advanced Command Scheduler
// @version     	    1.0.4
// @description         Schedule attacks and supports, optimized for maximum precision. Uses browser serviceWorkers.
// @author              joaovperin
// @icon                https://i.imgur.com/7WgHTT8.gif
// @include             https://**.tribalwars.*/game.php?**&screen=place*&try=confirm*
// @downloadURL         https://raw.githubusercontent.com/joaovperin/TribalWars/master/UserScripts/AdvancedCommandScheduler.user.js
// @updateURL           https://raw.githubusercontent.com/joaovperin/TribalWars/master/UserScripts/AdvancedCommandScheduler.user.js
// ==/UserScript==

(async (ModuleLoader) => {
    'use strict';

    //****************************** Configuration ******************************//
    const defaultInternetDelay = 30;
    const worldBackwardDelay = 50;
    const loopStartTime = 1500;
    //*************************** End Configuration ***************************//

    // Dependency loading
    await ModuleLoader.loadModule('utils/notify-utils');

    // Controls the window title
    TwFramework.setIdleTitlePreffix('SENDING_COMMAND', document.title);

    const CommandSender = {
        confirmButton: null,
        duration: null,
        dateNow: null,
        internetDelay: null,
        init: function () {

            // Create some Html
            $($('#command-data-form').find('tbody')[0]).append(
                `<tr>
                    <td>Chegada:</td><td><input type="datetime-local" id="ACStime" step=".001"></td>
                 </tr>
                 <tr>
                    <td>Delay da internet:</td>
                    <td><input type="number" id="ACSInternetDelay"><button type="button" id="ACSbutton" class="btn">Confirm</button></td>
                 </tr>`
            );
            this.confirmButton = $('#troop_confirm_submit');
            this.duration = $('#command-data-form').find('td:contains("Duração:")').next().text().split(':').map(Number);
            this.internetDelay = localStorage.getItem('ACS.internetDelay') || defaultInternetDelay;
            this.dateNow = this.convertToInput((() => {
                var d = new Date();
                d.setSeconds(d.getSeconds() + 10);
                d.setMilliseconds(501);
                return d;
            })());
            $('#ACSInternetDelay').val(this.internetDelay);
            $('#ACStime').val(this.dateNow);
            $('#ACSbutton').click(function () {
                const attackTime = CommandSender.getAttackTime();
                CommandSender.internetDelay = parseInt($('#ACSInternetDelay').val());
                localStorage.setItem('ACS.internetDelay', CommandSender.internetDelay);
                CommandSender.confirmButton.addClass('btn-disabled');
                // Exec asynchronous
                setTimeout(function () {
                    console.log('Starting loop at = ', new Date().toISOString());
                    ((day, hour, minute, second, millisecond) => {
                        console.log('ACS.param.second = ', second);
                        console.log('ACS.param.millisecond = ', millisecond);
                        var _interval = 0;
                        console.log('ACS.internetDelay = ', CommandSender.internetDelay);
                        console.log('ACS.offsetFromServer = ', Timing.offset_from_server);
                        var _nextFn = () => {
                            const realOffset = parseInt(CommandSender.internetDelay) - worldBackwardDelay;
                            console.log('ACS.realOffset = ', realOffset);
                            if (CommandSender.createServerDate(realOffset).getSeconds() >= second) {
                                console.log('ACS.second = ', second, '. Waiting for command...');
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
                            const blob = new Blob([`
                                setInterval(() => postMessage(''));
                            `]);
                            const worker = new Worker(window.URL.createObjectURL(blob));
                            let _is_Done = false;
                            worker.onmessage = function () {
                                if (_is_Done) {
                                    UI.Notification.show("https://dsbr.innogamescdn.com/asset/c092731a/graphic/unit/recruit/axe.png", 'Parabéns!', 'Seu comando foi enviado com sucesso!');
                                    return worker.terminate();
                                }
                                _is_Done = _nextFn();
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
            var d = new Date($('#ACStime').val().replace('T', ' '));
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

    CommandSender.addGlobalStyle('#ACStime, #ACSInternetDelay {font-size: 9pt;font-family: Verdana,Arial;}#ACSbutton {float:right;}');
    // Start in a loop for faster loading
    const _temporaryLoop = setInterval(function () {
        if (document.getElementById('command-data-form') && jQuery) {
            CommandSender.init();
            clearInterval(_temporaryLoop);
        }
    }, 1);

})({
    // ModuleLoader functions
    loadModule: moduleName => {
        return new Promise((resolve, reject) => {
            const modulePath = moduleName.replace('.', '/');
            const moduleUrl = `https://raw.githubusercontent.com/joaovperin/TribalWars/master/Modules/${modulePath}.js`;
            console.debug('[TwScripts] Loading ', modulePath, ' from URL ', moduleUrl, '...');
            return $.ajax({
                    method: "GET",
                    url: moduleUrl,
                    dataType: "text"
                }).done(res => resolve(eval(res)))
                .fail(req => reject(console.error("[TwScripts] Fail loading module '", moduleName, "'.")));
        })
    }
});
