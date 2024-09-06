document.addEventListener('DOMContentLoaded', async () => {
    const pokemon = await getPokemon();
    console.debug(pokemon);
    loadPokemon(pokemon);
    setRecentRegion(getRecentRegion());
    startPlayingMusic(getCurrentMusic(getRecentRegion()));
    if (document.querySelector('audio.exists')) {
        currentMusic = document.querySelector('audio.exists');
    }
    setupVolumeControls(currentMusic);
});

let lastVolume = 10;

const getPokemon = async () => {
    try {
        const params = new URLSearchParams(window.location.search);
        let name = params.get('name');

        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const pokemonData = await response.data;

        const speciesResponse = await axios.get(pokemonData.species.url);
        const speciesData = await speciesResponse.data;
        console.log(speciesData);

        return pokemonData;

        return {
            pokemonData: pokemonData,
            speciesData: speciesData
        };
        
    } catch (error) {
        console.error(error);
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


const loadPokemon = (pokemon) => {
    const pokemonCard = document.getElementById('pokemon-card');
    let _pokemon = pokemon || getMissingno();

    sprite = _pokemon.sprites.versions['generation-v']['black-white'].animated.front_default;

    if(!sprite) {
        sprite = _pokemon.sprites.front_default;
    }

    const pokemonTypes = pokemon.types.map(type => type.type.name);
    
    pokemonCard.innerHTML = `
        <div class="pokemon" id="card-wrapper">
            <div class="name-wrapper">
                <h2 class="pokemon-name self-start">${_pokemon.species.name}</h2>
                <h2 class="pokemon-id self-end">#${_pokemon.id}</h2>
            </div>
            <div class="pokemon-image">
                <button class="inherit" onClick="playCry('${_pokemon.cries.latest}')">
                    <div class="pokemon-bg flex justify-center align-middle" style="background-image: url('../bucket/imgs/backgrounds/${getBackgroundByType(pokemonTypes)}')">
                        <div class="image-wrapper">
                            <img class="sprite inherit" 
                                src="${sprite}" 
                                onload="adjustSpriteWrapper(this)"
                            >
                        </div>
                    </div>
                </button>
            </div>
            <div class="pokemon-data">
                <div class="pokemon-type">
                    <div class="type-icons">
                    ${_pokemon.types.map(type => `
                        ${getTypeIcon(type.type.name)}
                    `).join('')}
                    </div>
                </div>
                <div class="pokemon-abilities">
                    <p>${_pokemon.abilities[0].ability.name}</p>
                </div>
                <button id="clickme"> kill stats </button>

                <div class="pokemon-description">
                    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iste debitis sint laborum, earum, quia magni quidem labore inventore facilis, ex officia? Quaerat officia pariatur natus atque itaque cupiditate vero impedit!</p>
                    
                    <canvas class="pokemon-stats" style="display: hidden">
                </div>
                    
                </canvas>
                <div class="pokemon-moves">
                    <br>
                    <h3>Moves</h3>
                    <div class="moves-container">
                        <table class="moves-list">
                            <thead>
                                <tr>
                                    <th>Move</th>
                                    <th>Method</th>
                                    <th>Level</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${_pokemon.moves.map(move => `
                                    <tr>
                                        <td class="move-name">${move.move.name}</td>
                                        <td class="move-details">${move.version_group_details[0].move_learn_method.name}</td>
                                        <td class="move-level">${move.version_group_details[0].level_learned_at}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;

    const ctx = document.querySelector('.pokemon-stats').getContext('2d');

    const buttonsito = document.querySelector('#clickme');
    buttonsito.addEventListener('click', () => {
        const canvas = document.querySelector('.pokemon-stats');
        canvas.style.display = canvas.style.display === 'none' ? 'block' : 'none';
    });

    stat = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['HP', 'Attack', 'Defense', 'Special Attack', 'Special Defense', 'Speed'],
            datasets: [{
                label: `${CFL(_pokemon.species.name)} Stats`,
                data: [_pokemon.stats[0].base_stat, _pokemon.stats[1].base_stat, _pokemon.stats[2].base_stat, _pokemon.stats[3].base_stat, _pokemon.stats[4].base_stat, _pokemon.stats[5].base_stat],
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
