const pokemonListContainer = document.getElementById('pokemon-list');
const catchButton = document.getElementById('catch-button');
const pokemonSelect = document.getElementById('pokemon-select');
const resultMessage = document.getElementById('result-message');
const playerNameInput = document.getElementById('player-name-input');
const playerNameDisplay = document.getElementById('player-name');   
const pokemonCaughtCount = document.getElementById('pokemon-caught-count');
const caughtPokemonList = document.getElementById('caught-pokemon-list');
const pokemonSprite = document.getElementById('pokemon-sprite');
const shinyCountValue = document.getElementById('shiny-count-value');
const shinyCaughtCount = document.getElementById('shiny-count-value');

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


fetchPokemonData().then(() => {
  catchButton.addEventListener('click', () => {
    const selectedPokemon = pokemonSelect.value;
    if (selectedPokemon) {
      const isShiny = Math.random() < 1 / 800;
      if (isShiny) {
        const shinySpriteUrl = pokemonSelect.querySelector(`option[value="${selectedPokemon}"]`).dataset.shinySpriteUrl;
        pokemonSprite.src = shinySpriteUrl;
        resultMessage.textContent = `Congratulations! You caught a shiny ${selectedPokemon}!`;
        resultMessage.classList.add('shiny-animation');
        isShinyCaught = true;
        updatePokemonCaughtCount();
        updatePokedex(selectedPokemon);
        let shinyCount = parseInt(localStorage.getItem('shinyCaughtCount')) || 0;
        shinyCount++;
        shinyCaughtCount.textContent = shinyCount;
        localStorage.setItem('shinyCaughtCount', shinyCount);
      } else {
        resultMessage.textContent = `You caught ${selectedPokemon}.`;
        resultMessage.classList.remove('shiny-animation');
        updatePokemonCaughtCount();
        updatePokedex(selectedPokemon);
        pokemonSprite.src = pokemonSelect.querySelector(`option[value="${selectedPokemon}"]`).dataset.spriteUrl;
      }

      resultMessage.innerHTML = `
        <img id="pokemon-sprite" src="${pokemonSprite.src}" alt="${selectedPokemon} Sprite">
        <div>${selectedPokemon}</div>`;
      
    } else {
      Swal.fire({
      title: 'Please select a Pokémon to catch.',
      icon: "warning",
            
    });
      
    }
    
    if (isShinyCaught) {
      Swal.fire({
        title: `Well done, you caught a shiny ${selectedPokemon}!`,
        icon: "success"
      });
      catchButton.disabled = true;
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

  const caughtPokemonList = document.getElementById('caught-pokemon-list');

  const pokemonBoxTemplate = document.getElementById('pokemon-box-template');
  const pokemonBox = pokemonBoxTemplate.content.cloneNode(true);
  
  if (isShinyCaught) {
    pokemonBox.querySelector('img').src = pokemonSelect.querySelector(`option[value="${pokemonName}"]`).dataset.shinySpriteUrl;
    pokemonBox.querySelector('p').textContent = `Shiny ${pokemonName}`;
  } else {
    pokemonBox.querySelector('img').src = pokemonSelect.querySelector(`option[value="${pokemonName}"]`).dataset.spriteUrl;
    pokemonBox.querySelector('p').textContent = pokemonName;
  }


  const columnCount = caughtPokemonList.children.length;
  const targetColumn = caughtPokemonList.children.find(column => column.children.length < columnCount);
  if (targetColumn) {
    targetColumn.appendChild(pokemonBox);
  }
}
