document.addEventListener('DOMContentLoaded', async () => {
    setLanguage();
    startPlayingMusic(getCurrentMusic(getRecentRegion()));
    if (document.querySelector('audio.exists')) {
        currentMusic = document.querySelector('audio.exists');
    }
    setupLanguageSwitch();
    
});

let currentMusic = null;
var recentRegion = sessionStorage.getItem('recentRegion');

const distinguishHref = (dot=false) => {

    let condition =  window.location.href.includes('dist');

    if(!dot) {
        return condition ? '' : 'dist/';
    }

    return condition ? '..' : '.'
}

const fethSpeciesData = async (pokemonName) => {
    try {
        let response = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`);
        let data = await response.data;
        return data;
    } catch (error) {
        console.error(`Failed to fetch species data for ${pokemonName}:`, error);
        throw error;
    };
};

const fetchPokeData = async (pokemonName) => {

    let response;
    let data; 
    try {
        response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        data = await response.data;
        return data;
    } catch (error) {
        console.error(`Failed to fetch pokemon data for ${pokemonName}:`, error);

        try {
            response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}-male`);
            data = await response.data;
            return data;
        }
        catch {
            throw error;
        }
    };
};

const fetchPokemonData = async (pokemonName, loadingInfo = null) => {
    try {
        let speciesdata;
        let pokedata;

        try {
            speciesdata = await fethSpeciesData(pokemonName);
        } catch (error) {
            console.error(`Failed to fetch species data for ${pokemonName}:`, error);
            console.debug(`Trying to fetch pokemon data first for ${pokemonName}`);
            
            try {
                pokedata = await fetchPokeData(pokemonName);
            } catch (error) {
                console.error(`Failed to fetch pokemon data for ${pokemonName}:`, error);
                return null;
            }

            if (pokedata == "") {
                console.debug(`Trying to fetch data by name for ${pokemonName}`);
                const pokeresponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
                pokedata = await pokeresponse.data;
            }

            const speciesName = pokedata.species.name;
            try {
                speciesdata = await fethSpeciesData(speciesName);
            } catch (error) {
                console.error(`Failed to fetch species data for ${speciesName}:`, error);
                return null;
            }
        }

        if (!pokedata) {
            try {
                pokedata = await fetchPokeData(pokemonName);
            } catch (error) {
                console.error(`Failed to fetch pokemon data for ${pokemonName}:`, error);
                try {
                    pokedata = await fetchPokeData(speciesdata.varieties[0].pokemon.name);
                }
                catch (error) {
                    console.error(`Failed to fetch pokemon data for ${pokemonName}:`, error);
                    return null;
                }
            }

            if (pokedata == "") {
                console.debug(`Trying to fetch data by name for ${pokemonName}`);
                const pokeresponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
                pokedata = await pokeresponse.data;
            }
        }

        if (loadingInfo) {
            loadingInfo.loadedCount++;
            updateLoadingScreen(loadingInfo.loadedCount, loadingInfo.totalPokemons + 1);
        }

        let pokemon = new Pokemon(speciesdata, pokedata);

        return pokemon;
    } catch (error) {
        console.error(`Failed to fetch data for ${pokemonName}:`, error);
        return null; 
    }
};

const fetchPokemonMoves = async (movesList) => {
    try {
        let movePromises = movesList.map(move => axios.get(move.move.url));
        let moveResponses = await Promise.all(movePromises);
        let moves = moveResponses.map(response => response.data);
        return moves;
    } catch (error) {
        console.error(`Failed to fetch moves data:`, error);
        return null;
    }
};

const checkEvoChain = (chain, currentPokemonName) => {
    let previousEvolution = null;
    let nextEvolution = null;

    const traverseChain = (chain, previous) => {
        if (chain.species.name === currentPokemonName) {
            if (chain.evolves_to.length > 0) {
                nextEvolution = chain.evolves_to[0].species.name;
            }
            previousEvolution = previous;
            return true;
        }

        for (let evolvesTo of chain.evolves_to) {
            if (traverseChain(evolvesTo, chain.species.name)) {
                return true;
            }
        }

        return false;
    };

    traverseChain(chain, null);
    return { previousEvolution, nextEvolution };
};

const getPreviousAndNextEvolutions = (evolutionChain, currentPokemonName) => {
    return checkEvoChain(evolutionChain, currentPokemonName);
};

const getPreviousAndNextPokemon = (currentId) => {
    let previousId;
    let nextId;

    if (currentId >= 10000) {
        previousId = currentId > 1 ? currentId - 1 : 10277;
        nextId = currentId >= 10277 ? 1 : currentId + 1;
    } else {
        previousId = currentId > 1 ? currentId - 1 : 1025;
        nextId = currentId >= 1025 ? 1 : currentId + 1;
    }

    return { previousId, nextId };
};

