const enterRegion = (region) => {
    let currentRegion = regionalPokedex(region);
    let url=`./dist/pokedex.html?offset=${currentRegion.start}&limit=${currentRegion.end}`;
    setRecentRegion(region);
    window.location.href = url;
};

const returnToHomepage = (dotAmount) => {
    let dots = '';
    for (let i = 0; i < dotAmount.length; i++) {
        dots += '.'
    }
    window.location.href = `${dots}/index.html`;
}

var recentRegion = localStorage.getItem('recentRegion');

const setRecentRegion = (region) => {
    recentRegion = region;
    localStorage.setItem('recentRegion', region);
};

const getRecentRegion = () => {
    if (!recentRegion) {
        recentRegion = localStorage.getItem('recentRegion');
    }
    return recentRegion;
};


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
        case 'hisui': limits.start = 999; limits.end = 999; break;
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
        "english": [
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
        "english": [
            "Johto and Kanto are the only regions shown to be connected to another.",
            "The Johto region is based on a real-world region of Japan, the Kansai region.",
            "Johto was the first region to introduce areas to plant berries.",
            "All the cities in Johto are named after plants in addition to colors."

        ]
    },
    "hoenn":{
        "spanish": [
            "Esta región se basa en la isla de Kyushu, ubicada en Japón.",
            "En Hoenn se encuentran escenarios los cuales no se habían presentado en anteriores entregas; se incluyen entre ellos, un desierto, playas, la jungla y un volcán.",
            "Hoenn es la primera región en implementar las batallas dobles pokémon.",
            "Hoenn fue mencionada en el anime antes de que los juegos de la tercera generación salieran."
        ],
        "english": [
            "Hoenn is inspired by real-world Kyushu.",
            "In Hoenn there are environments introduced that aren't present in previous games; these environments include a desert, beaches, a jungles and a volcano.",
            "Hoenn is the first region to implement double pokémon battles.",
            "Hoenn was mentiones in the anime, before the third generation games came out."

        ]
    },
    "sinnoh":{
        "spanish": [
            "Sinnoh se basa en Hokkaido, que es la segunda isla principal más grande de Japón.",
            "Los lagos ubicados en esta región forman un triángulo en el mapa, el cual representa a los tres legendarios principales, así como a los guardianes del lago.",
            "El nombre de 'Sinnoh' significa 'misterioso', lo cual se considera una referencia a todos los mitos e historias que se encuentran en esta región.",
            "Es la única región que tiene un alto mando del tipo bicho y tierra."
         ],
         "english": [
            "Sinnoh id based on Hokkaido, which is the second largest main island in Japan.",
            "The three lakes located in this region form a triangle on the map, which represents the three main legendary, as well as the guardians of the lake.",
            "The name 'Sinnoh' denotes 'mysterious', which is a reference to the many myths and stories that lie within the region.",
            "It is the only region whose elite four have the bug and ground type."

         ]
    },
    "unova":{
        "spanish": [
            "Unova es la primera región que no se basa en Japón, ya que la misma se inspira en New York City, Estados Unidos.",
            "Desde las ciudades más grandes, hasta los pueblos más pequeños, Unova es la región que cuenta con la mayor cantidad de asentamientos.",
            "Unova es la única región cuya pokédex no inicia con el inicial de tipo planta, sino con el pokémon legendario Victini.",
            "Es la región que cuenta con más líderes de gimnasio, sumando un total de 14."
        ],
        "english": [
            "Unova in the first region that is not based on Japan, since it is inspired by New York City, United States.",
            "From the largest cities to the smallest towns, Unova is the region with the largest number of settlements.",
            "Unova is the only region whose pokédex does not start with the grass-type starter, but with the legendary pokémon Victini.",
            "It is the region that has the most gym leaders, adding a total of 14."
        ]
    },
    "kalos":{
        "spanish": [
            "Kalos está basada principalmente en las áreas metropolitanas del norte de Francia.",
            ,
            "Kalos tiene la mayor población de entre todas las regiones, siendo esta de 1288 incluyendo las ciudades, pueblos, rutas y áreas."
        ],
        "english": [
            "placeholder"
        ]
    },
    "alola":{
        "spanish": [
            "pepe",
            "meme"
        ],
        "english": [
            "placeholder"
        ]
    },
    "hisui":{
        "spanish": [
            "pepe",
            "meme"
        ],
        "english": [
            "placeholder"
        ]
    },
    "galar":{
        "spanish": [
            "pepe",
            "meme"
        ],
        "english": [
            "placeholder"
        ]
    },
    "paldea":{
        "spanish": [
            "pepe",
            "meme"
        ],
        "english": [
            "placeholder"
        ]
    }
}

const getRandomFact = (region, language) => {

    let regionFacts = []; 

    try {
        regionFacts = facts[region][language];

        if (!regionFacts) {
            regionFacts = facts['kanto']['english']; /* Hotfix as the facts are incomplete */
        }
    } catch (error) {
        regionFacts = facts['kanto']['english'];
    }

    let randIndex = Math.floor(Math.random() * regionFacts.length);

    return regionFacts[randIndex]; 
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