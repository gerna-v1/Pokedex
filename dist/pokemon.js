document.addEventListener('DOMContentLoaded', async () => {
    const pokemon = await getPokemon();
    console.debug(pokemon);
    loadPokemon(pokemon);
});

const getPokemon = async () => {
    try {
        const params = new URLSearchParams(window.location.search);
        let name = params.get('name');

        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const data = await response.data;
        console.log(data); 

        return data;
    } catch (error) {
        console.error(error);
        return null;
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

const loadPokemon = (pokemon) => {
    const pokemonCard = document.getElementById('pokemon-card');
    let _pokemon = pokemon || getMissingno();

    sprite = _pokemon.sprites.versions['generation-v']['black-white'].animated.front_default;

    if(!sprite) {
        sprite = _pokemon.sprites.front_default;
    }

    pokemonCard.innerHTML = `

    <div class="pokemon mx-2 my-2 bg-white rounded-md shadow-md flex flex-col items-center justify-center size-72" id="card-wrapper ">
        <div class="pokemon-image w-64 h-40">
            <button class="inherit" onClick="playCry('${_pokemon.cries.latest}')">
                <img class="sprite inherit" 
                    src="${sprite}" 
                >
            </button>
        </div>
        <div class="pokemon-data">
            <div class="name-wrapper flex flex-row">
                <p class="pokemon-id
                ">${_pokemon.id} </p>
                <h2 class="pokemon-name">${_pokemon.species.name}</h2>
            </div>
            <div class="pokemon-type">
                <p>${_pokemon.types[0].type.name}</p>
            </div>
            <div class="pokemon-abilities">
                <p>${_pokemon.abilities[0].ability.name}</p>
            </div>
        </div>
    </div>
        `;
}