const searchPokemon = (dot = false) => {
    const searchbar1 = document.querySelector('#searchbar').value;
    const searchbar2 = document.querySelector('#searchbar2').value;

    console.log('searchbar1:', searchbar1);
    console.log('searchbar2:', searchbar2);

    let search1 = searchbar1.trim();
    let search2 = searchbar2.trim();

    console.log('search1:', search1);
    console.log('search2:', search2);

    let search = search1.length >= search2.length ? search1 : search2;

    console.log('search:', search);

    searchbar1.value = '';
    searchbar2.value = '';

    if (search === '') {
        window.location.href = './';
    } else {
        let dist = distinguishHref(dot);
        let url = `./${dist}pokemon.html?name=${search.toLowerCase()}`;
        window.location.href = url;
    }
}

const enterRegion = (region) => {
    let currentRegion = regionalPokedex(region);
    let url=`./dist/pokedex.html?region=${region}&offset=${currentRegion.start}&limit=${currentRegion.end}`;
    setRecentRegion(region);
    window.location.href = url;
};

const setLanguage = () => {
    let currentLang = localStorage.getItem('language');
    if (!currentLang) {
        currentLang = 'spanish';
        localStorage.setItem('language', currentLang);
    }
    updateLangSwitch(currentLang);
};

const getCurrentLanguage = () => {
    let currentLang = localStorage.getItem('language');
    return currentLang;
}

const changeLanguage = (language) => {
    localStorage.setItem('language', language);
    updateLangSwitch(language);
    window.location.reload();
};

const updateLangSwitch = (language) => {
    const langSwitches = document.querySelectorAll(".lang-switch");
    const langSwitchFlags = document.querySelectorAll(".current-flag");

    langSwitches.forEach((langSwitch, index) => {
        const langSwitchFlag = langSwitchFlags[index];
        if (language === 'english') {
            langSwitch.classList.add("active");
            langSwitchFlag.className = 'flag fi-us current-flag';
            langSwitch.title = "English";
        } else {
            langSwitch.classList.remove("active");
            langSwitchFlag.className = 'flag fi-ve current-flag';
            langSwitch.title = "Spanish";
        }
    });
};

const handleLangSwitchClick = (event) => {
    const langSwitch = event.currentTarget;
    langSwitch.classList.toggle("active");

    if (langSwitch.classList.contains("active")) {
        langSwitch.title = "English";
        changeLanguage('english');
    } else {
        langSwitch.title = "Spanish";
        changeLanguage('spanish');
    }
};

const setupLanguageSwitch = () => {
    const langSwitches = document.querySelectorAll(".lang-switch");

    langSwitches.forEach((langSwitch) => {
        langSwitch.addEventListener("click", handleLangSwitchClick);
    });

    const currentLang = localStorage.getItem('language') || 'spanish';
    updateLangSwitch(currentLang);
};

const setupVolumeControls = (currentMusic) => {
    const volumeIcons = [
        document.querySelector('#volume-icon'),
        document.querySelector('#volume-icon2')
    ].filter(icon => icon !== null);

    const handleVolumeIconClick = () => {
        return () => {
            const isMuted = currentMusic.muted;
            currentMusic.muted = !isMuted;
            console.log(isMuted ? "Unmuted" : "Muted");

            const iconHTML = isMuted ? `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="volumesize">
                    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
                    <path d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z" />
                </svg>
            ` : `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="volumesize">
                    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM17.78 9.22a.75.75 0 1 0-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 1 0 1.06-1.06L20.56 12l1.72-1.72a.75.75 0 1 0-1.06-1.06l-1.72 1.72-1.72-1.72Z" />
                </svg>
            `;

            volumeIcons.forEach(icon => {
                icon.innerHTML = iconHTML;
            });
        };
    };

    volumeIcons.forEach(icon => {
        icon.addEventListener("click", handleVolumeIconClick(icon));
    });
}

const setupSidebarButtons = () => {
    const sidebar = document.getElementById("sidebar");
    const hamburguer = document.getElementById("hamburguer");
    const hamburguer2 = document.getElementById("hamburguer2");
    const searchbar1 = document.getElementById("searchbar");
    const searchbar2 = document.getElementById("searchbar2");

    const transferSearchValue = () => {
        if (sidebar.style.right === "0px") {
            searchbar1.value = searchbar2.value;
        } else {
            searchbar2.value = searchbar1.value;
        }
    };

    const toggleSidebar = () => {
        if (sidebar.style.right === "0px") {
            sidebar.style.right = "-250px";
        } else {
            sidebar.style.right = "0px";
        }
        transferSearchValue();
    };

    hamburguer.addEventListener("click", toggleSidebar);
    hamburguer2.addEventListener("click", toggleSidebar);
}

