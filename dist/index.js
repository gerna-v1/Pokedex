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
        case 'hisui': limits.start = 0; limits.end = 0; break;
        case 'extra': limits.start = 1026; limits.end = 1303; break;
        default: limits.start = 0; limits.end = 1026; break;
    }

    return limits;
}

const facts = {
    "kanto":{
        "spanish": [
            "El nombre de 'Kanto',proviene de la región Kanto que que se encuentra en Japón real, la cual incluye Tokio y prefecturas circundantes.",
            "La torre de Pueblo Lavanda se basa en Ushiku Daibutsu, estatua de Buda que se ubica en la prefectura de Ibaraki, Japón.",
            "Kanto es la región que ha aparecido en más videojuegos y generaciones hasta la fecha.",
            "Kanto es considerada la región con menos población de todas."
        ],
        "ingles": [
            "The name 'Kanto' comes from the real-world Japan, which includes Tokyo and the surrounding prefectures.",
            "The Pokémon Tower in Lavander Town is based on the real-life Ushiku Daibatsu, a Buddha statue in Ibaraki, Japan.",
            "Kanto has appeared in more Pokémon video games and generations than any other region.",
            "Kanto has the smallest population of all the regions."

        ]
    },
    "johto":{
        "spanish": [
            "Johto y Kanto son las únicas regiones que se muestran conectadas entre sí.",
            "Johto al igual que Kanto, se basa en una ubicación real en Japón, siendo esta la región de Kansai.",
            "Johto fue la primera región en introducir áreas que permiten plantar bayas.",
            "Todas las ciudades de Johto basan su nombre en plantas y en colores."
        ],
        "ingles": [
            "Johto and Kanto are the only regions shown to be connected to another.",
            "The Johto region is based on a real-world region of Japan, the Kansai region.",
            "Johto was the first region to introduce areas to plant berries.",
            "All the cities in Johto are named after plants in addition to colors."

        ]
    },
    "hoenn":{
        "spanish": [
            "Esta región se basa en la isla de Kyushu, ubicada en Japón.",
            "En Hoenn, se encuentran escenarios los cuales no se habían presentado en anteriores entregas; se incluyen entre ellos, un desierto, playas, la jungla y un volcán."
        ]
    },
    "sinnoh":{
        "facts": [
            ""
        ]
    },
    "unova":{
        "facts": [
            ""
        ]
    },
    "kalos":{
        "facts": [
            ""
        ]
    },
    "alola":{
        "facts": [
            ""
        ]
    },
    "hisui":{
        "facts": [
            ""
        ]
    },
    "galar":{
        "facts": [
            ""
        ]
    },
    "paldea":{
        "facts": [
            ""
        ]
    }
}

const playCry = async (url) => {
    try {
        const audio = new Audio(url);
        await audio.play();
        console.log('Playing sound');
        let sprite2 = document.querySelector('.sprite');
        sprite2.classList.toggle('rotate');
    } catch (error) {
        console.error(error);
    }
}