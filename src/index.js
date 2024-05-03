document.addEventListener("DOMContentLoaded", () => {
    const dogTable = document.getElementById("table-body");
    const dogForm = document.getElementById("dog-form");
  
    const fetchAndRenderDogs = async () => {
      const response = await fetch("http://localhost:3000/dogs");
      const dogs = await response.json();
      dogTable.innerHTML = dogs.map(dog => `
        <tr>
          <td class='padding'>${dog.name}</td>
          <td class='padding'>${dog.breed}</td>
          <td class='padding'>${dog.sex}</td>
          <td class='padding'><button class="edit-btn" data-id="${dog.id}">Edit</button></td>
        </tr>
      `).join("");
  
      document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", async (e) => {
          e.preventDefault();
          const dogId = e.target.dataset.id;
          const dogResponse = await fetch(`http://localhost:3000/dogs/${dogId}`);
          const dogData = await dogResponse.json();
          populateForm(dogData);
        });
      });
    };
  
    const populateForm = (dog) => {
      dogForm.name.value = dog.name;
      dogForm.breed.value = dog.breed;
      dogForm.sex.value = dog.sex;
      dogForm.dataset.id = dog.id;
    };
  
    dogForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const dogId = dogForm.dataset.id;
      const formData = new FormData(dogForm);
      const updatedDog = Object.fromEntries(formData.entries());
  
      await fetch(`http://localhost:3000/dogs/${dogId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedDog)
      });
  
      await fetchAndRenderDogs();
      dogForm.reset();
    });
  
    fetchAndRenderDogs();
  });