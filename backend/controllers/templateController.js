const ReportTemplate = require("../models/ReportTemplate");

exports.createTemplate = async (req, res) => {
  try {
    const { description, variableTemplate, variableValue } = req.body;

    if (!description?.trim() || !variableTemplate?.trim() || !variableValue?.trim()) {
      return res.status(400).json({
        error: "description, variableTemplate, and variableValue are required",
      });
    }

    const template = await ReportTemplate.create({
      description: description.trim(),
      variableTemplate: variableTemplate.trim(),
      variableValue: variableValue.trim(),
    });
    res.status(201).json(template);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listTemplates = async (req, res) => {
  try {
    const filter = { isActive: true };
    const templates = await ReportTemplate.find(filter).sort({ updatedAt: -1 });
    res.json(templates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTemplate = async (req, res) => {
  try {
    const template = await ReportTemplate.findById(req.params.id);
    if (!template) return res.status(404).json({ error: "Template not found" });
    res.json(template);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTemplate = async (req, res) => {
  try {
    const template = await ReportTemplate.findById(req.params.id);
    if (!template) return res.status(404).json({ error: "Template not found" });

    const { description, variableTemplate, variableValue } = req.body;
    if (description !== undefined) template.description = description;
    if (variableTemplate !== undefined) template.variableTemplate = variableTemplate;
    if (variableValue !== undefined) template.variableValue = variableValue;
    await template.save();

    res.json(template);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTemplate = async (req, res) => {
  try {
    const template = await ReportTemplate.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!template) return res.status(404).json({ error: "Template not found" });
    res.json({ deactivated: true, template });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.validatePayload = async (req, res) => {
  try {
    const template = await ReportTemplate.findById(req.params.id);
    if (!template) return res.status(404).json({ error: "Template not found" });

    const payload = req.body.payload || {};
    const missing = [];
    if (payload[template.variableValue] === undefined || payload[template.variableValue] === "") {
      missing.push(template.variableValue);
    }

    res.json({ missing, valid: missing.length === 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
