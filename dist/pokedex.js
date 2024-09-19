document.addEventListener('DOMContentLoaded', async () => {

    let params = new URLSearchParams(window.location.search);
    setRecentRegion(params.get('region'));
    setupSidebarButtons();
    loadPokedex();
    applyLanguageText();
    startPlayingMusic(getCurrentMusic(getRecentRegion()));
    if (document.querySelector('audio.exists')) {
        currentMusic = document.querySelector('audio.exists');
    }
    setupVolumeControls(currentMusic);
});

var applyLanguageText = () => {

    let search = document.getElementById('searchbar');
    search.placeholder = getTranslatedText('search', getCurrentLanguage());
};

const regionPokedex = {
    all: [1],
    kanto: [26],
    johto: [7],
    hoenn: [15],
    sinnoh: [6],
    unova: [9],
    kalos: [12, 13, 14],
    alola: [21],
    galar: [27, 28, 29],
    hisui: [30],
    paldea: [31, 32, 33],
}

const getRegionPokedex = (region) => {
    return regionPokedex[region];
}

let lastVolume = 10;

const getQueueOfPokemon = async (pokedexes) => {
    let pokequeue = new Queue();

    for (const pokedex of pokedexes) {
        let response = await axios.get(`https://pokeapi.co/api/v2/pokedex/${pokedex}`);
        let data = await response.data;
        console.log(data);
        pokequeue.enqueue(data.pokemon_entries);
    }

    return pokequeue;
};

const getPokedex = async (queue) => {

    let pokemonList = [];
    let pokemonNames = new Set();

    while (!queue.isEmpty()) {
        let pokedex = queue.dequeue();
        for (let pokemon of pokedex) {
            let pokemonName = new Pokemon(pokemon).getName();
            if (!pokemonNames.has(pokemonName)) {
                pokemonNames.add(pokemonName);
            }
        }
    }

    const totalPokemons = pokemonNames.size;
    let loadingInfo = { loadedCount: 0, totalPokemons };

    const fetchPromises = Array.from(pokemonNames).map(pokemonName => fetchPokemonData(pokemonName, loadingInfo));

    pokemonList = await Promise.all(fetchPromises);

    console.log(pokemonList);
    return pokemonList;
};
const getPokemons = async () => {
    try {
        const params = new URLSearchParams(window.location.search);
        let offset = params.get('offset');
        let limit = params.get('limit');
        let i = 0;

        await deployLoadingScreen(getRecentRegion());
        //const factBox = document.querySelector('.region-fact');

        if((offset == 0 && limit == 0) || (offset == 1025 && limit == 1303)) { // If it's not the Extra region, defined as 0 and 0
            let trueLimit = limit - offset;
            let response = await axios.get(`https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${trueLimit - 1}`);
            let data = await response.data;
            let poke = [];
            for (let pokemon of data.results) {
                let response = await axios.get(pokemon.url);
                let data = await response.data;
                let speciesResponse = await axios.get(data.species.url);
                let speciesData = await speciesResponse.data;
                poke.push(new Pokemon(speciesData, data));
                i++;
                updateLoadingScreen(i, trueLimit);
                console.log(i);
            }

            return poke;
        } else {
            try {
                let pokedexes = getRegionPokedex(getRecentRegion());
                let queue = await getQueueOfPokemon(pokedexes);
                let pokemons = await getPokedex(queue);
                return pokemons;
            } catch (error) {
                console.error(error);
            }            

            console.log(poke); 
            return poke;
        }
    } catch (error) {
        console.error(error);
    }
}



const deployLoadingScreen = async (region) => {

    const mainContent = document.querySelector('.content-wrapper');

    let currentLang = localStorage.getItem('language');
    let randomFact = await getRandomFact(region, currentLang);

    const loadingScreen = `<div class="loading-screen mx-auto" id="loading-screen"> 

        <section class="facts-container">
            <h1 class="text-6xl mb-2" id="region-title"> ${getTranslatedText('access', getCurrentLanguage())}: ${CFL(region)} </h1>   
            <div class="facts-info">
                <h2 class="title text-3xl" id="funfact">${getTranslatedText('funfact', getCurrentLanguage())}</h2>
                <p class="region-fact">${randomFact}</p>
            </div>
        </section>

        <div class="progress-wrapper">
            <div class="progress-area">
                <div class="progress-bar clickable" onclick="startPlayingMusic('${getCurrentMusic(region)}')"></div>
                <div class="flex justify-center content-center m-10 margin-flexible"> 
                    <div class="progress-number font-medium text-xl"> 0 / ??? </div>
                </div
            </div>                
        </div>

    </div>`;

    mainContent.innerHTML = loadingScreen;
}

const deployRegionInfo = async (regionName, regionData, regionExtra) => {
    const mainContent = document.querySelector('.content-wrapper');

    const regionInfo = document.createElement('div');
    regionInfo.className = 'region-info-wrapper';
    regionInfo.innerHTML = `
        <div class="region-info">
            <aside class="professor-wrapper">
                <img class="region-image" src="../bucket/imgs/icons/professor-${regionExtra.professor}.png" alt="${regionExtra.professor}">
            </aside>

            <div class="region-data">
                <h1 class="region-title">${regionName}</h1>
                <div class="region-relative">
                    <div class="region-description-before"></div>
                    <p class="region-description custom-scrollbar">${regionData.description}</p>
                    <img class="region-map" alt="${regionName}" src="${distinguishHref(true)}/bucket/imgs/regions/${regionName}.png">
                </div>
                
                <h1 class="region-title">${getTranslatedText('appearsin', getCurrentLanguage())}</h1>
            </div>

            <div class="region-extra-wrapper">
                <div class="region-extra custom-scrollbar">

                </div>
            </div>
        </div>
    `;

    for (const game of regionExtra.games) {
        const gameElement = document.createElement('div');
        gameElement.className = 'game';
        gameElement.innerHTML = `
            <img class="game-image" src="../bucket/imgs/logos/pokemon-${game}.png" alt="${game}">
        `;

        regionInfo.querySelector('.region-extra').appendChild(gameElement);
    }

    mainContent.appendChild(regionInfo);
}

