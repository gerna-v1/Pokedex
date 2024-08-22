const getPokemons = async () => {
    try {
        const params = new URLSearchParams(window.location.search);
        let offset = params.get('offset');
        let limit = params.get('limit');
        let i = 0;

        if(offset == 0 && limit == 0) {
            try {
                let response = await axios.get('https://pokeapi.co/api/v2/pokedex/30/');
                let data = await response.data;
                let pokedex = data.pokemon_entries;
                console.log(pokedex);

                var poke = [];
                
                for (let pokemon  of pokedex) {
                    try {
                        let response = await axios.get(`${pokemon.pokemon_species.url}`);
                        let id = await response.data.pokedex_numbers[0].entry_number;
                        let pokeresponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
                        let pokedata = await pokeresponse.data;
                        poke.push(pokedata);                        
                        i++;
                        console.log(i);
                    } catch (error) {
                        console.error(error);
                    }
                }
                console.log(poke);
                console.log(pokedex);
                return poke;
            } catch (error) {
                console.error(error);
            }
        } else {
            let response = await axios.get(`https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${(limit - offset) - 1}`);
            let data = await response.data;
            let poke = [];
            for (let pokemon of data.results) {
                let response = await axios.get(pokemon.url);
                let data = await response.data;
                poke.push(data);
                i++;
                console.log(i);
            }

            console.log(poke); 
            return poke;
        }
    } catch (error) {
        console.error(error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    loadPokedex();
});

const loadPokedex = async () => {
    const pokemons = await getPokemons();
    const pokemonList = document.getElementById('pokemon-list');

    let index = 0;
    
    for (pokemon of pokemons) {
        try {
            let data = pokemon;
            console.log(data);

            const pokemonCard = document.createElement('div');
            pokemonCard.className = 'pokemon mx-2 my-2 bg-white rounded-md shadow-md flex flex-col items-center justify-center size-72';

            pokemonCard.innerHTML = `
                <div class="pokemon-image size-52">
                    <button onClick="enterPokemon('${pokemon.name}')">
                        <img class="sprite" 
                            src="${pokemon.sprites.other["official-artwork"].front_default}" 
                            srcset="${pokemon.sprites.other["official-artwork"].front_default} 1x, ${pokemon.sprites.other["official-artwork"].front_default}@2x.webp 2x" 
                            type="image/webp"
                            alt="${pokemon.species.name}" 
                            class="w-32 h-32" 
                        >
                    </button>
                </div>
                <div class="pokemon-data">
                    <div class="name-wrapper flex flex-row">
                        <p class="pokemon-id">${index + 1} </p>
                        <h2 class="pokemon-name">${pokemon.species.name}</h2>
                    </div>
                </div>
            `;

            index++;

            pokemonList.appendChild(pokemonCard);
        } catch (error) {
            console.error(error);
        }
    }
}

const enterPokemon = async (pokemon) => {
    let url = `./pokemon.html?name=${pokemon}`;

    window.location.href = url;

    console.log(url);
}