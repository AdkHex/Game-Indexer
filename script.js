document.getElementById("search-btn").addEventListener("click", searchGame);
document.getElementById("filter-repack").addEventListener("change", searchGame);
document.getElementById("sort-options").addEventListener("change", searchGame);
document.getElementById("theme-toggle").addEventListener("click", toggleTheme);

async function searchGame() {
    const query = document.getElementById("search-input").value.trim();
    const repackFilter = document.getElementById("filter-repack").value;
   // const sortOption = document.getElementById("sort-options").value;

    if (query === "") {
        alert("Please enter a game name to search.");
        return;
    }

    const apiUrl = `http://localhost:{Your Local Host ID}/search?q=${encodeURIComponent(query)}&repacks=fitgirl,steamrip`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data && data.results && data.results.length > 0) {
            let filteredResults = filterResults(data.results, repackFilter);
           // filteredResults = sortResults(filteredResults, sortOption);
            displayResults(filteredResults);
        } else {
            document.getElementById("results").innerHTML = "<p>No results found for this search.</p>";
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to fetch search results. Please try again later.");
    }
}

function filterResults(results, repackFilter) {
    if (repackFilter === "all") {
        return results;
    }
    return results.filter(result => result.repack === repackFilter);
}

function sortResults(results, sortOption) {
    if (sortOption === "name") {
        return results.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "version") {
        return results.sort((a, b) => {
            const versionA = a.version || "";
            const versionB = b.version || "";
            return versionA.localeCompare(versionB);
        });
    }
    return results;
}

function displayResults(results) {
    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = "";

    results.forEach(result => {
        const resultElement = document.createElement("div");
        resultElement.classList.add("result-item");

        const gameTitle = result.name || "Unknown Game";
        const gameVersion = result.version ? `Version: ${result.version}` : "No version info";
        const gameLink = result.url || "#";
        const repackSource = result.repack || "Unknown Source";

        resultElement.innerHTML = `
            <h3>${gameTitle}</h3>
            <p>${gameVersion}</p>
            <a href="${gameLink}" target="_blank">Download</a>
            <p class="repack-info">Repack: <span class="repack-source ${repackSource}">${repackSource}</span></p>
        `;

        resultsContainer.appendChild(resultElement);
    });
}

function toggleTheme() {
    const body = document.body;
    const container = document.querySelector(".container");
    const themeToggle = document.getElementById("theme-toggle");

    // Toggle theme class on body and container
    body.classList.toggle("light-mode");
    container.classList.toggle("light-mode");
    themeToggle.classList.toggle("light-mode");

    // Update theme toggle button text (🌙 for dark, ☀️ for light)
    themeToggle.textContent = body.classList.contains("light-mode") ? "☀️" : "🌙";
}
