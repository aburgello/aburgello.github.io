const pokemonListContainer = document.getElementById('pokemon-list');
const catchButton = document.getElementById('catch-button');
const pokemonSelect = document.getElementById('pokemon-select');
const resultMessage = document.getElementById('result-message');
const playerNameInput = document.getElementById('player-name-input');
const playerNameDisplay = document.getElementById('player-name');   
const pokemonCaughtCount = document.getElementById('pokemon-caught-count');
const caughtPokemonList = document.getElementById('caught-pokemon-list');
const pokemonSprite = document.getElementById('pokemon-sprite');

async function fetchPokemonDetails(pokemonName) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
  const data = await response.json();
  return data;
}

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

        fetchPokemonDetails(pokemon.name).then(details => {
          option.dataset.spriteUrl = details.sprites.front_default;
          option.dataset.shinySpriteUrl = details.sprites.front_shiny;
        });
      });
    } else {
      console.error('pokemonSelect element not found');
    }
  } catch (error) {
    console.error('Error fetching Pokémon data:', error);
  }
}

let isShinyCaught = false;

if (isShinyCaught === false) {

fetchPokemonData().then(() => {
  catchButton.addEventListener('click', () => {
    const selectedPokemon = pokemonSelect.value;
    if (selectedPokemon) {
      const isShiny = Math.random() < 1 / 1365;
      if (isShiny) {
        resultMessage.textContent = `Congratulations! You caught a shiny ${selectedPokemon}!`;
        resultMessage.classList.add('shiny-animation');
        updatePokemonCaughtCount();
        updatePokedex(`Shiny ${selectedPokemon}!`);
        const shinySpriteUrl = pokemonSelect.querySelector(`option[value="${selectedPokemon}"]`).dataset.shinySpriteUrl;
        pokemonSprite.src = shinySpriteUrl;
        isShinyCaught = true;
      } else {
        resultMessage.textContent = `You caught ${selectedPokemon}.`;
        resultMessage.classList.remove('shiny-animation');
        updatePokemonCaughtCount();
        updatePokedex(selectedPokemon);
        pokemonSprite.src = pokemonSelect.querySelector(`option[value="${selectedPokemon}"]`).dataset.spriteUrl;
      }

      resultMessage.innerHTML = `
        <img src="${pokemonSprite.src}" alt="${selectedPokemon} Sprite">
        <div>${selectedPokemon}</div>
      `;
      if (isShinyCaught) {
        alert('A shiny Pokémon has been caught! The game is over.');
        catchButton.disabled = true;
        return;
      }
    } else {
      alert('Please select a Pokémon to catch.');
    }
  });
});
}

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
