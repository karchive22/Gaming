async function loadGames() {
    // Fetch the directory listing HTML
    const response = await fetch("/Gaming/BoxiFrames/Games/");
    const text = await response.text();

    // Parse the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");

    // Extract folder names from <a> tags
    const links = [...doc.querySelectorAll("a")];
    const gameFolders = links
        .map(a => a.getAttribute("href"))
        .filter(h => h.endsWith("/"))
        .filter(h => h !== "../"); // ignore parent folder

    // Convert folder names into game objects
    const allGames = gameFolders.map(folder => {
        const cleanName = folder.replace("/", "");
        return {
            name: cleanName,
            url: "/Gaming/BoxiFrames/Games/" + folder
        };
    });

    // Shuffle the list
    function shuffle(arr) {
        return arr.sort(() => Math.random() - 0.5);
    }

    // Pick 5 random games
    const picks = shuffle([...allGames]).slice(0, 5);

    // Sidebar container
    const sidebar = document.getElementById("suggested-list");

    // Add real game entries
    picks.forEach(game => {
        const div = document.createElement("div");
        div.className = "suggested-item";
        div.textContent = game.name;
        div.onclick = () => window.location.href = game.url;
        sidebar.appendChild(div);
    });

    // Add black placeholders if fewer than 5 games exist
    for (let i = picks.length; i < 5; i++) {
        const placeholder = document.createElement("div");
        placeholder.className = "suggested-placeholder";
        sidebar.appendChild(placeholder);
    }
}

// Run the auto-discovery
loadGames();
