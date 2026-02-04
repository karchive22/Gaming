async function loadGames() {
    // Fetch the directory listing for the Games folder (relative)
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
            url: "Games/" + folder
        };
    });

    function shuffle(arr) {
        return arr.sort(() => Math.random() - 0.5);
    }

    const picks = shuffle([...allGames]).slice(0, 5);
    const sidebar = document.getElementById("suggested-list");

    picks.forEach(game => {
        const div = document.createElement("div");
        div.className = "suggested-item";
        div.textContent = game.name;
        div.onclick = () => window.location.href = game.url;
        sidebar.appendChild(div);
    });

    for (let i = picks.length; i < 5; i++) {
        const placeholder = document.createElement("div");
        placeholder.className = "suggested-placeholder";
        sidebar.appendChild(placeholder);
    }
}

loadGames();
