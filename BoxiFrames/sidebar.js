async function loadSuggestedGames() {
    try {
        const response = await fetch("/Gaming/BoxiFrames/Games/");
        const text = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");

        const folders = [...doc.querySelectorAll("a")]
            .map(a => a.getAttribute("href"))
            .filter(href =>
                href &&
                href.endsWith("/") &&
                !href.startsWith("http")
            );

        const games = folders.map(folder => {
            const name = folder.replace("/", "");

            const displayName = name
                .replace(/-/g, " ")
                .replace(/\b\w/g, c => c.toUpperCase());

            return {
                name: displayName,
                url: `${name}iframe.html`,
                thumbnail: `../Thumbnails/${name}.png`
            };
        });

        const list = document.getElementById("suggested-list");
        if (!list) return;

        list.innerHTML = "";

        const selected = games.sort(() => Math.random() - 0.5);

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
        console.error("Sidebar load error:", err);
    }
}

loadSuggestedGames();