const setRecentRegion = (region) => {
    recentRegion = region;
    sessionStorage.setItem('recentRegion', region);
};

const getRecentRegion = () => {
    if (!recentRegion) {
        recentRegion = sessionStorage.getItem('recentRegion');
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
        case 'galar': limits.start = 809; limits.end = 898; break;
        case 'paldea': limits.start = 905; limits.end = 1026; break;
        case 'hisui': limits.start = 999; limits.end = 999; break;
        case 'extra': limits.start = 1025; limits.end = 1303; break;
        default: limits.start = 0; limits.end = 1026; break;
    }

    return limits;
}
const fetchRegionsJSON = async () => {
    let response = await fetch('../bucket/data/regions.json');
    let regions = await response.json();
    return regions;
}

const getRandomFact = async (region, language) => {
    try {

        let regions = await getRegionData(region, language);
        let regionFacts = regions.facts;

        let randIndex = Math.floor(Math.random() * regionFacts.length);

        return regionFacts[randIndex];

    } catch (error) {
        console.log("Error in random facts: ", error);
        return null;
    }
}

const getMissingno = () => {
    pokemon = {
        "pokemonData" : {
            "id": 0,
            "species": {
                "name": "missingno"
            },
            "types": [
                {
                    "slot": 1,
                    "type": {
                        "name": "normal"
                    }
                }
            ],
            "abilities": [
                {
                    "ability": {
                        "name": "immunity",
                        "url": "https://pokeapi.co/api/v2/ability/immunity/"
                    },
                    "is_hidden": false,
                    "slot": 1
                }
            ],
            "height": 12,
            "weight": 0,
            "stats": [
                {
                    "base_stat": 33,
                    "effort": 0,
                    "stat": {
                      "name": "hp",
                      "url": "https://pokeapi.co/api/v2/stat/1/"
                    }
                },
                {
                    "base_stat": 136,
                    "effort": 0,
                    "stat": {
                      "name": "attack",
                      "url": "https://pokeapi.co/api/v2/stat/2/"
                    }
                },
                {
                    "base_stat": 11,
                    "effort": 0,
                    "stat": {
                      "name": "defense",
                      "url": "https://pokeapi.co/api/v2/stat/3/"
                    }
                },
                {
                    "base_stat": 75,
                    "effort": 0,
                    "stat": {
                      "name": "special_attack",
                      "url": "https://pokeapi.co/api/v2/stat/4/"
                    }
                },
                {
                    "base_stat": 0,
                    "effort": 0,
                    "stat": {
                      "name": "special_defense",
                      "url": "https://pokeapi.co/api/v2/stat/5/"
                    }
                },
                {
                    "base_stat": 29,
                    "effort": 0,
                    "stat": {
                      "name": "speed",
                      "url": "https://pokeapi.co/api/v2/stat/6/"
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
            "moves": [
                {
                    "move": {
                        "name": "pound",
                        "url": "https://pokeapi.co/api/v2/move/pound/"
                    }
                },
                {
                    "move": {
                        "name": "hyper-Beam",
                        "url": "https://pokeapi.co/api/v2/move/hyper-beam/"
                    }
                },
                {
                    "move": {
                        "name": "bind",
                        "url": "https://pokeapi.co/api/v2/move/bind/"
                    }
                },
                {
                    "move": {
                        "name": "teleport",
                        "url": "https://pokeapi.co/api/v2/move/teleport/"
                    }
                }
            ],
            "cries": {
                "latest": "../bucket/sounds/cries_pokemon_legacy_32.ogg"
            }
        },
        "speciesData": {
            "flavor_text_entries": [ 
                { 
                "flavor_text": "MissingNo is a glitched Pokémon that is found by chance if an error happens to your Pokémon game. \nIf you have found this Pokémon on the Pokédex, try searching for another Pokémon.", 
                "language": 
                    {   
                        "name": "en",
                        "url": "https://pokeapi.co/api/v2/language/9/"
                    } 
                },
                { 
                    "flavor_text": "MissingNo es un Pokémon con errores de programación que se encuentra cuando ocurre un error en algún juego. \nSi haz encontrado a este Pokémon en la Pokédex, intenta buscar otro Pokémon.", 
                    "language": 
                        {   
                            "name": "es",
                            "url": "https://pokeapi.co/api/v2/language/7/"
                        } 
                    } 
            ],       
            "evolution_chain": {
                "url": "https://pokeapi.co/api/v2/evolution-chain/78/"
            }     
        },
    }

    return pokemon;
};

const getTypeIcon = (type) => {
    switch (type) {
        case 'bug':
            return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><title>bug</title><g id="bug"><circle class="st13" cx="64" cy="64" r="64"/><path class="st1" d="M89,40c-3.93,9.55-11.51,12.15-21,13-5.9,17.33.62,36.47,13,49C104.88,90.71,109.26,57,89,40Z"/><path class="st1" d="M72.43,45.31A22.08,22.08,0,0,0,83,36a38.15,38.15,0,0,0-8.24-3.3l5.56-6.8a3,3,0,0,0-4.64-3.8l-7.55,9.23a31.72,31.72,0,0,0-8.26,0L52.32,22.1a3,3,0,1,0-4.64,3.8l5.56,6.8A38.15,38.15,0,0,0,45,36,22.12,22.12,0,0,0,72.43,45.31Z"/><path class="st1" d="M47,50a23,23,0,0,1-8-10c-1,.87-15.43,13.39-13,33,2.46,19.85,19.86,28.46,21,29C59.38,89.47,65.9,70.33,60,53,57.93,52.82,51.49,53.14,47,50Z"/></g></svg>`;
        case 'dark':
            return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><title>dark</title><g id="dark"><circle class="st2" cx="64" cy="64" r="64"/><path class="st1" d="M96.15,64A31.49,31.49,0,0,1,54.39,93.78a31.5,31.5,0,0,0,0-59.56A31.49,31.49,0,0,1,96.15,64ZM64,24a40,40,0,1,0,40,40A40,40,0,0,0,64,24Z"/></g></svg>`;
        case 'dragon':
            return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><title>dragon</title><g id="dragon"><circle class="st3" cx="64" cy="64" r="64"/><path class="st1" d="M100.89,57.49a37.4,37.4,0,0,0-35.17-30,18.22,18.22,0,0,0-.22-13A33,33,0,0,1,57,26a20.84,20.84,0,0,1-5.24,3.61,55.67,55.67,0,0,0-5.58,2.51,37.7,37.7,0,0,0-16,17.38A37.22,37.22,0,0,0,26.93,63a101,101,0,0,1,12.6-3.07c3.78-.66,7.61-1,11.41-1.51,7-1,12.51-5.06,16.37-11a19.88,19.88,0,0,1-10.54,38.3,26.7,26.7,0,0,0,8.81,10.82,26.31,26.31,0,0,0,6.36,3.35,6.9,6.9,0,0,0,3.23.71,18,18,0,0,0,3.74-1.36,37.37,37.37,0,0,0,22-41.77ZM40.81,45a10,10,0,0,1,8.36-2.83A10.07,10.07,0,0,1,38,53.36,10,10,0,0,1,40.81,45Zm19.6,57.06A37.4,37.4,0,0,1,27.76,73a53,53,0,0,1,26.55-6.44A26.16,26.16,0,0,0,50.07,82.8,26.43,26.43,0,0,0,60.41,102.06Z"/></g></svg>`;
        case 'electric':
            return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><title>electric</title><g id="electric"><circle class="st7" cx="64" cy="64" r="64"/><polygon class="st1" points="43 29 74 29 87 70 67 69 79 103 31 53.5 54 53.5 43 29"/></g></svg>`;
        case 'fairy':
            return `<svg id="fairy" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><title>fairy</title><circle class="st0" cx="64" cy="64" r="64"/><path class="st1" d="M111,64,86,50.34l3.46-11.83L77.66,42,64,17,50.34,42,38.51,38.51,42,50.34,17,64,42,77.66,38.51,89.49,50.34,86,64,111,77.66,86l11.83,3.46L86,77.66ZM70.72,70.72,64,83,57.28,70.72,45,64l12.28-6.72L64,45l6.72,12.28L83,64Z"/></svg>`;
        case 'fighting':
            return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><title>fighting</title><g id="fighting"><circle class="st19" cx="64" cy="64" r="64"/><path class="st1" d="M22.93,81.14l5,12.19A4.19,4.19,0,0,0,36,91.74V56.26a4.19,4.19,0,0,0-8.07-1.59l-5,12.19A18.78,18.78,0,0,0,22.93,81.14Z"/><path class="st1" d="M101.5,91.25V38.75a5.25,5.25,0,0,0-5.25-5.25h-2.5a5.25,5.25,0,0,0-5.25,5.25V55.83a1.67,1.67,0,0,1-1.67,1.67h0a1.66,1.66,0,0,1-1.66-1.67V38.75a5.25,5.25,0,0,0-5.25-5.25h-2.5a5.25,5.25,0,0,0-5.25,5.25V55.83A1.67,1.67,0,0,1,70.5,57.5h0a1.67,1.67,0,0,1-1.67-1.67V38.75a5.25,5.25,0,0,0-5.25-5.25h-2.5a5.25,5.25,0,0,0-5.25,5.25V55.83a1.66,1.66,0,0,1-1.66,1.67h0a1.67,1.67,0,0,1-1.67-1.67V38.75a5.25,5.25,0,0,0-5.25-5.25h-2.5a5.25,5.25,0,0,0-5.25,5.25v52.5a5.25,5.25,0,0,0,5.25,5.25h51.5A5.25,5.25,0,0,0,101.5,91.25Z"/></g></svg>`;
        case 'fire':
            return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><title>fire</title><g id="fire"><circle class="st10" cx="64" cy="64" r="64"/><path class="st1" d="M85.66,42.61c10.26,7.29,16.23,20.77,11.7,33C93.1,87.14,81.19,94.35,69.19,94.69A14,14,0,1,0,52.08,75.08c-5,9.6,2.9,19.17,11.52,23,9.77,4.36,21.06,1.14,28.9-5.6C79,111,51.67,114.29,36.67,95.81c-10.2-12.57-10.44-31-1.17-44.31C33.27,58.71,35,66,41,70c-6-12-2-21.09,6.14-29.14,3.92-3.88,8.91-5.36,13-8.75,4.5-3.72,5.09-9.9,4.23-15.33a20.61,20.61,0,0,1,11,19.72C64,36.55,59.83,52.37,69.85,58,79.61,63.52,90.94,52.54,85.66,42.61Z"/></g></svg>`;
        case 'flying':
            return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><title>flying</title><g id="flying"><circle class="st17" cx="64" cy="64" r="64"/><path class="st1" d="M98,76.08c-4.21,7.12-9.47,10.2-16.25,11-1.65.18-3.34,0-5,.25-1.19.15-2,1.43-1,2,4.86,2.67.46,3.93-.87,5a30.52,30.52,0,0,1-48.26-32A30.13,30.13,0,0,1,54.14,39.84c8.3-.37,16.64-.33,25-.1C89.83,40,99.62,38,107.47,29.31c1.45,2.41.84,4.53.49,6.49A30.76,30.76,0,0,1,78.15,61.13c-3,.07-6,0-9,.08-1,0-2.14.23-2.15,1.5,0,1,1,1.28,1.83,1.23,11-.55,22.44,2.44,32.44-4.74.73-.53,1.6-1.57,2.55-.5.78.87.21,1.89-.28,2.76C99.1,69.39,92.49,74.17,83.32,75c-2.64.24-5.32,0-8,.15-1.54.08-4.14-.72-4.22,1.35-.09,2.38,2.56,1.42,4,1.4C82.36,77.82,89.67,78.82,98,76.08Z"/></g></svg>`;
        case 'ghost':
            return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><title>ghost</title><g id="ghost"><circle class="st12" cx="64" cy="64" r="64"/><path class="st1" d="M100.25,63C100.25,29.75,59,12.2,35,35.27c-24.16,23.28-7.54,65.19,26,66.21,17.5,0,25.54-1.47,37.92-4.64a36.21,36.21,0,0,1-10.23-6.35A38.38,38.38,0,0,0,100.25,63Zm-54,3a9.25,9.25,0,0,1-2.64-18.11,10.11,10.11,0,0,0-.11,1.36,9.23,9.23,0,0,0,11.89,8.86A9.25,9.25,0,0,1,46.25,66Zm30.89,0A9.24,9.24,0,0,1,68,58.11a9.23,9.23,0,0,0,11.89-8.86,10.11,10.11,0,0,0-.11-1.36A9.25,9.25,0,0,1,77.14,66Z"/></g></svg>`;
        case 'grass':
            return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><title>grass</title><g id="grass"><circle class="st8" cx="64" cy="64" r="64"/><path class="st1" d="M99.76,26.37c-2.71-2.38-13.54.23-16.62.6a142.29,142.29,0,0,0-30,6.62c-10.05,3.55-18.25,8.67-23,18.6a37.09,37.09,0,0,0,4.39,38.52c2.19-2.33,5.33-4.68,7.06-7.36,2.31-3.57,1.05-10.7,1.22-15.18.05-1.32.54-19.59,1.43-19.65,1.08-.07,3.87,17.86,4.87,24.54a1.2,1.2,0,0,0,2,.67q3.57-3.53,7.17-7c1.64-1.59,2.46-2.21,2.9-4.28s.11-4.89.25-7.08c.08-1.3,1-17.76,2.18-17.84s3.65,12.83,4.57,17.66a1,1,0,0,0,1.61.5c4.86-4.71,20-19.43,20.71-18.77s-11.86,17.56-15.89,23a1,1,0,0,0,.71,1.53c4.91.27,18,1.12,18.11,2.2s-16.22,4.28-17.4,4.51c-2,.41-4.23.55-6.23,1.07-2.56.67-3,1.3-4.61,3.54q-3,4-6,8a1.21,1.21,0,0,0,.94,1.94c6.76.11,24.89.52,25,1.6.05.9-18,3.78-19.3,4-4.13.71-11.11.43-14.42,2.61-2.55,1.68-4.9,6.18-6.84,8.56a37.05,37.05,0,0,0,37.66,0c9.6-5.73,14-14.44,16.34-25a138.36,138.36,0,0,0,2.8-31.13c0-3.8-.14-7.61-.52-11.39C100.7,30.69,100.83,27.31,99.76,26.37Z"/></g></svg>`;
        case 'ground':
            return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><title>ground</title><g id="ground"><circle class="st15" cx="64" cy="64" r="64"/><polygon class="st1" points="89 32 59 32 39 88 109 88 89 32"/><polygon class="st1" points="48 43 32 43 16 88 32 88 48 43"/></g></svg>`;
        case 'ice':
            return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><title>ice</title><g id="ice"><circle class="st4" cx="64" cy="64" r="64"/><path class="st1" d="M60.13,64.26,38.05,76.7,16.76,64l21-12.15ZM90,51.3,67.87,63.74,90.2,76.19l21-12.15ZM61.45,35.21l-21-12.14L40,47.87,61.84,60.78ZM88,80.13,66.16,67.22l.39,25.57,21,12.14ZM87.66,47.4V23.1L66,35.18l-.27,25.34ZM62,92.82l.27-25.34L40.34,80.6v24.3Z"/></g></svg>`;
        case 'normal':
            return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><title>normal</title><g id="normal"><circle class="st20" cx="64" cy="64" r="64"/><path class="st1" d="M64,104a40,40,0,1,1,40-40A40,40,0,0,1,64,104Zm0-64A24,24,0,1,0,88,64,24,24,0,0,0,64,40Z"/></g></svg>`;
        case 'poison':
            return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><title>poison</title><g id="poison"><circle class="st16" cx="64" cy="64" r="64"/><path class="st1" d="M104,59c0-18.41-17.91-33.33-40-33.33S24,40.59,24,59c0,10,5.33,19,13.75,25.14A14,14,0,0,0,36,91c0,6.63,4.33,12,9.67,12,4.16,0,7.7-3.27,9.07-7.84C55.93,99.69,59.62,103,64,103s8.07-3.31,9.26-7.84c1.37,4.57,4.91,7.84,9.07,7.84C87.67,103,92,97.63,92,91a14,14,0,0,0-1.75-6.86C98.67,78,104,69,104,59ZM64,79.33C49.36,79.33,37,70,37,59S49.36,38.67,64,38.67,91,48,91,59,78.64,79.33,64,79.33Z"/></g></svg>`;
        case 'psychic':
            return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><title>psychic</title><g id="psychic"><circle class="st5" cx="64" cy="64" r="64"/><path class="st6" d="M84.54,95.52c-17.55,9.39-41.48,5.06-51.87-12.8-9.5-16.31-4.33-39.23,11.57-49.56s39.1-5.67,50.1,9.48c12.83,17.66,3.22,44.14-19.41,46.25-9.52.88-20-3.53-24.6-12.3-4.1-7.9-2.13-19.38,5.36-24.6S75.3,47.73,79.1,57c1.61,3.94,1,9.31-2.06,12.43C74.46,72,68.46,73,65.67,70c-1-1.1-2.09-3.15-.15-3.93.76-.3,2.7,1,3.61,1,4.19-.06,5.52-5.35,3.37-8.46-2.61-3.76-8.38-3.48-11.66-.93-4,3.12-4.5,8.29-2.77,12.8,3.36,8.71,14.29,10.68,21.74,5.7,7.24-4.85,8.34-16.5,4.67-23.87-5-10.11-18.82-13.08-28.79-9.47s-15.76,13.28-16,23.58A28.92,28.92,0,0,0,51.39,90.17C61.13,97.29,73.2,95.52,84.54,95.52Z"/></g></svg>`;
        case `rock`:
            return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><title>rock</title><g id="rock"><circle class="st14" cx="64" cy="64" r="64"/><path class="st1" d="M95,34l10,31L92,81,83,67ZM74,101,88,85,78,71,47,92ZM52,34,24,64l1,21,15,5L77,65,88,34Z"/></g></svg>`;
        case 'steel':
            return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><title>steel</title><g id="steel"><circle class="st11" cx="64" cy="64" r="64"/><path class="st1" d="M84,64A20,20,0,1,1,64,44,20,20,0,0,1,84,64Zm1.75-37.67H42.25L20.5,64l21.75,37.67h43.5L107.5,64Z"/></g></svg>`;
        case 'water':
            return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><title>water</title><g id="water"><circle class="st9" cx="64" cy="64" r="64"/><path class="st1" d="M92.5,76a28.5,28.5,0,0,1-57,0c0-15.74,23-50.5,28.5-50.5S92.5,60.26,92.5,76Zm-25,9.5a15,15,0,0,1-15-15,14.85,14.85,0,0,1,1.12-5.67A17,17,0,1,0,80,79c0-.07,0-.13,0-.2A15,15,0,0,1,67.5,85.5Z"/></g></svg>`;
        default:
            return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><title>normal</title><g id="normal"><circle class="st20" cx="64" cy="64" r="64"/><path class="st1" d="M64,104a40,40,0,1,1,40-40A40,40,0,0,1,64,104Zm0-64A24,24,0,1,0,88,64,24,24,0,0,0,64,40Z"/></g></svg>`;
    }
};

const getAbilityTrans = async (ability, language) => {
    try {
        const response = await axios.get(`${ability.ability.url}`);
        const data = await response.data;

        console.log(data);

        let name = data.names.find(name => name.language.name === language).name;
        let entry = data.flavor_text_entries.find(entry => entry.language.name === language).flavor_text;

        return { name, entry };
    } catch (error) {
        if (language !== 'en') {
            return getAbilityTrans(ability, 'en');
        } else {
            throw console.error('Unable to find ability data in any language');
        }
    }
};

const loadPokemonAbilities = async (abilities) => {
    
    let translatedNames = [];

    for (let ability of abilities) {
        const translatedAbility = await getAbilityTrans(ability, getLangTag(getCurrentLanguage()));
        translatedNames.push(translatedAbility);
    }

    return translatedNames;
};

const getCurrentMusic = (region) => {
    let musicUrl = null;

    switch (region) {
        case 'kanto':
            musicUrl = "../bucket/sounds/pallet-town.mp3";
        break;

        case 'johto':
            musicUrl = "../bucket/sounds/route-101.mp3";
        break;

        case 'hoenn':
            musicUrl = "../bucket/sounds/littleroot-town.mp3";
        break;

        case 'sinnoh':
            musicUrl = "../bucket/sounds/route-201.mp3";
        break;

        case 'unova':
            musicUrl = "../bucket/sounds/accumula-town.mp3";
        break;
    
        case 'kalos':
            musicUrl = "../bucket/sounds/lumiose-city.mp3";
        break;

        case 'alola':
            musicUrl = "../bucket/sounds/iki-town.mp3";
        break;

        case 'galar':
            musicUrl = "../bucket/sounds/postwick-town.mp3";
        break;

        case 'hisui':
            musicUrl = "../bucket/sounds/jubilife-village.mp3";
        break;

        case 'paldea':
            musicUrl = "../bucket/sounds/the-academy.mp3";	
        break;

        case 'all':
            musicUrl = "../bucket/sounds/title-screen.mp3";
        break;

        default:
            musicUrl = "../bucket/sounds/pokemon-center.mp3";
        break;
    }

    return musicUrl;
}

const startPlayingMusic = (url) => {
    let audio = document.querySelector('audio.exists');

    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(error => {
            console.warn('Error playing audio: Please interact with the page to start playing audio.');
        });
        return;
    }

    audio = document.createElement('audio');
    audio.src = url;
    audio.loop = true;
    audio.muted = true;
    audio.classList.add('exists');
    audio.style.display = 'none';
    document.body.appendChild(audio);

    const unmuteAndPlay = async () => {
        audio.muted = false;
        audio.currentTime = 0;
        audio.volume = 5 / 100;
        try {
            await audio.play();
            document.removeEventListener('click', unmuteAndPlay);
            document.removeEventListener('keydown', handleKeydown);
            document.removeEventListener('mousemove', unmuteAndPlay);
            document.removeEventListener('touchstart', unmuteAndPlay);
            document.removeEventListener('scroll', unmuteAndPlay);
        } catch (error) {
            console.warn('Error playing audio: Please interact with the page to start playing audio.');
        }
    };

    const handleKeydown = (event) => {
        const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
        if (!arrowKeys.includes(event.key)) {
            unmuteAndPlay();
        }
    };

    document.addEventListener('click', unmuteAndPlay);
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('mousemove', unmuteAndPlay);
    document.addEventListener('touchstart', unmuteAndPlay);
    document.addEventListener('scroll', unmuteAndPlay);

    audio.play().catch(error => {
        console.warn('Error playing audio: Please interact with the page to start playing audio.');
    });
};

const getRegionData = async (region, language="spanish") => {
    let regions = await fetchRegionsJSON();
    let data = regions[language][region]
    return data;
}

const getRegionExtra = async (region) => {
    try {
        let response = await axios.get(`../bucket/data/regionsextra.json`);
        let data = await response.data;
        let regionData = data[region];

        if (regionData.professor === "sada" && getCurrentLanguage() != "spanish") {
            regionData.professor = "turo";
        };

        return regionData;
    } catch (error) {
        console.error(error);
        return { "professor": "Unknown", "games": ["unknown"] };
    }
}

const translatedText = {
    "splash": {
        "spanish": "¡Bienvenido a la Pokédex!",
        "english": "Welcome to the Pokédex!"
    },
    "splashSubtitle": {
        "spanish": "¡Escoge tu región!",
        "english": "Choose your region!"
    },
    "all":
    {
        "spanish": "Todas las regiones",
        "english": "All regions"
    },
    "generation": {
        "spanish": "Generación",
        "english": "Generation"
    },
    "search": {
        "spanish": "Buscar...",
        "english": "Search..."
    },
    "access": {
        "spanish": "Accediendo a",
        "english": "Now accessing"
    },
    "funfact": {
        "spanish": "¿Sabias qué?",
        "english": "Did you know?"
    },
    "appearsin": {
        "spanish": "Juegos en los que aparece:",
        "english": "Games it appears in:"
    },
    "female": {
        "spanish": "Female",
        "english": "Femenino"
    },
    "male": {
        "spanish": "Masculino",
        "english": "Femenino"
    },
    "height": {
        "spanish": "AT:",
        "english": "HT:"
    },
    "weight": {
        "spanish": "PS:",
        "english": "WT:"
    },
    "move": {
        "spanish": "Movimiento",
        "english": "Move"
    },
    "description": {
        "spanish": "Descripción",
        "english": "Description"
    },
    "accuracy": {
        "spanish": "Precisión",
        "english": "Accuracy"
    },
    "info": {
        "spanish": "Información",
        "english": "Info"
    },
    "moves": {
        "spanish": "Movimientos",
        "english": "Moves"
    },
    "prevevo": {
        "spanish": "Pre-evolución",
        "english": "Pre-evolution"
    },
    "nextevo": {
        "spanish": "Evolución",
        "english": "Evolution"
    }
}

const getLangTag = (language) => {
    switch (language) {
        case 'spanish':
            return 'es';
        case 'english':
            return 'en';
        default:
            return 'es';
    }
}

const getTranslatedText = (text, language) => {
    return translatedText[text][language];
};

const CFL = (string) => {
    return capitalizeFirstLetter(string);
}
const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

class Queue {

    constructor() {
        this.items = {};
        this.frontIndex = 0;
        this.backIndex = 0;
    };

    enqueue(item) {
        this.items[this.backIndex] = item;
        this.backIndex++;
        return item + ' inserted';
    };

    dequeue() {
        const item = this.items[this.frontIndex];
        delete this.items[this.frontIndex];
        this.frontIndex++;
        return item;
    };

    peek() {
        return this.items[this.frontIndex];
    }
    ;
    get printQueue() {
        return this.items;
    };

    isEmpty() {
        return this.frontIndex === this.backIndex;
    }

    forEach(callback) {
        for (let i = this.frontIndex; i < this.backIndex; i++) {
            callback(this.items[i], i);
        }
    };
    *[Symbol.iterator]() {
        for (let i = this.frontIndex; i < this.backIndex; i++) {
            yield this.items[i];
        }
    }
}

class Pokemon {
    constructor(SpeciesData, PokemonData = null) {
        this.speciesData = SpeciesData;
        this.pokemonData = PokemonData;
    };

    getName() {
        return this.speciesData.pokemon_species.name;
    }
}