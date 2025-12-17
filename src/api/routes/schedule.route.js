const express = require("express");
const router = express.Router();
const validate = require("@mids/validation.middleware.js");
const { querySchema } = require("@valis/query.validation.js");
const ScheduleController = require("@controls/schedule.controller.js");
const { search, id, update, create, creates, dateOfClass, modify, history, comparison, teachers } = require("@valis/schedule.validation.js");

router.get("/", validate(search, "query"), ScheduleController.getAll);
router.get("/history", validate(history, "query"), ScheduleController.getHistory);
router.get("/teachers", validate(teachers, "query"), ScheduleController.teachers);
router.get("/comparison", validate(comparison, "query"), ScheduleController.comparison);
router.get("/date-of-class", validate(dateOfClass, "query") ,ScheduleController.dateOfClass);
router.post("/", validate(create), ScheduleController.create);
router.post("/bulk",validate(creates), ScheduleController.createBulk);
router.post("/merge", ScheduleController.merge);
router.put("/:id", [validate(id, "params"), validate(update)], ScheduleController.update);
router.patch("/:id", [validate(id, "params"), validate(modify)], ScheduleController.modify);
router.delete("/:id", validate(id, "params") , ScheduleController.delete);

module.exports = router;