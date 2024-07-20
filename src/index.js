document.addEventListener('DOMContentLoaded', () => {
    // Fetch and display all pups
    fetchPups();
  
    // Handle filter button click
    document.getElementById('filter-good-dogs').addEventListener('click', (event) => {
      const filterButton = event.target;
      const filterOn = filterButton.textContent.includes('ON');
      
      fetchPups(filterOn);
      
      filterButton.textContent = filterOn ? 'Filter good dogs: OFF' : 'Filter good dogs: ON';
    });
  });
  
  function fetchPups(onlyGoodDogs = false) {
    fetch('http://localhost:3000/pups')
      .then(response => response.json())
      .then(pups => {
        const dogBar = document.getElementById('dog-bar');
        dogBar.innerHTML = '';
        
        const filteredPups = onlyGoodDogs ? pups.filter(pup => pup.isGoodDog) : pups;
        
        filteredPups.forEach(pup => {
          const span = document.createElement('span');
          span.textContent = pup.name;
          span.dataset.id = pup.id;
          span.addEventListener('click', () => showPupInfo(pup));
          dogBar.appendChild(span);
        });
      });
  }
  
  function showPupInfo(pup) {
    const dogInfo = document.getElementById('dog-info');
    dogInfo.innerHTML = `
      <img src="${pup.image}" />
      <h2>${pup.name}</h2>
      <button id="good-dog-button">${pup.isGoodDog ? 'Good Dog!' : 'Bad Dog!'}</button>
    `;
    
    // Handle Good Dog/Bad Dog Button
    const goodDogButton = document.getElementById('good-dog-button');
    goodDogButton.addEventListener('click', () => toggleGoodDog(pup));
  }
  
  function toggleGoodDog(pup) {
    const updatedStatus = !pup.isGoodDog;
    
    fetch(`http://localhost:3000/pups/${pup.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isGoodDog: updatedStatus }),
    })
    .then(response => response.json())
    .then(updatedPup => {
      showPupInfo(updatedPup); // Refresh pup info with updated status
      fetchPups(document.getElementById('filter-good-dogs').textContent.includes('ON')); // Refresh the dog bar with the current filter status
    });
  }
  