const updateLoadingScreen = (index, limit) => {
    const progressBar = document.querySelector('.progress-bar');
    const progressWidth = (index * 100) / limit;
    progressBar.style.width = `${progressWidth}%`;

    const progressNumber = document.querySelector('.progress-number');
    progressNumber.innerHTML = `${index} / ${limit - 1}`;

}

const updateRandomFact = (region) => {
    const factBox = document.querySelector('.region-fact');
    let currentLang = localStorage.getItem('language');
    factBox.innerHTML = getRandomFact(region, currentLang);
};

const removeLoadingScreen = async () => {
    const loadingScreen = document.getElementById('loading-screen');
    await new Promise(resolve => setTimeout(resolve, 500));
    loadingScreen.remove();
    console.log('All pokemon loaded');
}

const createPokemonCard = (pokemon, index) => {
    const pokemonCard = document.createElement('a');
    pokemonCard.href = `./pokemon.html?name=${pokemon.pokemonData.name}`;
    pokemonCard.className = 'pokemon-card';
    const pokeData = pokemon.pokemonData;
    console.log(pokeData);
    const speciesData = pokemon.speciesData;
    console.log(pokeData)

    let image = pokeData.sprites.other["official-artwork"].front_default;

    if (image == null) {
        image = pokeData.sprites.front_default ? pokeData.sprites.front_default : '../bucket/imgs/icons/missingno.png';
        var missingno = true;
    }

    pokemonCard.innerHTML = `
        <p class="pokemon-backid">${index + 1}</p>
        <div class="pokemon-image size-52">                    
            <div class="pokeball"></div>
            <img class="sprite hidden" 
                src="${image}" 
                srcset="${image} 1x, ${image}@2x.webp 2x" 
                type="image/webp"
                alt="${pokeData.species.name}" 
                class="w-32 h-32" 
            >         
        </div>
        <div class="pokemon-data">
            <div class="name-wrapper flex flex-row justify-center">
                <h2 class="pokemon-name">${pokeData.species.name}</h2>
            </div>
            <div class="pokemon-type flex flex-row justify-center">
                ${pokeData.types.map(type => `<p class="type ${type.type.name}">${type.type.name}</p>`).join('')}
            </div>
        </div>
    `;

    let sprite = pokemonCard.querySelector('.sprite');
    if (missingno) {
        sprite.style.imageRendering = 'pixelated';
        sprite.style.width = '100%';
    } else {
        sprite.style.imageRendering = 'optimizeQuality';
    }

    let id = pokemonCard.querySelector('.pokemon-backid');

    if (index + 1 >= 1000) {
        id.style.fontSize = '9rem';
    } else if (index + 1 >= 900) {
        id.style.fontSize = '11rem';
    } else if (index + 1 >= 500) {
        id.style.fontSize = '12rem';
    } else if (index + 1 >= 100) {
        id.style.fontSize = '14rem';
        id.style.top = '-2px';
    } else if (index + 1 >= 10) {
        id.style.fontSize = '16rem';
        id.style.top = '-1rem';
    } else {
        id.style.fontSize = '20rem';
        id.style.top = '-5rem';
    }

    const img = pokemonCard.querySelector('.sprite');
    const pokeball = pokemonCard.querySelector('.pokeball');

    img.onload = () => {
        pokeball.style.animation = 'catch 0.5s ease-out forwards';
        setTimeout(() => {
            pokeball.classList.add('hidden');
            img.classList.remove('hidden');
            img.classList.add('enter');
            id.style.opacity = '0.7';
        }, 1000);
    };

    return pokemonCard;
};

const loadRegionInfo = async (region, language) => {
    let regionInfo = await getRegionData(region, language);
    let description = regionInfo.description;
    console.log(description);
    return regionInfo;
};

const loadPokedex = async () => {

    const pokemons = await getPokemons();
    const mainContent = document.querySelector('.content-wrapper');

    const regionData = await loadRegionInfo(getRecentRegion(), getCurrentLanguage());
    const regionExtra = await getRegionExtra(getRecentRegion(), getCurrentLanguage());

    await deployRegionInfo(getRecentRegion(), regionData, regionExtra);

    const pokemonList = document.createElement('div');
    pokemonList.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 justify-items-center mx-0 md:mx-4 py-2';
    pokemonList.id = 'pokemon-list';
    mainContent.appendChild(pokemonList);
    
    let index = 0;

    await removeLoadingScreen();

    for (const pokemon of pokemons) {
        try {
            const pokemonCard = createPokemonCard(pokemon, index);
            pokemonList.appendChild(pokemonCard);
            index++;
        } catch (error) {
            console.error('Error cargando Pokemon:', error);
        }
    }
    

    const backToTop = document.createElement('button');
    backToTop.classList.add('back-to-top-button', 'bg-white', "clickable");
    backToTop.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
        </svg>
        `; // HeroIcons arrow up
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    mainContent.appendChild(backToTop);
}

const enterPokemon = async (pokemon) => {
    let url = `./pokemon.html?name=${pokemon}`;

    window.location.href = url;

    console.log(url);
}