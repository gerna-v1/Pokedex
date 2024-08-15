var poke;

const cargarPaises = () => {
    axios.get('https://pokeapi.co/api/v2/pokemon?limit=60')
    .then(function (response) {
        // handle success
        console.log(response);
        poke = response.data.results;
    })
    .catch(function (error) {
        console.log(error);
    });
    };    


document.addEventListener('DOMContentLoaded', () => {
    cargarPaises();
})