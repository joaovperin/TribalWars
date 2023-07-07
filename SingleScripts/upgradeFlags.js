((flag_selector, times) => {
    const elmRef = $(`${flag_selector} .flag_upgrade`);

    let counter = times;
    let interval = setInterval(function () {
        if (counter-- && elmRef.length) {
            elmRef.click();
        } else {
            clearInterval(interval);
            console.log('Done!');
            if (counter > 0 && elmRef.length > 0) {
                console.log(`Stopped with ${counter} left because no more flags were found.`);
            }
        }
    }, 100);

    // .....................................
    // #flag_box_1_1 =  Resources   Level 1
    // #flag_box_1_2 =  Resources   Level 2
    // #flag_box_2_1 =  Recruiting  Level 1
    // #flag_box_2_2 =  Recruiting  Level 2
    // .....................................
})('#flag_box_1_1', 25);
