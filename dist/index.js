var poke;
var div = document.querySelector('#container');

const cargarPaises = () => {
    axios.get('https://pokeapi.co/api/v2/pokemon')
    .then(function (response) {
        // handle success
        console.log(response);
        poke = response.data.results;
        div.innerHTML = JSON.stringify(poke);
    })
    .catch(function (error) {
        console.log(error);
    });
};    

document.addEventListener('DOMContentLoaded', () => {
    div = document.querySelector('#container');
    cargarPaises();
})
    

