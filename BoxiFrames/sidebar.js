async function loadGames() {
    // Fetch directory listing for Games folder
    const response = await fetch("Games/");
    const text = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");

    const links = [...doc.querySelectorAll("a")];
    const gameFolders = links
        .map(a => a.getAttribute("href"))
        .filter(h => h && h.endsWith("/"))
        .filter(h => h !== "../");

    const allGames = gameFolders.map(folder => {
        const cleanName = folder.replace("/", "");
        return {
            name: cleanName,
            url: "Games/" + folder,
            thumbnail: "Thumbnails/" + cleanName + ".png"
        };
    });

    function shuffle(arr) {
        return arr.sort(() => Math.random() - 0.5);
    }

    const picks = shuffle([...allGames]).slice(0, 5);
    const sidebar = document.getElementById("suggested-list");

    for (let game of picks) {
        const div = document.createElement("div");
        div.className = "suggested-item";

        const img = document.createElement("img");
        img.src = game.thumbnail;
        img.onerror = () => {
            img.style.display = "none"; // hide broken image
        };
        img.className = "thumbnail";

        const label = document.createElement("div");
        label.textContent = game.name;
        label.className = "game-label";

        div.appendChild(img);
        div.appendChild(label);

        div.onclick = () => window.location.href = game.url;

        sidebar.appendChild(div);
    }

    // Add placeholders if fewer than 5 games
    for (let i = picks.length; i < 5; i++) {
        const placeholder = document.createElement("div");
        placeholder.className = "suggested-placeholder";
        sidebar.appendChild(placeholder);
    }
}

loadGames();
