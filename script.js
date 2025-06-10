const form = document.getElementById("download-form");
const urlInput = document.getElementById("video-url");
const submitButton = document.getElementById("submit-button");
const statusMessage = document.getElementById("status-message");
const resultsContainer = document.getElementById("results-container");

form.addEventListener("submit", async (event) => {
	event.preventDefault();
	const videoUrl = urlInput.value;

	resultsContainer.innerHTML = "";
	statusMessage.textContent = "";
	statusMessage.classList.remove("error");

	if (!videoUrl) {
		statusMessage.textContent = "Please enter a URL.";
		statusMessage.classList.add("error");
		return;
	}

	submitButton.disabled = true;
	submitButton.textContent = "Processing...";
	statusMessage.textContent = "Fetching video data";
	statusMessage.classList.add("loading");

	try {
		// CRITICAL CHANGE HERE: Use a relative URL.
		// This will send the request to the same server that served the page,
		// which works perfectly for both local and Render deployment.
		const response = await fetch("/download", {
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
		submitButton.disabled = false;
		submitButton.textContent = "Download";
		statusMessage.classList.remove("loading");
		if (!statusMessage.classList.contains("error")) {
			statusMessage.textContent = "";
		}
	}
});

function displayResults(data) {
	const { title, thumbnail, formats } = data;

	let linksHtml = "";
	formats.forEach((format) => {
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
