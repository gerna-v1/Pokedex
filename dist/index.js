const enterRegion = (region) => {
    let currentRegion = regionalPokedex(region);
    let url=`./dist/pokedex.html?offset=${currentRegion.start}&limit=${currentRegion.end}`;

    window.location.href = url;
};

const returnToHomepage = (dotAmount) => {
    let dots = '';
    for (let i = 0; i < dotAmount.length; i++) {
        dots += '.'
    }
    window.location.href = `${dots}/index.html`;
}

const regionalPokedex = (region) => {
    
    let limits = {'start': 0, 'end': 0};

    switch(region) {

        case 'kanto': limits.start = 0; limits.end = 152; break;
        case 'johto': limits.start = 151; limits.end = 252; break;
        case 'hoenn': limits.start = 251; limits.end = 387; break;
        case 'sinnoh': limits.start = 386; limits.end = 494; break;
        case 'unova': limits.start = 494; limits.end = 650; break;
        case 'kalos': limits.start = 649; limits.end = 722; break;
        case 'alola': limits.start = 721; limits.end = 809; break;
        case 'galar': limits.start = 809; limits.end = 897; break;
        case 'paldea': limits.start = 905; limits.end = 1026; break;
        case 'extra': limits.start = 1026; limits.end = 1303; break;
        default: limits.start = 0; limits.end = 1026; break;
    }

    return limits;
}