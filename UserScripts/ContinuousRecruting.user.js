// ==UserScript==
// @name                Continuous Recruiting
// @version     	    1.0.0
// @description         Auto-recruit units if there's no one on the queue
// @author              joaovperin
// @icon                https://i.imgur.com/7WgHTT8.gif
// @include             https://**.tribalwars.com.*/game.php?**&screen=train*
// @downloadURL         https://raw.githubusercontent.com/joaovperin/TribalWars/stable/UserScripts/ContinuousRecruting.user.user.js
// @updateURL           https://raw.githubusercontent.com/joaovperin/TribalWars/stable/UserScripts/ContinuousRecruting.user.user.js
// ==/UserScript==

/**
 * THIS SCRIPT WAS based on a Script from Victor Garé, but was totally remade. The credits are mine :P
 */
((unitConfig) => {
    'use strict';

    //****************************** Configuration ******************************//
    const reloadInterval = 15 * 60 * 1000;
    //*************************** End Configuration ***************************//

    const addGlobalStyle = (css) => {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        document.getElementsByTagName('head')[0].appendChild(style);
    }
    addGlobalStyle('#CS-rtable td {text-align:center;} #CS-rtable #un_qtds td {width:20px;} .CS-rcontainer {padding: 20px 0px; margin: 0;} input.CS-ri{width: 50px;}');

    const titleParent = $("#content_value > p");
    titleParent.append($(unitConfig));

    const unitData = {
        'spear': 0,
        'sword': 0,
        'axe': 3,
        'spy': 0,
        'light': 2,
        'heavy': 0,
        'ram': 0,
        'catapult': 0,
        'snob': 0
    };

    const _recruitIfPossible = () => {
        let canRecruit = false;
        Object.keys(unitData)
            .filter(e => unitData[e] > 0)
            .forEach(key => {
                // Initialize input variable
                const input = $(`input[name="${key}"]`);
                if (!input.length) {
                    return;
                }
                input.val('');
                // If there's no recruit order already on the queue
                if ($(`.unit_sprite_smaller.${key}`).length <= 0) {
                    input.val(unitData[key]);
                    // Can recruit!
                    if (input[0].style.color === 'black') {
                        canRecruit = true;
                    } else if (input[0].style.color === 'red') {
                        input.val('');
                    }
                }
            });

        if (canRecruit) {
            $(".btn-recruit").click();
        }
    };

    $(document).ready(function () {
        Object.keys(unitData).forEach(key => {
            if (unitData[key] > 0) {
                $(`#CR-u-${key}`).val(unitData[key]);
            }
        });
        // Run
        _recruitIfPossible();
    });

    // Loop to check if can recruit
    setInterval(() => location.reload(true), reloadInterval);

    // border: 3px solid #e5c27e;
    // border-radius: 22px;
    // padding: 0px 8px;
    // margin-top: 5px;

})(`<div class="CS-rcontainer"><h3>Configurar auto-recrutamento</h3>
<table id="CS-rtable" style="margin-bottom: 10px" class="vis" width="100%">
    <tbody>
        <tr>
            <th style="text-align:center">
                <a href="#" class="unit_link" data-unit="spear"><img src="https://dsen.innogamescdn.com/asset/10d39b3d/graphic/unit/unit_spear.png" title="Spear fighter" alt="Spear"></a>
            </th>
            <th style="text-align:center">
                <a href="#" class="unit_link" data-unit="sword"><img src="https://dsen.innogamescdn.com/asset/10d39b3d/graphic/unit/unit_sword.png" title="Swordsman" alt="Sword"></a>
            </th>
            <th style="text-align:center">
                <a href="#" class="unit_link" data-unit="axe"><img src="https://dsen.innogamescdn.com/asset/10d39b3d/graphic/unit/unit_axe.png" title="Axeman" alt="Axe"></a>
            </th>
            <th style="text-align:center">
                <a href="#" class="unit_link" data-unit="spy"><img src="https://dsen.innogamescdn.com/asset/10d39b3d/graphic/unit/unit_spy.png" title="Scout" alt="Scout"></a>
            </th>
            <th style="text-align:center">
                <a href="#" class="unit_link" data-unit="light"><img src="https://dsen.innogamescdn.com/asset/10d39b3d/graphic/unit/unit_light.png" title="Light cavalry" alt="Light Cavalry"></a>
            </th>
            <th style="text-align:center">
                <a href="#" class="unit_link" data-unit="heavy"><img src="https://dsen.innogamescdn.com/asset/10d39b3d/graphic/unit/unit_heavy.png" title="Heavy cavalry" alt="Heavy Cavalry"></a>
            </th>
            <th style="text-align:center">
                <a href="#" class="unit_link" data-unit="ram"><img src="https://dsen.innogamescdn.com/asset/10d39b3d/graphic/unit/unit_ram.png" title="Ram" alt="Ram"></a>
            </th>
            <th style="text-align:center">
                <a href="#" class="unit_link" data-unit="catapult"><img src="https://dsen.innogamescdn.com/asset/10d39b3d/graphic/unit/unit_catapult.png" title="Catapult" alt="Catapult"></a>
            </th>
            <th style="text-align:center">
                <a href="#" class="unit_link" data-unit="snob"><img src="https://dsen.innogamescdn.com/asset/10d39b3d/graphic/unit/unit_snob.png" title="Nobleman" alt="Nobleman"></a>
            </th>
        </tr>
        <tr id="un_qtds">
            <td class="unit-item unit-item-spear hidden"><input maxlenght="5" class="CS-ri recruit_unit" type="number" id="CR-u-spear"></td>
            <td class="unit-item unit-item-sword hidden"><input maxlenght="5" class="CS-ri recruit_unit" type="number" id="CR-u-sword"></td>
            <td class="unit-item unit-item-axe hidden"><input maxlenght="5" class="CS-ri recruit_unit" type="number" id="CR-u-axe"></td>
            <td class="unit-item unit-item-spy hidden"><input maxlenght="5" class="CS-ri recruit_unit" type="number" id="CR-u-spy"></td>
            <td class="unit-item unit-item-light hidden"><input maxlenght="5" class="CS-ri recruit_unit" type="number" id="CR-u-light"></td>
            <td class="unit-item unit-item-heavy hidden"><input maxlenght="5" class="CS-ri recruit_unit" type="number" id="CR-u-heavy"></td>
            <td class="unit-item unit-item-ram hidden"><input maxlenght="5" class="CS-ri recruit_unit" type="number" id="CR-u-ram"></td>
            <td class="unit-item unit-item-catapult hidden"><input maxlenght="5" class="CS-ri recruit_unit" type="number" id="CR-u-catapult"></td>
            <td class="unit-item unit-item-snob hidden"><input maxlenght="5" class="CS-ri recruit_unit" type="number" id="CR-u-snob"></td>
        </tr>
    </tbody>
</table></div>`);