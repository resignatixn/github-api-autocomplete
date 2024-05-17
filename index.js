function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function fetchRepositories(query) {
  const menu = document.getElementById("autocomplete-menu");
  if (!query) {
    menu.innerHTML = "";
    return;
  }
  fetch(`https://api.github.com/search/repositories?q=${query}&per_page=5`)
    .then((response) => response.json())
    .then((data) => {
      menu.innerHTML = "";
      if (data.items.length === 0) {
        menu.innerHTML = "<div>No results</div>";
      } else {
        data.items.forEach((repo) => {
          const item = document.createElement("div");
          item.textContent = repo.name;
          item.onclick = () => {
            addRepository(repo);
            document.getElementById("search-input").value = "";
            menu.innerHTML = "";
          };
          menu.appendChild(item);
        });
      }
    })
    .catch((error) => {
      console.log(error);
      menu.innerHTML = "<div>No results</div>";
    });
}

function addRepository(repo) {
  const list = document.getElementById("repository-list");
  const item = document.createElement("div");
  item.innerHTML = `
      <div>
      <p>${repo.name}</p>
      <p>Владелец: ${repo.owner.login}</p>
      <p>Звезды: ${repo.stargazers_count}</p>
      </div>
    <button onclick="this.parentNode.remove()">Х</button>
  `;
  list.appendChild(item);
}

document.getElementById("search-input").oninput = debounce((e) => {
  fetchRepositories(e.target.value);
}, 500);
