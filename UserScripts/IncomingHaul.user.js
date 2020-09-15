// ==UserScript==
// @name                Incoming Haul
// @version     	    1.0.1
// @description         Shows the total incoming haul (support and attack) in the village overview screen
// @author              joaovperin
// @icon                https://i.imgur.com/7WgHTT8.gif
// @include             https://**.tribalwars.com.*/game.php?**&screen=overview*
// @downloadURL         https://raw.githubusercontent.com/joaovperin/TribalWars/master/UserScripts/IncomingHaul.user.js
// @updateURL           https://raw.githubusercontent.com/joaovperin/TribalWars/master/UserScripts/IncomingHaul.user.js
// ==/UserScript==

(() => {
    'use strict';

    //****************************** Configuration ******************************//
    const showHaulCapacity = true;
    //*************************** End Configuration ***************************//

    const containerTrs = $('#commands_outgoings table tbody > tr');

    // Append title to the header
    const tHeader = containerTrs.eq(0);
    tHeader.find('th')[0].width = '37%'
    tHeader.append($('<th width="15%">Saque</th>'));

    // Loading...
    $('div#show_outgoing_units').prepend($('<div style="height:30px;"><strong style="font-size: 20px;">TOTAL: </strong><span id="haul-message">Processando...</span></div>'));

    containerTrs.slice(1).each((i, e) => {
        $(e).append(
            $(`<td class="haul-item-container">
                <span class="haul-item-wood"></span><span class="icon header wood" title="Madeira"></span><br/>
                <span class="haul-item-stone"></span><span class="icon header stone" title="Argila"></span><br/>
                <span class="haul-item-iron"></span><span class="icon header iron" title="Ferro"></span><br/>
            </td>`));
    });

    // <div class="widget_content" style="display: block;">Total: 2000 </div>
    // $('#commands_outgoings tr.command-row')

    /**
     * Represents the resources hauled in a command
     */
    class HaulData {
        constructor(wood, stone, iron) {
            this.wood = wood;
            this.stone = stone;
            this.iron = iron;
        }

        get total() {
            return this.wood + this.stone + this.iron;
        }
    }

    let returningAttacks = {}; // Store returning attacks
    let hauledResources = []; // Store hauled resources attacks

    const incCmdTable = document.querySelector(".commands-container table:nth-child(1)"); // Incoming commands table
    // Evaluate every incoming command
    for (let i = 1; i < incCmdTable.rows.length; i++) {
        const cmdElm = incCmdTable.rows[i].querySelector('[data-command-type]');
        if (cmdElm.dataset.commandType === 'return') {
            let id = cmdElm.getAttribute("data-command-id"); // Get command ID
            returningAttacks[id] = incCmdTable.rows[i];
        } else {
            // ignore unnused commands
            continue;
        }
    }

    const _processLoadedCommands = (cmdCounter, timeout) => {
        const commandIds = Object.keys(returningAttacks);
        commandIds.forEach(elmId => {
            const elm = returningAttacks[elmId];
            timeout += Math.random() * 120 + 800;
            // Get request for command details and extract amount of troops
            setTimeout(function () {
                // https://br103.tribalwars.com.br/game.php?village=750&screen=info_command&ajax=details&id=2094727868
                $.get(window.location.origin + "/game.php?village=" + game_data.village.id + "&screen=info_command&ajax=details&id=" + elmId, function (response) {
                    let responseHaul = response.booty;
                    cmdCounter++;
                    // Loading bar
                    console.log('Processing ', cmdCounter, ' de ', commandIds.length, ' comandos');
                    $('#haul-message').html('Processando ' + cmdCounter + ' de ' + commandIds.length + ' comandos...');
                    let haulData = new HaulData(0, 0, 0);
                    // Spies do not have have any haul
                    if (responseHaul) {
                        Object.keys(haulData).forEach((key) => {
                            haulData[key] = parseInt(responseHaul[key]);
                            elm.getElementsByClassName("haul-item-" + key)[0].innerText = haulData[key]
                        });
                    }
                    hauledResources.push(haulData);

                    // If all incoming commands have been processed, write the results to the table
                    if (cmdCounter == commandIds.length) {
                        console.log('Done! Total: ');
                        let totalHaul = new HaulData(0, 0, 0);
                        hauledResources.forEach(data => {
                            Object.keys(totalHaul).forEach(key => {
                                totalHaul[key] += data[key];
                            });
                        })
                        // Write to the screen
                        $('#haul-message').html($(`<span>
                            <span class="haul-item-wood">${totalHaul.wood}</span> <span class="icon header wood" title="Madeira"></span>
                            <span class="haul-item-stone">${totalHaul.stone}</span> <span class="icon header stone" title="Argila"></span>
                            <span class="haul-item-iron">${totalHaul.iron}</span> <span class="icon header iron" title="Ferro"></span>
                        </span>`));
                    }
                });
            }, timeout);
        });
        // Initial data
    };

    $(() => {
        _processLoadedCommands(0, 0);
    });

})();