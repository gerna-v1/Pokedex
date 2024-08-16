const enterRegion = (region) => {
    console.log("Entering " + region + " region");
    let main = document.querySelector('#container');

    main.innerHTML = '';

    main.innerHTML = `<p> ${JSON.stringify(regionalPokedex(region))} lol  </p>`;
};

const regionalPokedex = (region) => {
    
    let limits = {'start': 0, 'end': 0};

    switch(region) {

        case 'kanto': limits.start = 1; limits.end = 151; break;
        case 'johto': limits.start = 152; limits.end = 251; break;
        case 'hoenn': limits.start = 252; limits.end = 386; break;
        case 'sinnoh': limits.start = 387; limits.end = 493; break;
        case 'unova': limits.start = 494; limits.end = 649; break;
        case 'kalos': limits.start = 650; limits.end = 721; break;
        case 'alola': limits.start = 722; limits.end = 809; break;
        case 'galar': limits.start = 810; limits.end = 898; break;
        default: limits.start = 1; limits.end = 1027; break;
    }

    return limits;
}