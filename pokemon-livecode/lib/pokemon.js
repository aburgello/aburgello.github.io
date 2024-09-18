const pokemonListContainer = document.getElementById('pokemon-list');
const catchButton = document.getElementById('catch-button');
const pokemonSelect = document.getElementById('pokemon-select');
const resultMessage = document.getElementById('result-message');
const playerNameInput = document.getElementById('player-name-input');
const playerNameDisplay = document.getElementById('player-name');   
const pokemonCaughtCount = document.getElementById('pokemon-caught-count');
const caughtPokemonList = document.getElementById('caught-pokemon-list');

async function fetchPokemonData() {
  try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=50');
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
      console.error('pokémonSelect element not found');
    }
  } catch (error) {
    console.error('Error fetching Pokémon data:', error);
  }
}

alert('Please select a Pokémon to catch.', { class: 'custom-alert' });


fetchPokemonData().then(() => {
  catchButton.addEventListener('click', () => {
    const selectedPokemon = pokemonSelect.value;
    if (selectedPokemon) {
      const isShiny = Math.random() < 1 / 10;
      if (isShiny) {
        resultMessage.textContent = `Congratulations! You caught a shiny ${selectedPokemon}!`;
        resultMessage.classList.add('shiny-animation');
        updatePokemonCaughtCount();
        updatePokedex(`Shiny ${selectedPokemon}!`);
      } else {
        resultMessage.textContent = `You caught ${selectedPokemon}.`;
        resultMessage.classList.remove('shiny-animation');
        updatePokemonCaughtCount();
        updatePokedex(selectedPokemon);
        
      }
      }
     else {
      alert('Please select a Pokémon to catch.', { class: 'custom-alert' });
    }
  });
});

function updatePokemonCaughtCount() {
  let caughtCount = parseInt(localStorage.getItem('pokémonCaughtCount')) || 0;
  caughtCount++;
  pokemonCaughtCount.textContent = caughtCount;
  localStorage.setItem('pokémonCaughtCount', caughtCount);
}

function initializePlayerProfile() {
  const storedPlayerName = localStorage.getItem('playerName');
  if (storedPlayerName) {
    playerNameDisplay.textContent = storedPlayerName;
  } else {
    const name = prompt('Enter your name:');
    if (name) {
      localStorage.setItem('playerName', name);
      playerNameDisplay.textContent = name;
    }
  }
}


initializePlayerProfile();

function updatePokedex(pokemonName) {
  const caughtPokemon = JSON.parse(localStorage.getItem('caughtPokémon')) || [];
  caughtPokemon.push(pokemonName);
  localStorage.setItem('caughtPokémon', JSON.stringify(caughtPokemon));

  const li = document.createElement('li');
  li.textContent = pokemonName;
  caughtPokemonList.appendChild(li);
}