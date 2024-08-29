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

    let currentLang = localStorage.getItem('language');

    const loadingScreen = `<div class="loading-screen mx-auto" id="loading-screen"> 

        <section class="facts-container">
            <h1 class="text-5xl mb-2" id="region-title"> Now accesing: ${region} </h1>   
            <div class="facts-info">
                <h2 class="title text-3xl">Did you know?</h2>
                <p class="region-fact">${getRandomFact(region, currentLang)}</p>
            </div>
        </section>

        <div class="progress-wrapper">
            <div class="progress-area">
                <div class="progress-bar"></div>
                <div class="flex justify-center content-center m-10 margin-flexible"> 
                    <div class="progress-number font-medium text-xl"> 0 / ??? </div>
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

const updateRandomFact = (region) => {
    const factBox = document.querySelector('.region-fact');
    factBox.innerHTML = getRandomFact(region, 'spanish');
};

const removeLoadingScreen = async () => {
    const loadingScreen = document.getElementById('loading-screen');
    await new Promise(resolve => setTimeout(resolve, 2000));
    loadingScreen.remove();
    console.log('All pokemon loaded');
}

const createPokemonCard = (pokemon, index) => {
    const pokemonCard = document.createElement('a');
    pokemonCard.href = `./pokemon.html?name=${pokemon.name}`;
    pokemonCard.className = 'pokemon-card';

    let image = pokemon.sprites.other["official-artwork"].front_default;

    if (image == null) {
        image = pokemon.sprites.front_default ? pokemon.sprites.front_default : '../bucket/imgs/icons/missingno.png';
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
                alt="${pokemon.species.name}" 
                class="w-32 h-32" 
            >         
        </div>
        <div class="pokemon-data">
            <div class="name-wrapper flex flex-row justify-center">
                <h2 class="pokemon-name">${pokemon.species.name}</h2>
            </div>
            <div class="pokemon-type flex flex-row justify-center">
                ${pokemon.types.map(type => `<p class="type ${type.type.name}">${type.type.name}</p>`).join('')}
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

const loadPokedex = async () => {
    const pokemons = await getPokemons();
    const mainContent = document.querySelector('.content-wrapper');
    const pokemonList = document.createElement('div');
    pokemonList.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 justify-items-center mx-0 md:mx-4';
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
    backToTop.classList.add('back-to-top-button', 'bg-white');
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