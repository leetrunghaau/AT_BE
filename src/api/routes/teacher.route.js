const express = require("express");
const router = express.Router();
const validate = require("@mids/validation.middleware.js");
const { querySchema } = require("@valis/query.validation.js");
const TeacherController = require("@controls/teacher.controller.js");
const { id , create, creates, update} = require("@valis/teacher.validation.js");

router.get("/", validate(querySchema, "query"), TeacherController.getAll);
router.get("/:id", validate(id, "params"), TeacherController.getById);
router.post("/", validate(create), TeacherController.create);
router.post("/bulk", validate(creates), TeacherController.createBulk);
router.post("/training/:id", validate(id, "params"), TeacherController.training);
router.put("/:id", validate(id, "params"), validate(update), TeacherController.update);
router.delete("/:id", validate(id, "params"), TeacherController.delete);

module.exports = router;