document.addEventListener('DOMContentLoaded', async () => {
    setLanguage();
});

window.onclick = (event) => {
    if (!event.target.matches('.dropbtn')) {
        const dropdowns = document.getElementsByClassName('dropdown');
        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('active')) {
                openDropdown.classList.remove('active');
            }
        }
    }
};

const searchPokemon = () => {
    let search = document.querySelector('#searchbar').value;
    console.log(search);
    let url = `./dist/pokemon.html?name=${search.toLowerCase()}`;
    if(!url) {
        window.location.href = './dist/pokedex.html';
    }
    else {
        window.location.href = url;
    }    
}

const enterRegion = (region) => {
    let currentRegion = regionalPokedex(region);
    let url=`./dist/pokedex.html?offset=${currentRegion.start}&limit=${currentRegion.end}`;
    setRecentRegion(region);
    window.location.href = url;
};

const updateFlag = (language) => {
    const flag = document.getElementById('current-flag');
    if (language === 'spanish') {
        flag.className = 'flag fi-ve';
    } else {
        flag.className = 'flag fi-us';
    }
};

const setLanguage = () => {
    let currentLang = localStorage.getItem('language');
    if (!currentLang) {
        currentLang = 'spanish';
        localStorage.setItem('language', currentLang);
    }
    updateFlag(currentLang);
};

const changeLanguage = (language) => {
    localStorage.setItem('language', language);
    updateFlag(language);
    window.location.reload();
};

const toggleDropdown = () => {
    const dropdown = document.getElementById('language-dropdown');
    dropdown.classList.toggle('active');
};

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
            "El nombre de 'Kanto',proviene de la región Kanto, que se encuentra en Japón real y la cual incluye Tokio y prefecturas circundantes.",
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
            "Sinnoh is based on Hokkaido, which is the second largest main island in Japan.",
            "The three lakes located in this region form a triangle on the map, which represents the three main legendary, as well as the guardians of the lake.",
            "The name 'Sinnoh' denotes 'mysterious', which is a reference to the many myths and stories that lie within the region.",
            "It is the only region whose elite four have the bug and ground type."

         ]
    },
    "unova":{
        "spanish": [
            "Unova es la primera región que no se basa en Japón, ya que la misma se inspira en New York City, Estados Unidos.",
            "Desde las ciudades más grandes, hasta los pueblos más pequeños, Unova es la región que cuenta con la mayor cantidad de asentamientos.",
            "Unova es la única región cuya pokédex no empieza con el inicial de tipo planta, sino con el pokémon legendario Victini.",
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
            "Kalos tiene la mayor población de entre todas las regiones, siendo esta de 1288, incluyendo las ciudades, pueblos, rutas y áreas.",
            "Los nombres en inglés y japonés de las ciudades y pueblos en Kalos derivan de varios ingredientes usados en las fragancias.",
            "Junto con Alola, es la única región donde se pueden capturar pokémon iniciales salvajes, gracias al Safari Amistad."
        ],
        "english": [
            "Kalos is based primarily in the metropolitan areas of northern France.",
            "Kalos has the largest population of all regions, it has 1288 inhabitants, including cities, towns, routes and areas.",
            "The english and japanese names of the cities and towns in Kalos are derived from various ingredients used in fragrances.",
            "Along with Alola, it is the only region where you can capture wild starter pokémon, thanks to the Friend Safari."
        ]
    },
    "alola":{
        "spanish": [
            "Alola está basado en Hawaii. Su nombre proviende del saludo hawaiano 'Aloha'.",
            "Es la primera región la cual no posee líderes de gimnasio.",
            "La Liga Pokémon de Alola es la única de los juegos, la cual el protagonista del anime Ash, ha podido vencer.",
            "Todas las islas de Alola toman sus nombres de colores en hawaiano."
        ],
        "english": [
            "Alola is based on Hawaii. Its name comes from the hawaiian greeting 'Aloha'.",
            "This is the first main series game region which does not have gym leaders.",
            "The Alola Pokémon League is the only in the main series that Ash, the protagonist of the anime, has won.",
            "All of the Alolan Islands are named after colors in hawaiian."
        ]
    },
    "hisui":{
        "spanish": [
            "Aparte de la Ladera Corona, los nombres de las cuatro áreas principales de Hisui se relacionas a los colores asociados con los Cuatro Símbolos Chinos.",
            "Esta región se basa en la isla de Hokkaido durante la colonización japonesa temprana.",
            "Ambientado en el pasado, esta región pone a los jugadores en los zapatos del Pokeólogo original.",
            "En esta región, se introducen el Clan Diamante y el Clan Perla, los cuales hacen referencia a los nombres de los juegos de la generación IV."
        ],
        "english": [
            "Aside from the Coronet Highlands, the names of the four main areas of Hisui correspond to the colors associated with the Chinese Four Symbols.",
            "The Hisui region is based on the island of Hokkaido during early japanese colonization",
            "Set in the distant past, this region puts the players in the shoes of the original Pokéologist.",
            "In this region, the Diamond Clan and the Pearl Clan are introduced, which refer to the names of the generation IV games."
        ]
    },
    "galar":{
        "spanish": [
            "La región de Galar está basada en el Reino Unido.",
            "Galar no posee una Calle Victoria.",
            "Galar es la primera región cuyos líderes de gimnasio luego de ser retados, dejan su puesto a sus sucesores.",
            "Es la primera región en poseer un gimnasio de tipo siniestro."
        ],
        "english": [
            "The Galar region is based on the United Kingdom.",
            "Galar doesn't have a Victory Road.",
            "Galar is the first region whose gym leaders, after being challenged, leave their position to their successors.",
            "It is the first region to have a dark type gym."
        ]
    },
    "paldea":{
        "spanish": [
            "Mesagoza es el principal asentamiento de esta región, el cual lleva un nombre parecido a Zaragoza, ciudad de España.",
            "La academia a la que el jugador asiste tiene un parecido a la Catedral basílica de Nuestra Señora del Pilar, famosa iglesia de la ciudad.",
            "Paldea es la primera región que no tiene rutas ni números de ruta, en su lugar, se les conoce como 'Áreas'.",
            "Paldea es la primera región en ser mundo abierto."
        ],
        "english": [
            "Mesagoza is the main settlement in the region, its name sounds similar to Zaragoza, city in Spain.",
            "The academy the player attends to, has a slight resemblance to the Catedral basílica de Nuestra Señora del Pilar, a famous church in the city.",
            "Paldea is the first region to not have routes and route numbers, instead, they're known as 'Areas'.",
            "Paldea is the first region to be open world."
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

const getMissingno = () => {
    pokemon = {
        "id": 0,
        "species": {
            "name": "missingno"
        },
        "types": [
            {
                "type": {
                    "name": "normal"
                }
            }
        ],
        "abilities": [
            {
                "ability": {
                    "name": "unknown"
                }
            }
        ],
        "sprites": {
            "front_default": "../bucket/imgs/icons/missingno.png",
            "versions": {
                "generation-v": {
                    "black-white": {
                        "animated": {
                            "front_default": "../bucket/imgs/icons/missingno.png"
                        }
                    }
                }
            }
        },
        "cries": {
            "latest": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sounds/cry/201.wav"
        }
    }

    return pokemon;
}

