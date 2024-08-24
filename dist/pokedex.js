const getPokemons = async () => {
    try {
        const params = new URLSearchParams(window.location.search);
        let offset = params.get('offset');
        let limit = params.get('limit');
        let i = 0;

        deployLoadingScreen(getRecentRegion());
        const factBox = document.querySelector('.region-fact');

        if(offset == 999 && limit == 999) { // If it's not the Hisui region, defined as 0 and 0
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
                        updateLoadingScreen(i, pokedex.length);
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
            let trueLimit = limit - offset;
            let response = await axios.get(`https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${trueLimit - 1}`);
            let data = await response.data;
            let poke = [];
            for (let pokemon of data.results) {
                let response = await axios.get(pokemon.url);
                let data = await response.data;
                poke.push(data);
                i++;
                updateLoadingScreen(i, trueLimit);
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

const deployLoadingScreen = (region) => {

    const mainContent = document.querySelector('.content-wrapper');

    const loadingScreen = `<div class="loading-screen mx-auto" id="loading-screen"> 

        <section class="facts-container">
            <h1 class="text-5xl mb-2" id="region-title"> Now accesing: ${region} </h1>   
            <div class="facts-info">
                <h2 class="title text-3xl">Did you know?</h2>
                <p class="region-fact">${getRandomFact(region, 'spanish')}</p>
            </div>
        </section>

        <div class="progress-wrapper">
            <div class="progress-area">
                <div class="progress-bar"></div>
                <div class="flex justify-center content-center m-10 margin-flexible"> 
                    <div class="progress-number font-medium text-xl"> 0 / 151 </div>
                </div
            </div>                
        </div>

    </div>`;

    mainContent.innerHTML = loadingScreen;
}

const updateLoadingScreen = (index, limit) => {
    const progressBar = document.querySelector('.progress-bar');
    const progressWidth = (index * 100) / limit;
    progressBar.style.width = `${progressWidth}%`;

    const progressNumber = document.querySelector('.progress-number');
    progressNumber.innerHTML = `${index} / ${limit - 1}`;

}

const removeLoadingScreen = async () => {
    const loadingScreen = document.getElementById('loading-screen');
    await new Promise(resolve => setTimeout(resolve, 2000));
    loadingScreen.remove();
    console.log('All pokemon loaded');
}

const loadPokedex = async () => {
    const pokemons = await getPokemons();
    const mainContent = document.querySelector('.content-wrapper');
    const pokemonList = document.createElement('div');
    pokemonList.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 justify-items-center mx-0 md:mx-4';
    pokemonList.id = 'pokemon-list';
    mainContent.appendChild(pokemonList);

    let index = 0;

    await removeLoadingScreen();

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

    const backToTopButton = document.createElement('button');
    backToTopButton.className = 'back-to-top-button';
    backToTopButton.innerHTML = 'Back to Top';
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    mainContent.appendChild(backToTopButton);
}

const enterPokemon = async (pokemon) => {
    let url = `./pokemon.html?name=${pokemon}`;

    window.location.href = url;

    console.log(url);
}