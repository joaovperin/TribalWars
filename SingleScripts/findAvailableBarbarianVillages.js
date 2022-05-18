await(async (_DEBUG) => {
    const serverUrl = window.location.href.match('(https://.+tribalwars.+)/game.php')[0];
    const centerVillage = TribalWars.getGameData().village.id;
    const allVillages = Object.values(TWMap.villages).filter(e => e.owner === '0').map(e => e.id);

    const villages = {};

    for (let targetVillage of allVillages) {
        const reqUrl = `${serverUrl}?village=${centerVillage}&screen=map&ajax=map_info&source=${centerVillage}&target=${targetVillage}&`;
        const body = await (await fetch(reqUrl)).json();
        if (_DEBUG) {
            console.debug('**** ', reqUrl, ' -> ', body);
        }
        if (!body.reservation) {
            villages[body.id] = body;
        }
    }

    return villages;
})(false);