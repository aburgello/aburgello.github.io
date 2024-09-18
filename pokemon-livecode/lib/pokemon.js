const template = document.getElementById("cardTemplate");
const infoTemplate = document.getElementById("infoTemplate");
const container = document.getElementById("cardsContainer");
const infoContainer = document.getElementById("infoContainer");

fetch("https://pokeapi.co/api/v2/pokemon")
  .then((response) => response.json())
  .then((data) => {
    data.results.forEach((pokemon) => {
      const name = pokemon.name;
      fetch(pokemon.url)
        .then((response) => response.json())
        .then((data) => {
          const image = data.sprites.front_default;
          const types = data.types.map((type_element) => type_element.type.name).join(" - ");
          const clone = template.content.cloneNode(true);
          clone.querySelector("img").src = image;
          clone.querySelector("h2").textContent = name;
          clone.querySelector("p").textContent = types;

          clone.querySelector("a").addEventListener("click", () => {
            const cloneInfo = infoTemplate.content.cloneNode(true);
            cloneInfo.querySelector("img").src = image;
            cloneInfo.querySelector("h2").textContent = name;
            cloneInfo.querySelector("p").textContent = types;
            infoContainer.innerHTML = "";
            infoContainer.appendChild(cloneInfo);
          });

          container.appendChild(clone);
        });
    });
  });
