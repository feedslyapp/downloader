const express = require("express");
const cors = require("cors");
const YTDlpWrap = require("yt-dlp-wrap").default;
const path = require("path");

const app = express();
// Render provides the PORT environment variable.
// We use 3000 for local development as a fallback.
const PORT = process.env.PORT || 3000;

const ytDlpWrap = new YTDlpWrap();

app.use(cors());
app.use(express.json());

// This is key: It serves all the files in the root directory (index.html, etc.)
// This makes our single server deployment possible.
app.use(express.static(path.join(__dirname)));

app.post("/download", async (req, res) => {
	const videoUrl = req.body.url;
	if (!videoUrl) {
		return res.status(400).json({ error: "Video URL is required." });
	}

	try {
		console.log(`Fetching metadata for: ${videoUrl}`);
		const metadata = await ytDlpWrap.getVideoInfo(videoUrl);

		// Filter for a few useful formats
		const formats = metadata.formats
			.filter(
				(f) =>
					f.vcodec !== "none" &&
					f.acodec !== "none" &&
					f.ext === "mp4"
			)
			.map((f) => ({
				quality: f.format_note,
				url: f.url,
			}))
			.slice(0, 3); // Limit to 3 formats for simplicity

		// Add an audio-only option
		const audioOnly = metadata.formats.find(
			(f) => f.vcodec === "none" && f.acodec !== "none"
		);
		if (audioOnly) {
			formats.push({
				quality: "Audio Only (m4a)",
				url: audioOnly.url,
			});
		}

		const response = {
			title: metadata.title,
			thumbnail: metadata.thumbnail,
			formats: formats,
		};

		res.json(response);
	} catch (error) {
		console.error(error);
		res.status(500).json({
			error: "Failed to fetch video information. The link may be invalid or unsupported.",
		});
	}
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
