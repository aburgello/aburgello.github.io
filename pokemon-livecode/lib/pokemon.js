const pokemonListContainer = document.getElementById('pokemon-list');
const catchButton = document.getElementById('catch-button');
const pokemonSelect = document.getElementById('pokemon-select');
const resultMessage = document.getElementById('result-message');

async function fetchPokemonData() {
  try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
    const data = await response.json();
    const pokemon = data.results;

    if (pokemonSelect) {
      pokemon.forEach(pokemon => {
        const option = document.createElement('option');
        option.value = pokemon.name.toUpperCase();
        option.textContent = pokemon.name.toUpperCase();
        pokemonSelect.appendChild(option);
      });
    } else {
      console.error('pokemonSelect element not found');
    }
  } catch (error) {
    console.error('Error fetching Pokemon data:', error);
  }
}

fetchPokemonData().then(() => {
  catchButton.addEventListener('click', () => {
    const selectedPokemon = pokemonSelect.value;
    if (selectedPokemon) {
      const isShiny = Math.random() < 1 / 4096;
      if (isShiny) {
        resultMessage.textContent = `Congratulations! You caught a shiny ${selectedPokemon}!`;
        resultMessage.classList.add('shiny-animation');
      } else {
        resultMessage.textContent = `You caught ${selectedPokemon}.`;
        resultMessage.classList.remove('shiny-animation');
      }
      }
     else {
      alert('Please select a Pokemon to catch.');
    }
  });
});
