const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/templateController");

// Swap this for your existing auth middleware (the one that already
// distinguishes admin / visitor / drafter / internal-team logins).
// const { requireRole } = require("../middleware/auth");

router.get("/", /* requireRole("internal"), */ ctrl.listTemplates);
router.get("/:id", /* requireRole("internal"), */ ctrl.getTemplate);
router.post("/", /* requireRole("internal"), */ ctrl.createTemplate);
router.put("/:id", /* requireRole("internal"), */ ctrl.updateTemplate);
router.delete("/:id", /* requireRole("internal"), */ ctrl.deleteTemplate);

// Used by the extraction step / drafter review screen to check a payload
// against the template's required fields and confidence scores.
router.post("/:id/validate", /* requireRole("drafter"), */ ctrl.validatePayload);

module.exports = router;

// In your main app.js / server.js:
//   const templateRoutes = require("./routes/templates");
//   app.use("/api/templates", templateRoutes);
