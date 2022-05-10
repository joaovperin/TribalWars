// ==UserScript==
// @name                Farming
// @version     	    1.0.5
// @description         Farm automaically for resources
// @author              joaovperin
// @icon                https://i.imgur.com/7WgHTT8.gif
// @include             https://**.tribalwars.*/game.php?**&screen=am_farm*
// @downloadURL         https://raw.githubusercontent.com/joaovperin/TribalWars/master/UserScripts/Farming.user.js
// @updateURL           https://raw.githubusercontent.com/joaovperin/TribalWars/master/UserScripts/Farming.user.js
// ==/UserScript==

/**
 * THIS SCRIPT WAS FORKED FROM TavinhuTurbinator!! Turbinando TW. All credits to him!
 */
(async (ModuleLoader) => {
    'use strict';

    // Dependency loading
    await ModuleLoader.loadModule('utils/notify-utils');

    // Controls the window title
    TwFramework.setIdleTitlePreffix('FARMING', document.title);

    // Create global variables
    let maxDistanceA = localStorage.maxDistanceA; // Maximum farm distance for button A
    let maxDistanceB = localStorage.maxDistanceB; // Maximum farm distance for button B
    let maxDistanceC = localStorage.maxDistanceC; // Maximum farm distance for button C
    let maxDistance = maxDistanceA;
    let switchSpeed;
    let speed; // Time between attacks in ms, default 350ms
    let butABoo; // Choose button A
    let butBBoo; // Choose button B
    let stop; // Start/stop the bot
    let removeUnitsFrom; // Subtract amount of units from farmA or farmB
    let x = 0;
    let farmButton; // Which button to send
    const am = game_data.features.AccountManager.active; // Is account manager active? If so, the page structure changes
    let tableNr = 4; // Change child number to select units
    if (am) {
        tableNr = 6; // If AM is active, that number is 6
    }


    // Define start variables
    if (localStorage.speed !== undefined) {
        speed = localStorage.speed;
    } else {
        speed = 350;
        localStorage.speed = speed;
    }
    if (localStorage.switchSpeed !== undefined) {
        switchSpeed = localStorage.switchSpeed;
    } else {
        switchSpeed = 0;
        localStorage.switchSpeed = switchSpeed;
    }
    if (localStorage.stop !== undefined) {
        stop = !!localStorage.stop;
    } else {
        stop = true;
        localStorage.stop = stop;
    }
    // Create input fields and stuff
    const distanceInputDiv = document.createElement("div");
    // Max distance
    const letters = ["Maximum Farm Distance A ", "Maximum Farm Distance B ", "Maximum Farm Distance C "];
    const distanceInput = ["<input id='distInputA' value=" + maxDistanceA + " style='width:30px'>",
        "<input id='distInputB' value=" + maxDistanceB + " style='width:30px'>",
        "<input id='distInputC' value=" + maxDistanceC + " style='width:30px'>"
    ];
    const buttons = ["<button id = 'buttonDistA' class = 'btn'>OK</button><span id='textA'></span>",
        "<button id = 'buttonDistB' class = 'btn'>OK</button><span id='textB'></span>",
        "<button id = 'buttonDistC' class = 'btn'>OK</button><span id='textC'></span>"
    ];
    for (let i = 0; i < 3; i++) {
        distanceInputDiv.innerHTML += "<p id=" + i + ">" + letters[i] + distanceInput[i] + buttons[i] + "</p>";
    }

    // Refresh page
    distanceInputDiv.innerHTML += "<p>Refresh page/Switch village in seconds " +
        "<input id='switchSpeed' value=" + switchSpeed + " style='width:50px'>" +
        "<button id = 'switchSpeedOk' class = 'btn'>OK</button><span id='textSwitch'></span></p>" +
        "<p>Difference in ms between attacks " +
        "<input id='speed' value='" + speed + "' style='width:30px'>" +
        "<button id='speedOk' class='btn'>OK</button><span id='textSpeed'></span> </p>" +
        "<p><button id='start-stop' class='btn'></button></p>";

    const putAfter = document.querySelector("#content_value > h3");
    putAfter.parentNode.insertBefore(distanceInputDiv, putAfter.nextSibling);

    document.getElementById("distInputA").addEventListener("keydown", clickOnKeyPress.bind(this, 13, "#buttonDistA"));
    document.getElementById("distInputB").addEventListener("keydown", clickOnKeyPress.bind(this, 13, "#buttonDistB"));
    document.getElementById("distInputC").addEventListener("keydown", clickOnKeyPress.bind(this, 13, "#buttonDistC"));
    document.getElementById("switchSpeed").addEventListener("keydown", clickOnKeyPress.bind(this, 13, "#switchSpeedOk"));
    document.getElementById("speed").addEventListener("keydown", clickOnKeyPress.bind(this, 13, "#speedOk"));

    // Save the values from your farm button A and B and the units in the village. It's ugly, but it works.
    // I made it like this so the page reloads/village switches as soon as not enough units are in the village anymore.
    let farmA = {
        spear: parseInt(document.querySelector('#content_value > div:nth-child(' + tableNr + ') > div > form:nth-child(1) > table > tbody > ' +
            'tr:nth-child(2) > td > input[name="spear"]').value),
        sword: parseInt(document.querySelector('#content_value > div:nth-child(' + tableNr + ') > div > form:nth-child(1) > table > tbody > ' +
            'tr:nth-child(2) > td > input[name="sword"]').value),
        axe: parseInt(document.querySelector('#content_value > div:nth-child(' + tableNr + ') > div > form:nth-child(1) > table > tbody > ' +
            'tr:nth-child(2) > td > input[name="axe"]').value),
        spy: parseInt(document.querySelector('#content_value > div:nth-child(' + tableNr + ') > div > form:nth-child(1) > table > tbody > ' +
            'tr:nth-child(2) > td > input[name="spy"]').value),
        light: parseInt(document.querySelector('#content_value > div:nth-child(' + tableNr + ') > div > form:nth-child(1) > table > tbody > ' +
            'tr:nth-child(2) > td > input[name="light"]').value),
        heavy: parseInt(document.querySelector('#content_value > div:nth-child(' + tableNr + ') > div > form:nth-child(1) > table > tbody > ' +
            'tr:nth-child(2) > td > input[name="heavy"]').value)
    };

    let farmB = {
        spear: parseInt(document.querySelector('#content_value > div:nth-child(' + tableNr + ') > div > form:nth-child(2) > table > tbody > ' +
            'tr:nth-child(2) > td > input[name="spear"]').value),
        sword: parseInt(document.querySelector('#content_value > div:nth-child(' + tableNr + ') > div > form:nth-child(2) > table > tbody > ' +
            'tr:nth-child(2) > td > input[name="sword"]').value),
        axe: parseInt(document.querySelector('#content_value > div:nth-child(' + tableNr + ') > div > form:nth-child(2) > table > tbody > ' +
            'tr:nth-child(2) > td > input[name="axe"]').value),
        spy: parseInt(document.querySelector('#content_value > div:nth-child(' + tableNr + ') > div > form:nth-child(2) > table > tbody > ' +
            'tr:nth-child(2) > td > input[name="spy"]').value),
        light: parseInt(document.querySelector('#content_value > div:nth-child(' + tableNr + ') > div > form:nth-child(2) > table > tbody > ' +
            'tr:nth-child(2) > td > input[name="light"]').value),
        heavy: parseInt(document.querySelector('#content_value > div:nth-child(' + tableNr + ') > div > form:nth-child(2) > table > tbody > ' +
            'tr:nth-child(2) > td > input[name="heavy"]').value)
    };

    let unitInVill = {
        spear: parseInt(document.getElementById("spear").innerText),
        sword: parseInt(document.getElementById("sword").innerText),
        axe: parseInt(document.getElementById("axe").innerText),
        spy: parseInt(document.getElementById("spy").innerText),
        light: parseInt(document.getElementById("light").innerText),
        heavy: parseInt(document.getElementById("heavy").innerText)
    };

    try {
        farmA.archer = parseInt(document.querySelector('#content_value > div:nth-child(' + tableNr + ') > div > form:nth-child(1) > table > tbody > ' +
            'tr:nth-child(2) > td > input[name="archer"]').value);
        farmA.marcher = parseInt(document.querySelector('#content_value > div:nth-child(' + tableNr + ') > div > form:nth-child(1) > table > tbody > ' +
            'tr:nth-child(2) > td > input[name="marcher"]').value);
        farmB.archer = parseInt(document.querySelector('#content_value > div:nth-child(' + tableNr + ') > div > form:nth-child(2) > table > tbody > ' +
            'tr:nth-child(2) > td > input[name="archer"]').value);
        farmB.marcher = parseInt(document.querySelector('#content_value > div:nth-child(' + tableNr + ') > div > form:nth-child(2) > table > tbody > ' +
            'tr:nth-child(2) > td > input[name="marcher"]').value);

        unitInVill.archer = parseInt(document.getElementById("archer").innerText);
        unitInVill.marcher = parseInt(document.getElementById("marcher").innerText);

    } catch (e) {}

    try {
        farmB.knight = parseInt(document.querySelector('#content_value > div:nth-child(' + tableNr + ') > div > form:nth-child(2) > table > tbody > ' +
            'tr:nth-child(2) > td > input[name="knight"]').value);
        farmA.knight = parseInt(document.querySelector('#content_value > div:nth-child(' + tableNr + ') > div > form:nth-child(1) > table > tbody > ' +
            'tr:nth-child(2) > td > input[name="knight"]').value);
        unitInVill.knight = parseInt(document.getElementById("knight").innerText);
    } catch (e) {}

    checkUnits();

    if (!stop) {
        document.getElementById("start-stop").innerText = "Stop";
        startFarming();
    } else {
        document.getElementById("start-stop").innerText = "Start";
    }

    // The actual script to launch the attacks.
    function startFarming() {
        let distance = 0; // Instantiate distance. It will record the distance from the village to the first barbarian
        // village in the farm assistant.
        const entries = parseInt(document.querySelector("#plunder_list > tbody").rows.length) - 2;
        for (let i = 0; i < entries; i++) {
            try {
                distance = parseFloat(document.querySelector("#plunder_list > tbody > tr:nth-child(" + (i + 3) + ") > " +
                    "td:nth-child(8)").innerText); // Get the distance to the barb villa
            } catch (e) {}
            if (distance <= maxDistance) { // It will only launch the attacks that are within maxDistance fields
                $(farmButton).eq(i).each(function () {
                    if (!($(this).parent().parent().find('img.tooltip').length)) {
                        try {
                            removeUnits(removeUnitsFrom);
                        } catch (e) {}
                        let speedNow = (speed * ++x) - random(250, 400);
                        setTimeout(function (myVar) {
                            if (!stop) {
                                $(myVar).click();
                                console.log("Sent");
                            }
                            if (document.querySelectorAll(".error").length) {
                                reload();
                            }
                        }, speedNow, this);
                    }
                })
            }
        }
    }

    function random(maximum, minimum) {
        let numPossibilities = maximum - minimum
        let aleat = Math.random() * numPossibilities
        return Math.round(parseInt(minimum) + aleat)
    }

    // If any any of the units in the village that are present are fewer than button A requires, butABoo will be set to
    // false, meaning there aren't enough units in the village to send an attack with button A
    function checkUnits() {
        if (unitInVill.spear < farmA.spear || unitInVill.sword < farmA.sword || unitInVill.axe < farmA.axe ||
            unitInVill.spy < farmA.spy || unitInVill.light < farmA.light || unitInVill.heavy < farmA.heavy) {
            butABoo = false;
        } else {
            if (unitInVill.archer < farmA.archer || unitInVill.marcher < farmA.marcher || unitInVill.knight < farmA.knight) {
                butABoo = false;
            } else {
                butABoo = true;
            }
        }
        // If any any of the units in the village that are present are fewer than button B requires, butABoo will be set to
        // false, meaning there aren't enough units in the village to send an attack with button B
        if (unitInVill.spear < farmB.spear || unitInVill.sword < farmB.sword || unitInVill.axe < farmB.axe ||
            unitInVill.spy < farmB.spy || unitInVill.light < farmB.light || unitInVill.heavy < farmB.heavy) {
            butBBoo = false;
        } else {
            if (unitInVill.archer < farmB.archer || unitInVill.marcher < farmB.marcher || unitInVill.knight < farmB.knight) {
                butBBoo = false;
            } else {
                butBBoo = true;
            }
        }

        if (butABoo && $('#am_widget_Farm a.farm_icon_a').length > 0 && parseInt(maxDistanceA) !== 0) {
            farmButton = $('#am_widget_Farm a.farm_icon_a'); // Choose button A to farm with
            maxDistance = maxDistanceA;
            removeUnitsFrom = farmA;
        } else if (butBBoo && $('#am_widget_Farm a.farm_icon_b').length > 0 && parseInt(maxDistanceB) !== 0) {
            farmButton = $('#am_widget_Farm a.farm_icon_b'); // Choose button B to farm with
            maxDistance = maxDistanceB;
            removeUnitsFrom = farmB;
        } else {
            farmButton = $('#am_widget_Farm a.farm_icon_c'); // Choose button C to farm with
            maxDistance = maxDistanceC;
        }
    }
    // Start/stop the bot and change the button text
    $("#start-stop").click(function () {
        if (stop) {
            this.innerText = "Stop";
            stop = false;
            localStorage.stop = stop;
            checkUnits();
            startFarming();
        } else {
            this.innerText = "Start";
            stop = true;
            localStorage.stop = stop;
        }
    });

    // Subtract units in FarmA or FarmB from unitInVill and update which farm button will be used
    function removeUnits(farm) {
        unitInVill.spear -= farm.spear;
        unitInVill.sword -= farm.sword;
        unitInVill.axe -= farm.axe;
        unitInVill.archer -= farm.archer;
        unitInVill.spy -= farm.spy;
        unitInVill.light -= farm.light;
        unitInVill.marcher -= farm.marcher;
        unitInVill.heavy -= farm.heavy;
        unitInVill.knight -= farm.knight;
        checkUnits();
    }

    // Save values to localStorage on OK click
    $("#buttonDistA").click(function () {
        maxDistanceA = parseInt($("#distInputA").val());
        localStorage.maxDistanceA = JSON.stringify(maxDistanceA);
        if (parseInt(maxDistanceA) === 0) {
            document.getElementById("textA").innerHTML = "A will not be used"; // If distance was set to 0, display this text
        } else {
            document.getElementById("textA").innerHTML = "Maximum distance A set to " + maxDistanceA;
        }
        document.getElementById("distInputA").value = maxDistanceA;
        checkUnits();
    });

    $("#buttonDistB").click(function () {
        maxDistanceB = parseInt($("#distInputB").val());
        localStorage.maxDistanceB = JSON.stringify(maxDistanceB);
        if (parseInt(maxDistanceB) === 0) {
            document.getElementById("textB").innerHTML = "B will not be used"; // If distance was set to 0, display this text
        } else {
            document.getElementById("textB").innerHTML = "Maximum distance B set to " + maxDistanceB;
        }
        document.getElementById("distInputB").value = maxDistanceB;
        checkUnits();
    });

    $("#buttonDistC").click(function () {
        maxDistanceC = parseInt($("#distInputC").val());
        localStorage.maxDistanceC = JSON.stringify(maxDistanceC);
        if (parseInt(maxDistanceC) === 0) {
            document.getElementById("textC").innerHTML = "C will not be used"; // If distance was set to 0, display this text
        } else {
            document.getElementById("textC").innerHTML = "Maximum distance C set to " + maxDistanceC;
        }
        document.getElementById("distInputC").value = maxDistanceC;
        checkUnits();
    });

    $("#switchSpeedOk").click(function () {
        switchSpeed = parseInt($("#switchSpeed").val());
        localStorage.switchSpeed = JSON.stringify(switchSpeed);
        if (parseInt(switchSpeed) === 0) {
            document.getElementById("textSwitch").innerHTML = "Page won't reload and village won't switch"; // If distance was set to 0, display this text
        } else {
            document.getElementById("textSwitch").innerHTML = "Switch speed set to " + switchSpeed + " seconds";
        }
        document.getElementById("switchSpeed").value = switchSpeed;
    });

    $("#speedOk").click(function () {
        speed = parseInt($("#speed").val());
        localStorage.speed = JSON.stringify(speed);
        if (parseInt(speed) <= 200) {
            document.getElementById("textSpeed").innerHTML = "Can't set anything lower than 200ms"; // If distance was set below 200, display this text
            return;
        } else {
            document.getElementById("textSpeed").innerHTML = "Speed set to " + speed + "ms";
        }
        document.getElementById("speed").value = speed;
    });

    // Function for doing something
    function clickOnKeyPress(key, selector) {
        "use strict";
        if (event.defaultPrevented) {
            return; // Should do nothing if the default action has been cancelled
        }
        let handled = false;
        if (event.key === key || event.keyIdentifier === key || event.keyCode) {
            document.querySelector(selector).click();
            handled = true;
        }
        if (handled) {
            event.preventDefault();
        }
    }

    setTimeout(function () {
        if (parseInt(switchSpeed) !== 0 && !stop) {
            reload();
        }
    }, switchSpeed * 1000);

    function pageReload() {
        window.location.reload();
    }

    function switchVillage() {
        try {
            document.querySelector('.arrowRight').click();
        } catch (e) {
            document.querySelector('.groupRight').click();
        }
    }

    function reload() {
        try {
            switchVillage();
        } catch (e) {
            pageReload();
        }
    }

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
