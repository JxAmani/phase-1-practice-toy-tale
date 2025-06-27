let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");

  // Toggle form visibility
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";
  });

  // Load and render all toys
  fetchToys();

  // Handle form submission
  handleFormSubmit();
});

// GET toys from server and render
function fetchToys() {
  fetch("http://localhost:3000/toys")
    .then((res) => res.json())
    .then((toys) => {
      toys.forEach(renderToyCard);
    });
}

// Render single toy card
function renderToyCard(toy) {
  const toyCollection = document.getElementById("toy-collection");

  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar" />
    <p>${toy.likes} Likes</p>
    <button class="like-btn" id="${toy.id}">Like ❤️</button>
  `;

  // Add like functionality
  const likeBtn = card.querySelector("button");
  likeBtn.addEventListener("click", () => {
    handleLike(toy, card);
  });

  toyCollection.appendChild(card);
}

// Handle form submission (POST)
function handleFormSubmit() {
  const form = document.querySelector(".add-toy-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const image = e.target.image.value;

    const newToy = {
      name,
      image,
      likes: 0
    };

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(newToy)
    })
      .then((res) => res.json())
      .then((toy) => {
        renderToyCard(toy);
        form.reset();
      });
  });
}

// Handle toy like (PATCH)
function handleLike(toy, card) {
  const newLikes = toy.likes + 1;

  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      likes: newLikes
    })
  })
    .then((res) => res.json())
    .then((updatedToy) => {
      toy.likes = updatedToy.likes;
      card.querySelector("p").textContent = `${updatedToy.likes} Likes`;
    });
}
