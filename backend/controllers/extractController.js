const { extractText } = require("../utils/textExtractors");
const { extractVariablesFromText } = require("../utils/geminiClient");
exports.extractDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const rawText = await extractText(req.file.buffer, req.file.originalname);

    if (!rawText || !rawText.trim()) {
      return res.status(422).json({ error: "Could not read any text from this file" });
    }

    const fields = await extractVariablesFromText(rawText);

    res.json({
      fields,
      rawTextPreview: rawText.slice(0, 500),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Extraction failed" });
  }
};
