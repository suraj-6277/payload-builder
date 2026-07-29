const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
const axios = require("axios");

const SYSTEM_PROMPT = `You convert a sample report document into a list of template variables.

Read the report text. Find every value that would change from report to
report (names, dates, addresses, amounts, measurements, types, ratings,
descriptions, etc). Ignore boilerplate text that stays the same across
every report of this type.

GROUP related / sub-fields into ONE object whenever they belong to the
same section or family. Do NOT emit a separate object for each sub-field.

Examples of groups:
- Boundaries (deed): North/South/East/West
- Boundaries (actual site): Actual North/South/East/West
- Nearest amenities: railway, bus stop, hospital, school, college, market, bank, highway
- Construction details that sit together, valuation figures that sit together, etc.

Standalone fields (Property ID, Owner Name, Address, etc.) stay as their
own single object.

For each object output exactly these three keys:
- "description": short group or field label
  e.g. "Nearest Amenities", "Boundaries (As Per Deed)", "Owner Name"
- "variableTemplate":
  - single field: "[[ownerName]]"
  - grouped fields: human label + placeholder for each, comma-separated
    e.g. "Nearest Railway Station: [[nearestRailway]], Nearest Bus Stop: [[nearestBusStop]], Nearest Hospital: [[nearestHospital]], Nearest School: [[nearestSchool]]"
    e.g. "North: [[north]], South: [[south]], East: [[east]], West: [[west]]"
  The text before each [[...]] is only for human understanding.
- "variableValue":
  - single field: "ownerName"
  - grouped fields: comma-separated camelCase keys matching the placeholders
    e.g. "nearestRailway, nearestBusStop, nearestHospital, nearestSchool"
    e.g. "north, south, east, west"

Keys must be camelCase with no spaces or brackets.

Respond with ONLY a JSON array of these objects. No prose, no markdown
code fences, no explanation before or after. If you find no variables,
respond with an empty array: []`;

function stripCodeFences(text) {
  return text
    .trim()
    .replace(/^```(json)?/i, "")
    .replace(/```$/, "")
    .trim();
}

function truncate(text, maxChars = 15000) {
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars) + "\n\n[document truncated]";
}

function sanitizeKeys(raw) {
  return String(raw)
    .split(",")
    .map((k) => k.trim().replace(/[^a-zA-Z0-9_]/g, ""))
    .filter(Boolean)
    .join(", ");
}

function sanitizeTemplate(raw, keys) {
  const text = String(raw || "").trim();
  if (text.includes("[[")) {
    return text.replace(/\[\[\s*([a-zA-Z0-9_]+)\s*\]\]/g, (_, k) => `[[${k}]]`);
  }
  // Fallback: build from keys if model omitted a proper template
  return keys
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean)
    .map((k) => `[[${k}]]`)
    .join(", ");
}

async function extractVariablesFromText(rawText) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in the environment");
  }

  // gemini-3.5-flash-lite currently hangs/times out on this API; 3.1 is stable
  const model = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  let response;
  try {
    response = await axios.post(
      url,
      {
        systemInstruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: `Report text:\n\n${truncate(rawText)}` }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 4000,
          responseMimeType: "application/json",
        },
      },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 60000,
      }
    );
  } catch (err) {
    // axios throws on non-2xx responses and network errors alike -
    // normalize both into a readable message instead of a raw stack dump
    if (err.response) {
      throw new Error(
        `Gemini API error: ${err.response.status} ${JSON.stringify(err.response.data)}`
      );
    }
    throw new Error(`Gemini API request failed: ${err.message}`);
  }

  const parts = response.data?.candidates?.[0]?.content?.parts || [];
  const text = parts
    .map((p) => p.text)
    .filter(Boolean)
    .join("");

  if (!text) {
    throw new Error("No text response from Gemini API");
  }

  const cleaned = stripCodeFences(text);

  let fields;
  try {
    fields = JSON.parse(cleaned);
  } catch (e) {
    throw new Error("Could not parse variables from the model response");
  }

  if (!Array.isArray(fields)) {
    throw new Error("Unexpected response shape from the model");
  }

  return fields
    .filter((f) => f && f.description && (f.variableValue || f.variable))
    .map((f) => {
      const variableValue = sanitizeKeys(f.variableValue || f.variable);
      return {
        description: String(f.description).trim(),
        variableTemplate: sanitizeTemplate(f.variableTemplate, variableValue),
        variableValue,
      };
    })
    .filter((f) => f.variableValue);
}

module.exports = { extractVariablesFromText };
