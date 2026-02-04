async function loadSuggestedGames() {
    try {
        // Fetch the Games directory listing from the correct absolute path
        const response = await fetch("/Gaming/BoxiFrames/Games/");
        const text = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");

        // Get all folder links (ending with "/"), ignore external links
        const folders = [...doc.querySelectorAll("a")]
            .map(a => a.getAttribute("href"))
            .filter(href =>
                href &&
                href.endsWith("/") &&
                !href.startsWith("http")
            );

        // Build game entries from folder names
        const games = folders.map(folder => {
            // "drifthunters/" -> "drifthunters"
            const name = folder.replace("/", "");

            const displayName = name
                .replace(/-/g, " ")
                .replace(/\b\w/g, c => c.toUpperCase());

            return {
                name: displayName,
                // Open the game folder directly (same pattern as your "Fullscreen or Glitched?" link)
                url: `Games/${name}/`,
                // Thumbnails assumed in /Gaming/Thumbnails/[name].png
                thumbnail: `../Thumbnails/${name}.png`
            };
        });

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
                window.location.href = game.url;
            };

            list.appendChild(item);
        });

    } catch (err) {
        console.error("Error loading suggested games:", err);
    }
}

loadSuggestedGames();

