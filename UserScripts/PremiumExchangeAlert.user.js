// ==UserScript==
// @name                Premium Exchange - Alert Resources
// @version     	    1.0.4
// @description         Alerts you everytime the premimum market has something interesting
// @author              joaovperin
// @icon                https://i.imgur.com/7WgHTT8.gif
// @include             https://**.tribalwars.com.*/game.php?**&screen=market*&mode=exchange*
// @downloadURL         https://raw.githubusercontent.com/joaovperin/TribalWars/master/UserScripts/PremiumExchangeAlert.user.js
// @updateURL           https://raw.githubusercontent.com/joaovperin/TribalWars/master/UserScripts/PremiumExchangeAlert.user.js
// ==/UserScript==


/**
 * THIS SCRIPT WAS FORKED FROM FunnyPocketBook. All credits to him!
 */
(async (ModuleLoader, notificationConfig) => {
    'use strict';

    //****************************** Configuration ******************************//
    const checkInterval = 150;
    const showVariation = true;
    const showCurrent = false;
    //*************************** End Configuration ***************************//

    // Dependency loading
    await ModuleLoader.loadModule('utils/notify-utils');

    // Controls the window title
    TwFramework.setIdleTitlePreffix('PREMIUM_ALERT', document.title);

    const addGlobalStyle = (css) => {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        document.getElementsByTagName('head')[0].appendChild(style);
    }
    addGlobalStyle('#PEA-rtable td {text-align:center;} #PEA-rtable .PEA-tr-ct {width:20px;} .PEA-ri-max{color:green;} .PEA-ri-min{color:red;} .PEA-container {padding: 20px 0px; margin: 0;} input.PEA-ri{width: 50px;}');

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

    const alertData = {
        'max-wood': {
            value: 1000
        },
        'min-wood': {
            value: 500
        },
        'max-stone': {
            value: 1000
        },
        'min-stone': {
            value: 500
        },
        'max-iron': {
            value: 1000
        },
        'min-iron': {
            value: 500
        },
        'play-sound': {
            checked: true
        },
        'show-alert': {
            checked: true
        },
    };

    // Load entries or default from localStorage
    const _loadValues = () => {
        Object.keys(alertData).forEach(key => {
            const elmId = `PEA-c-${key}`;
            const localStorageKey = `TwFramework.PEA.${key}`;
            const fromLocalStrg = JSON.parse(localStorage.getItem(localStorageKey));
            if (fromLocalStrg) {
                alertData[key] = fromLocalStrg;
            }
            // Write on the screen
            $(`#${elmId}`).val(alertData[key].value > 0 ? alertData[key].value : '')
                .attr("checked", alertData[key].checked);
        });
    };

    // Load entries on the localStorage
    const _saveValues = () => {
        Object.keys(alertData).forEach(key => {
            const localStorageKey = `TwFramework.PEA.${key}`;
            localStorage.setItem(localStorageKey, JSON.stringify(alertData[key]));
        });
    }

    const _checkResourcesThread = setInterval(() => {
        let woodCurrent = parseInt(document.getElementById("premium_exchange_stock_wood").textContent);
        let stoneCurrent = parseInt(document.getElementById("premium_exchange_stock_stone").textContent);
        let ironCurrent = parseInt(document.getElementById("premium_exchange_stock_iron").textContent);

        let woodTax = parseInt(/.*?(\d+).*/g.exec($('#premium_exchange_rate_wood div').text())[1]);
        let stoneTax = parseInt(/.*?(\d+).*/g.exec($('#premium_exchange_rate_stone div').text())[1]);
        let ironTax = parseInt(/.*?(\d+).*/g.exec($('#premium_exchange_rate_iron div').text())[1]);

        // If resources prices have changed
        if (woodCurrent != woodOld || stoneCurrent != stoneOld || ironCurrent != ironOld) {

            let targeAchieved = [];
            if (alertData['max-wood'].value && woodTax >= alertData['max-wood'].value) targeAchieved.push('max-wood');
            if (alertData['min-wood'].value && woodTax <= alertData['min-wood'].value) targeAchieved.push('min-wood');
            if (alertData['max-stone'].value && stoneTax >= alertData['max-stone'].value) targeAchieved.push('max-stone');
            if (alertData['max-stone'].value && stoneTax <= alertData['min-stone'].value) targeAchieved.push('min-stone');
            if (alertData['max-iron'].value && ironTax >= alertData['max-iron'].value) targeAchieved.push('max-iron');
            if (alertData['max-iron'].value && ironTax <= alertData['min-iron'].value) targeAchieved.push('min-iron');

            console.debug(alertData);
            console.debug({
                woodTax: woodTax,
                stoneTax: stoneTax,
                ironTax: ironTax
            });

            if (!targeAchieved.length) {
                return;
            }

            if (alertData['play-sound'].checked) {
                TribalWars.playSound("chicken");
            }
            const alertMessage = `Os recursos à venda no mercado atingiram os limites configurados. Corra! Limites: ${targeAchieved.join(', ')}`;
            if (alertData['show-alert'].checked) {
                UI.Notification.show("https://dsbr.innogamescdn.com/asset/c092731a/graphic/resources/premium.png", 'Atenção!',
                    alertMessage
                );
            }
            console.log(alertMessage);

            const preffix = '~> ' + fmtDate();
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

    // Redraw if needed
    setInterval(() => {
        if (!$('#PEA-rtable').length) {
            $('#market_status_bar').append($(notificationConfig));
            _loadValues();
            // Updates value on memory
            Object.keys(alertData).forEach(key => {
                $(`#PEA-c-${key}`).change(evt => {
                    const elm = document.getElementById(evt.target.id)
                    const checked = elm.checked;
                    if (elm.value) {
                        alertData[key] = {
                            value: evt.target.value
                        };
                    } else {
                        alertData[key] = {
                            checked
                        };
                    }
                })
            });

            // Saves on the localStorage
            $('#PEA-save-btn').click(() => {
                _saveValues();
                UI.Notification.show("https://th.bing.com/th/id/OIP.5R-ae5VM-10Ijm1Dxd7QdAHaHY?pid=Api&rs=1", 'Done!', 'Settings saved successfully!');
            });
            setTimeout(() => _loadValues(), 300);
        }
    }, 30);

    return _checkResourcesThread;

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
}, `<div class="PEA-container"><h3>Configurar notificações</h3>
<table id="PEA-rtable" style="margin-bottom: 10px" class="vis" width="100%">
    <tbody>
        <tr>
            <th style="text-align:center"></th>
            <th style="text-align:center">
                <img src="https://dsbr.innogamescdn.com/asset/c092731a/graphic/resources/wood_21x18.png" title="Madeira" alt="" class="">Madeira
            </th>
            <th style="text-align:center">
                <img src="https://dsbr.innogamescdn.com/asset/c092731a/graphic/resources/stone_21x18.png" title="Argila" alt="" class="">Argila
            </th>
            <th style="text-align:center">
                <img src="https://dsbr.innogamescdn.com/asset/c092731a/graphic/resources/iron_21x18.png" title="Ferro" alt="" class="">Ferro
            </th>
        </tr>
        <tr class="PEA-tr-ct">
            <th>MAX</th>
            <td><input maxlenght="4" class="PEA-ri PEA-ri-max" type="number" id="PEA-c-max-wood"></td>
            <td><input maxlenght="4" class="PEA-ri PEA-ri-max" type="number" id="PEA-c-max-stone"></td>
            <td><input maxlenght="4" class="PEA-ri PEA-ri-max" type="number" id="PEA-c-max-iron"></td>
            </tr>
            <tr class="PEA-tr-ct">
            <th>MIN</th>
            <td><input maxlenght="4" class="PEA-ri PEA-ri-min" type="number" id="PEA-c-min-wood"></td>
            <td><input maxlenght="4" class="PEA-ri PEA-ri-min" type="number" id="PEA-c-min-stone"></td>
            <td><input maxlenght="4" class="PEA-ri PEA-ri-min" type="number" id="PEA-c-min-iron"></td>
        </tr>
        <tr class="PEA-tr-ct">
            <th>Play Sound</th>
            <td><input class="PEA-rc" type="checkbox" id="PEA-c-play-sound"></td>
        </tr>
        <tr class="PEA-tr-ct">
            <th>Show Alert</th>
            <td><input class="PEA-rc" type="checkbox" id="PEA-c-show-alert"></td>
        </tr>
    </tbody>
</table>
<button id='PEA-save-btn' class='btn'>Save</button><span id='PEA-save-btntxt'></span>
</div>`);