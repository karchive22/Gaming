async function loadSuggestedGames() {
    try {
        // Fetch the BoxiFrames directory listing
        const response = await fetch("/Gaming/BoxiFrames/");
        const text = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");

        // Find all .html files (ignore external links)
        const htmlFiles = [...doc.querySelectorAll("a")]
            .map(a => a.getAttribute("href"))
            .filter(href =>
                href &&
                href.endsWith(".html") &&
                !href.startsWith("http")
            );

        // Build game entries
        const games = htmlFiles.map(file => {
            // Remove .html → "drifthuntersiframe"
            const base = file.replace(".html", "");

            // Make readable name
            const displayName = base
                .replace(/-/g, " ")
                .replace(/\b\w/g, c => c.toUpperCase());

            return {
                name: displayName,
                url: file, // direct link to the .html file
                thumbnail: `../Thumbnails/${base}.png`
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

