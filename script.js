const form = document.getElementById("download-form");
const urlInput = document.getElementById("video-url");
const submitButton = document.getElementById("submit-button");
const statusMessage = document.getElementById("status-message");
const resultsContainer = document.getElementById("results-container");

form.addEventListener("submit", async (event) => {
	event.preventDefault();
	const videoUrl = urlInput.value;

	// Clear previous results and messages
	resultsContainer.innerHTML = "";
	statusMessage.textContent = "";
	statusMessage.classList.remove("error");

	// Basic validation
	if (!videoUrl) {
		statusMessage.textContent = "Please enter a URL.";
		statusMessage.classList.add("error");
		return;
	}

	// UI feedback for loading
	submitButton.disabled = true;
	submitButton.textContent = "Processing...";
	statusMessage.textContent = "Fetching video data";
	statusMessage.classList.add("loading");

	try {
		// Send the URL to our backend server
		const response = await fetch("http://localhost:3000/download", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ url: videoUrl }),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || "An unknown error occurred.");
		}

		const data = await response.json();
		displayResults(data);
	} catch (error) {
		statusMessage.textContent = error.message;
		statusMessage.classList.add("error");
	} finally {
		// Restore UI
		submitButton.disabled = false;
		submitButton.textContent = "Download";
		statusMessage.classList.remove("loading");
		if (!statusMessage.classList.contains("error")) {
			statusMessage.textContent = ""; // Clear loading message on success
		}
	}
});

function displayResults(data) {
	const { title, thumbnail, formats } = data;

	let linksHtml = "";
	formats.forEach((format) => {
		// The 'download' attribute suggests a filename to the browser
		linksHtml += `<a href="${format.url}" target="_blank" download>${format.quality}</a>`;
	});

	const resultHtml = `
        <div class="result-item">
            <img src="${thumbnail}" alt="Video thumbnail" class="thumbnail">
            <div class="info">
                <h3>${title}</h3>
                <div class="download-links">
                    ${linksHtml}
                </div>
            </div>
        </div>
    `;

	resultsContainer.innerHTML = resultHtml;
}
