document.addEventListener('DOMContentLoaded', async () => {
    createLoader();
    const pokemon = await getPokemon();
    setupSidebarButtons();
    console.debug(pokemon);
    try {
        await loadPokemon(pokemon);
    } catch {
        console.error('Error loading Pokémon data');
        await loadPokemon(getMissingno());
    }
    setRecentRegion(getRecentRegion());
    startPlayingMusic(getCurrentMusic(getRecentRegion()));
    if (document.querySelector('audio.exists')) {
        currentMusic = document.querySelector('audio.exists');
    }
    setupVolumeControls(currentMusic);
});

let lastVolume = 10;

var applyLanguageText = () => {

    let search = document.getElementById('searchbar');
    search.placeholder = getTranslatedText('search', getCurrentLanguage());

    let height = document.querySelector('.metadata-height');
    height.innerText = getTranslatedText('height', getCurrentLanguage());

    let weight = document.querySelector('.metadata-weight');
    weight.innerText = getTranslatedText('weight', getCurrentLanguage());

};

const getPokemon = async () => {
    try {
        const params = new URLSearchParams(window.location.search);
        let name = params.get('name');

        let pokemonData = await fetchPokemonData(name)

        return pokemonData;
        
    } catch (error) {
        console.error('Error getting Pokemin: ', error);
    }
};

const playCry = async (url) => {
    try {
        const audio = new Audio(url);
        audio.volume = 25 / 100;
        await audio.play();
        console.log('Playing sound');
        let sprite2 = document.querySelector('.sprite');
        sprite2.classList.toggle('rotate');
    } catch (error) {
        console.error(error);
    }
};

const createLoader = () => {
    const pokemonCard = document.getElementById('pokemon-card');
    pokemonCard.innerHTML = `
        <div class="wrapper">
            <div class="pokeball">
            </div>
        </div>
    `;
};

const backgroundUrls = {
    normal: 'grass_bg.jpg',
    fire: 'lava-mountain_bg.jpg',
    water: 'ocean_bg.jpg',
    electric: 'electric-tower_bg.jpg',
    grass: 'forest_bg.jpg',
    ice: 'frost-cavern_bg.jpg',
    fighting: 'dojo_bg.jpg',
    poison: 'poison_bg.jpg',
    ground: 'desert_bg.jpg',
    flying: 'sky_bg.jpg',
    psychic: 'psychic_bg.jpg',
    bug: 'bug_bg.jpg',
    rock: 'rocky-mountains_bg.jpg',
    ghost: 'graveyard_bg.jpg',
    dragon: 'cave_bg.jpg',
    dark: 'city-night_bg.jpg',
    steel: 'electric-tower_bg.jpg',
    fairy: 'fairy_bg.jpg',
    default: 'city_bg.jpg'
};

function getBackgroundByType(types) {
    if (types[0] === 'normal' && !types[1]) {
        return backgroundUrls.normal;
    } else if ((types[0] === 'normal' || types[0] === 'bug') && types[1]) {
        const type = types[1];
        return backgroundUrls[type.toLowerCase()] || backgroundUrls.default;
    } else {
        const type = types[0];
        return backgroundUrls[type.toLowerCase()] || backgroundUrls.default;
    }
}


