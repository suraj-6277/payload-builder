const express = require("express");
const multer = require("multer");
const router = express.Router();
const ctrl = require("../controllers/extractController");

// Memory storage: files stay in RAM only long enough to extract text,
// nothing gets written to disk. 15MB cap - raise if your source reports
// are large scans.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
});

router.post("/", upload.single("file"), ctrl.extractDocument);

module.exports = router;

// In index.js:
//   const extractRoutes = require("./routes/extract");
//   app.use("/api/extract", extractRoutes);
