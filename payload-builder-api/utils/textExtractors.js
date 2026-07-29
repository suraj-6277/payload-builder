const mammoth = require("mammoth");
const pdfParse = require("pdf-parse");
const Tesseract = require("tesseract.js");

// .docx -> raw text
async function extractFromDocx(buffer) {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

// .pdf -> raw text
async function extractFromPdf(buffer) {
  const result = await pdfParse(buffer);
  return result.text;
}

// .png / .jpg / .jpeg -> OCR text
async function extractFromImage(buffer) {
  const { data } = await Tesseract.recognize(buffer, "eng");
  return data.text;
}

async function extractText(buffer, filename) {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".docx")) return extractFromDocx(buffer);
  if (lower.endsWith(".pdf")) return extractFromPdf(buffer);
  if (lower.endsWith(".png") || lower.endsWith(".jpg") || lower.endsWith(".jpeg")) {
    return extractFromImage(buffer);
  }
  throw new Error("Unsupported file type");
}

module.exports = { extractText, extractFromDocx, extractFromPdf, extractFromImage };
