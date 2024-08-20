const getPokemons = async () => {
    try {
        const params = new URLSearchParams(window.location.search);
        let offset = params.get('offset');
        let limit = params.get('limit');

        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${(limit - offset) - 1}`);
        const data = await response.data;
        console.log(data); 
        return data;
    } catch (error) {
        console.error(error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    loadPokemons();
});

const playCry = async (url) => {
    try {
        const audio = new Audio(url);
        await audio.play();
        console.log('Playing sound');
    } catch (error) {
        console.error(error);
    }
}

const loadPokemons = async () => {
    const pokemons = await getPokemons();
    const pokemonList = document.getElementById('pokemon-list');
    
    for (let index = 0; index < pokemons.results.length; index++) {
        const pokemon = pokemons.results[index];
        try {
            const response = await axios.get(pokemon.url);
            const data = response.data;
            console.log(data);

            const pokemonCard = document.createElement('div');
            pokemonCard.className = 'pokemon mx-2 my-2 bg-white rounded-md shadow-md flex flex-col items-center justify-center size-72';

            pokemonCard.innerHTML = `
                <div class="pokemon-image size-48">
                    <button onClick="playCry('${data.cries.latest}')">
                        <img class="sprite" 
                            src="${data.sprites.other["official-artwork"].front_default}" 
                            srcset="${data.sprites.other["official-artwork"].front_default} 1x, ${data.sprites.other["official-artwork"].front_default}@2x.webp 2x" 
                            type="image/webp"
                            alt="${pokemon.name}" 
                            class="w-32 h-32" 
                        >
                    </button>
                </div>
                <div class="pokemon-data">
                    <div class="name-wrapper flex flex-row">
                        <p class="pokemon-id">${index + 1} </p>
                        <h2 class="pokemon-name">${pokemon.name}</h2>
                    </div>
                </div>
            `;

            pokemonList.appendChild(pokemonCard);
        } catch (error) {
            console.error(error);
        }
    }
}