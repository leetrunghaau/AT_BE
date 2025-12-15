const express = require("express");
const router = express.Router();
const SubjectController = require("@controls/subject.controller.js");
const validate = require("@mids/validation.middleware.js");
const { update, id } = require("@valis/subject.validation.js");
const { querySchema } = require("@valis/query.validation.js");

router.get("/", validate(querySchema, "query"), SubjectController.getAll);
router.put("/:id", [validate(id, "params"), validate(update)], SubjectController.update);

module.exports = router;