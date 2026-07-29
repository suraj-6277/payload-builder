const mongoose = require("mongoose");
const { Schema } = mongoose;

const ReportTemplateSchema = new Schema(
  {
    description: { type: String, required: true, trim: true },
    variableTemplate: { type: String, required: true, trim: true },
    variableValue: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ReportTemplate", ReportTemplateSchema);
