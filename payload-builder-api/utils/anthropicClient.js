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
  return keys
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean)
    .map((k) => `[[${k}]]`)
    .join(", ");
}

async function extractVariablesFromText(rawText) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not set in the environment");
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Report text:\n\n${truncate(rawText)}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Claude API error: ${response.status} ${errText}`);
  }

  const data = await response.json();
  const textBlock = data.content.find((b) => b.type === "text");
  if (!textBlock) throw new Error("No text response from Claude API");

  const cleaned = stripCodeFences(textBlock.text);

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
