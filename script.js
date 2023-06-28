let page = 1; // Página inicial
let isLoading = false; // Bandera para evitar múltiples solicitudes

function fetchCharacters() {
  if (isLoading) return;

  isLoading = true;

  fetch(`https://rickandmortyapi.com/api/character?page=${page}`)
    .then((response) => response.json())
    .then((data) => {
      const characterContainer = document.getElementById("character-container");

      // Iterar sobre los resultados y crear las tarjetas de personajes
      data.results.forEach((character) => {
        const characterCard = document.createElement("div");
        characterCard.classList.add("character-card");

        const characterImage = document.createElement("img");
        characterImage.classList.add("character-image");
        characterImage.src = character.image;

        const characterName = document.createElement("p");
        characterName.classList.add("character-name");
        characterName.textContent = character.name;

        characterCard.appendChild(characterImage);
        characterCard.appendChild(characterName);

        // Añade un evento click al personaje para mostrar la información detallada en una modal
        characterCard.addEventListener("click", () => {
          showCharacterDetails(character);
        });

        characterContainer.appendChild(characterCard);
      });

      isLoading = false;
      page++; // Incrementa la página para cargar más personajes
    })
    .catch((error) => {
      console.log(error);
      isLoading = false;
    });
}

// Función para verificar si el usuario ha llegado al final de la página
function isBottomOfPage() {
  return window.innerHeight + window.scrollY >= document.body.offsetHeight;
}

// Evento scroll para cargar más personajes al llegar al final de la página
window.addEventListener("scroll", () => {
  if (isBottomOfPage()) {
    fetchCharacters();
  }
});

// Carga los personajes iniciales
fetchCharacters();

function showCharacterDetails(character) {
  // Crea el contenido HTML de la modal con la información del personaje
  const modalContent = `
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">${character.name}</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <img src="${character.image}" alt="${character.name}" class="character-image">
          <p class="character-info"><strong class="status-label">Status:</strong> ${character.status}</p>
          <p class="character-info"><strong class="species-label">Species:</strong> ${character.species}</p>
          <p class="character-info"><strong class="gender-label">Gender:</strong> ${character.gender}</p>
          <p class="character-info"><strong class="location-label">Location:</strong> ${character.location.name}</p>
        </div>
      </div>
    </div>
  `;

  // Crea la modal y muestra el contenido
  const modal = document.createElement("div");
  modal.classList.add("modal", "fade");
  modal.innerHTML = modalContent;

  document.body.appendChild(modal);

  // Activa la modal
  $(modal).modal("show");

  // Elimina la modal del DOM al cerrarla
  $(modal).on("hidden.bs.modal", function () {
    document.body.removeChild(modal);
  });
}
