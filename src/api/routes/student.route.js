const express = require("express");
const router = express.Router();
const StudentController = require("@controls/student.controller.js");
const validate = require("@mids/validation.middleware.js");
const { create, update, creates, id, logs } = require("@valis/student.validation.js");
const { querySchema } = require("@valis/query.validation.js");

router.get("/", validate(querySchema, "query"), StudentController.getAll);
router.get("/logs", validate(logs, "query"), StudentController.logs);
router.get("/:id", validate(id, "params"), StudentController.getById);
router.post("/", validate(create), StudentController.create);
router.post("/bulk", validate(creates), StudentController.createBulk);
router.post("/training/:id", validate(id, "params"), StudentController.training);
router.put("/:id", [validate(id, "params"), validate(update)], StudentController.update);
router.delete("/:id", validate(id, "params"), StudentController.delete);

module.exports = router;