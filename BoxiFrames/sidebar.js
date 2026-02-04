async function loadSidebar() {
    try {
        // Always fetch the absolute Games directory
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
            // "retrobowl/" -> "retrobowl"
            const name = folder.replace("/", "");

            const displayName = name
                .replace(/-/g, " ")
                .replace(/\b\w/g, c => c.toUpperCase());

            return {
                name: displayName,
                // iframe lives in /Gaming/BoxiFrames/[name]iframe.html
                url: `/Gaming/BoxiFrames/${name}iframe.html`,
                thumbnail: `/Gaming/Thumbnails/${name}.png`
            };
        });

        // Shuffle and pick up to 5
        const selected = games.sort(() => Math.random() - 0.5).slice(0, 5);

        const container = document.getElementById("sidebar");
        if (!container) return;

        container.innerHTML = "";

        selected.forEach(game => {
            const item = document.createElement("div");
            item.className = "sidebar-item";

            item.innerHTML = `
                <img src="${game.thumbnail}" onerror="this.style.display='none'">
                <span>${game.name}</span>
            `;

            item.onclick = () => {
                window.location.href = game.url;
            };

            container.appendChild(item);
        });

    } catch (err) {
        console.error("Sidebar load error:", err);
    }
}

loadSidebar();