const loadPokemon = async (pokemon) => {
    const pokemonCard = document.getElementById('pokemon-card');
    let pokeData = pokemon.pokemonData || getMissingno();
    let pokeSpecies = pokemon.speciesData || getMissingnoSpecies();

    let descriptions = pokeSpecies.flavor_text_entries.filter(entry => entry.language.name === `${getLangTag(getCurrentLanguage())}`);
    let description = descriptions[Math.floor(Math.random() * descriptions.length)];
    if (!description) {
        description = pokeSpecies.flavor_text_entries.find(entry => entry.language.name === 'en');
    }
    description.flavor_text = description.flavor_text.replace(/\n/g, ' ');
    

    let spritelist = [ 
        pokeData.sprites.versions['generation-v']['black-white'].animated.front_default,
        pokeData.sprites.versions['generation-v']['black-white'].animated.front_female,
        pokeData.sprites.versions['generation-v']['black-white'].animated.front_shiny ];

    if(!spritelist[0]) {
        spritelist[0] = pokeData.sprites.front_default;
        spritelist[1] = pokeData.sprites.front_female;
        spritelist[2] = pokeData.sprites.front_shiny;
    }

    if(!spritelist[0]) {
        spritelist[0] = pokeData.sprites.other['official-artwork'].front_default;
    }

    const movesData = await fetchPokemonMoves(pokeData.moves);

    const pokemonTypes = pokeData.types.map(type => type.type.name);

    const { previousId, nextId } = getPreviousAndNextPokemon(pokeData.id);

    const previousPokemonData = await fetchPokeData(previousId);
    const nextPokemonData = await fetchPokeData(nextId);

    const evolutionChainUrl = pokeSpecies.evolution_chain.url;
    const evolutionChainResponse = await fetch(evolutionChainUrl);
    const evolutionChainData = await evolutionChainResponse.json();

    const { previousEvolution, nextEvolution } = getPreviousAndNextEvolutions(evolutionChainData.chain, pokeData.species.name);

    const previousEvolutionData = previousEvolution ? await fetchPokeData(previousEvolution) : null;
    const nextEvolutionData = nextEvolution ? await fetchPokeData(nextEvolution) : null;
    
    pokemonCard.innerHTML = `
        <div class="pokemon" id="card-wrapper">
            <div class="name-wrapper">
                <h2 class="pokemon-name self-start">${pokeData.species.name}</h2>
                <h2 class="pokemon-id self-end">#${pokeData.id}</h2>
            </div>

            <div class="poke-wrapper">

                <div class="pokemon-change previous">
                    <a href="../dist/pokemon.html?name=${previousId}">
                        <img title="${CFL(previousPokemonData.species.name)}" src="${previousPokemonData.sprites.front_default}" alt="Previous Pokémon">
                        <span>&larr;</span>
                        <h3 class="pokemon-id-header">#${previousId}</h3>
                    </a>
                </div>

                <div class="pokemon-image">
                    <button class="inherit clickable" onClick="playCry('${pokeData.cries.latest}')">
                        <div class="pokemon-bg flex justify-center align-middle" style="background-image: url('../bucket/imgs/backgrounds/${getBackgroundByType(pokemonTypes)}')">
                            <div class="image-wrapper">
                                <img class="sprite inherit" 
                                    src="${spritelist[0]}" 
                                    onload="adjustSpriteWrapper(this)"
                                >
                            </div>
                        </div>
                    </button>
                </div>

                <div class="pokemon-change next">
                    <a href="../dist/pokemon.html?name=${nextId}">
                        <img title="${CFL(nextPokemonData.species.name)}" src="${nextPokemonData.sprites.front_default}" alt="Next Pokémon">
                        <span>&rarr;</span>
                        <h3 class="pokemon-id-header">#${nextId}</h3>
                    </a>
                </div>
                
            </div>

            <div class="pokemon-data">
                <div class="pokemon-type">
                    <div class="type-icons">
                    ${pokeData.types.map(type => `
                        ${getTypeIcon(type.type.name)}
                    `).join('')}
                    </div>

                    <div class="pokemon-abilities">
                        
                    </div>

                    <div class="pokemon-metadata">
                        <p class="metadata">
                            <span class="metadata-height">Height:</span> ${pokeData.height / 10} m
                        </p>
                        <p class="metadata">
                            <span class="metadata-weight">Weight:</span> ${pokeData.weight / 10} kg
                        </p>
                    </div>

                    <div class="pokemon-genders">
                        <button class="gender-icon clickable" id="male" onclick="changeSprite('${spritelist[0]}')">
                            <p>M</p>
                        </button>
                        <button class="gender-icon clickable" id="female" onclick="changeSprite('${spritelist[1]}')">
                            <p>F</p>
                        </button>
                        <button class="gender-icon clickable" id="shiny" onclick="changeSprite('${spritelist[2]}')">
                            <p>S</p>
                        </button>
                    </div>
                </div>  

                <h3 id="pokemon-info-title"> ${getTranslatedText("info", getCurrentLanguage())} </h3>
                
                <button id="clickme" style="display: none"> kill stats </button>

                <div class="pokemon-description">
                    <p class="custom-scrollbar">${description.flavor_text}</p>
                    
                    <canvas class="pokemon-stats" style="visibility: visible">
                    </canvas>
                </div>
                    
                <div class="pokemon-moves">
                    <h3>${getTranslatedText("moves", getCurrentLanguage())}</h3>
                    <div class="moves-container custom-scrollbar">
                        <table class="moves-list">
                            <thead>
                                <tr>
                                    <th>${getTranslatedText("move", getCurrentLanguage())}</th>
                                    <th>${getTranslatedText("description", getCurrentLanguage())}</th>
                                    <th>${getTranslatedText("accuracy", getCurrentLanguage())}</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${movesData.map(move => {                            
                                    return `
                                        <tr>
                                            <td class="move-name">${move.names.find(name => name.language.name === getLangTag(getCurrentLanguage()))?.name || 'N/A'}</td>
                                            <td class="move-details">${move.flavor_text_entries.find(flavor_text => flavor_text.language.name === getLangTag(getCurrentLanguage()))?.flavor_text || 'N/A'}</td>
                                            <td class="move-level">${move.accuracy || 'N/A'}</td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="pokemon-evolution-footer">
                ${previousEvolutionData ? `
                    <div class="pokemon-evolution">
                        <a href="../dist/pokemon.html?name=${previousEvolutionData.id}">
                            <img src="${previousEvolutionData.sprites.front_default}" alt="Previous Evolution">
                        </a>
                        <span>&larr; ${getTranslatedText("prevevo", getCurrentLanguage())}</span>
                    </div>
                ` : ''}

                ${nextEvolutionData ? `
                    <div class="pokemon-evolution">
                        <a href="../dist/pokemon.html?name=${nextEvolutionData.id}">
                            <img src="${nextEvolutionData.sprites.front_default}" alt="Next Evolution">
                        </a>
                        <span>${getTranslatedText("nextevo", getCurrentLanguage())} &rarr;</span>
                    </div>
                ` : ''}
                </div>
            </div>
        </div>
    `;

    const abilities = document.querySelector('.pokemon-abilities');
    const abilitiesList = await loadPokemonAbilities(pokeData.abilities);

    abilitiesList.forEach(ability => {
        abilities.innerHTML += `
            <p title="${ability.entry}">${ability.name}</p
        `;
    });

    const femaleButton = document.querySelector('#female');

    if(!spritelist[1]) {
        femaleButton.style.display = 'none';
    }
    
    const ctx = document.querySelector('.pokemon-stats').getContext('2d');

    const buttonsito = document.querySelector('#clickme');
    buttonsito.addEventListener('click', () => {
        const canvas = document.querySelector('.pokemon-stats');
        canvas.style.visibility = canvas.style.visibility === 'visible' ? 'collapse' : 'visible';
    });

    stat = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['HP', 'Attack', 'Defense', 'Special Attack', 'Special Defense', 'Speed'],
            datasets: [{
                label: `${CFL(pokeData.species.name)} Stats`,
                data: [pokeData.stats[0].base_stat, pokeData.stats[1].base_stat, pokeData.stats[2].base_stat, pokeData.stats[3].base_stat, pokeData.stats[4].base_stat, pokeData.stats[5].base_stat],
                borderWidth: 2,
                fill: true,
                clip: 0,
                backgroundColor: 'rgba(255, 99, 132, 0.65)',
                borderColor: 'rgb(255, 99, 132)',
                borderCapStyle: 'butt',
                pointBackgroundColor: 'rgb(255, 99, 92)',
                pointBorderColor: 'rgb(255, 99, 132)',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(255, 99, 132)'
            }]
        },
        options: {
            scale: {
                ticks: {
                    beginAtZero: true,
                    pointStyle: 'circle',
                },
                r: {
                    angleLines: {
                        display: false
                    },
                    suggestedMin: 0,
                    suggestedMax: 180
                }
            }
        }
    });

    applyLanguageText();

};

const changeSprite = (url) => {
    const image = document.querySelector('.sprite');

    if (url) {
        image.src = url;
    } else {
        image.src = getMissingno().sprites.front_default;
    }
};

const adjustSpriteWrapper = (img) => {
    const imageWrapper = img.parentElement;
    const width = img.naturalWidth;
    const height = img.naturalHeight;

    if (width <= 48 && height <= 48) {
        imageWrapper.style.maxWidth = '50%';
        imageWrapper.style.maxHeight = '50%';
    } else if (width <= 96 && height <= 96) {
        imageWrapper.style.maxWidth = '80%';
        imageWrapper.style.maxHeight = '80%';
    } else {
        imageWrapper.style.maxWidth = '100%';
        imageWrapper.style.maxHeight = '100%';
    }
};

const fetchPokemonInSpanish = async () => {
    const languageUrl = 'https://pokeapi.co/api/v2/language/7/'; // Spanish language ID

    try {
        const params = new URLSearchParams(window.location.search);
        const name = params.get('name');

        // Fetch the Pokémon details
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const pokemonData = response.data;

        // Fetch language-specific data
        const speciesResponse = await axios.get(pokemonData.species.url);
        const speciesData = speciesResponse.data;

        // Find the name in Spanish
        const nameInSpanish = speciesData.names.find(name => name.language.url === languageUrl);

        // Fetch all moves, types, and abilities in a single call
        const allDataPromises = [
            ...pokemonData.moves.map(moveInfo => axios.get(moveInfo.move.url)),
            ...pokemonData.types.map(typeInfo => axios.get(typeInfo.type.url)),
            ...pokemonData.abilities.map(abilityInfo => axios.get(abilityInfo.ability.url))
        ];

        const allDataResponses = await Promise.all(allDataPromises);

        // Extract moves, types, and abilities in Spanish
        const moves = allDataResponses.slice(0, pokemonData.moves.length).map((response, index) => {
            const moveData = response.data;
            const moveNameInSpanish = moveData.names.find(name => name.language.url === languageUrl);
            return {
                name: moveNameInSpanish ? moveNameInSpanish.name : moveData.name,
                method: pokemonData.moves[index].version_group_details[0].move_learn_method.name,
                level: pokemonData.moves[index].version_group_details[0].level_learned_at
            };
        });

        const types = allDataResponses.slice(pokemonData.moves.length, pokemonData.moves.length + pokemonData.types.length).map((response) => {
            const typeData = response.data;
            const typeNameInSpanish = typeData.names.find(name => name.language.url === languageUrl);
            return typeNameInSpanish ? typeNameInSpanish.name : typeData.name;
        });

        const abilities = allDataResponses.slice(pokemonData.moves.length + pokemonData.types.length).map((response) => {
            const abilityData = response.data;
            const abilityNameInSpanish = abilityData.names.find(name => name.language.url === languageUrl);
            return abilityNameInSpanish ? abilityNameInSpanish.name : abilityData.name;
        });

        console.log({
            name: nameInSpanish ? nameInSpanish.name : pokemonData.name,
            id: pokemonData.id,
            types: types,
            abilities: abilities,
            moves: moves,
        });

        return {
            name: nameInSpanish ? nameInSpanish.name : pokemonData.name,
            id: pokemonData.id,
            types: types,
            abilities: abilities,
            moves: moves,
        };
    } catch (error) {
        console.error('Error fetching Pokémon data:', error);
    }
};
