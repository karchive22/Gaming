async function loadSuggestedGames() {
    try {
        // Load the JSON file
        const response = await fetch("games.json");
        const games = await response.json();

        const list = document.getElementById("suggested-list");
        if (!list) return;

        list.innerHTML = "";

        // Shuffle and pick up to 5
        const selected = games.sort(() => Math.random() - 0.5).slice(0, 5);

        selected.forEach(game => {
            const item = document.createElement("div");
            item.className = "suggested-item";

            item.innerHTML = `
                <img class="thumbnail" src="${game.thumbnail}" onerror="this.style.display='none'">
                <div class="game-label">${game.name}</div>
            `;

            item.onclick = () => {
                window.location.href = game.file;
            };

            list.appendChild(item);
        });

    } catch (err) {
        console.error("Error loading suggested games:", err);
    }
}

loadSuggestedGames();

