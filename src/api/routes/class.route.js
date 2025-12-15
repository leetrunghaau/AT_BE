const express = require("express");
const router = express.Router();
const ClassController = require("@controls/class.controller");
const validate = require("@mids/validation.middleware.js");
const { create, update, creates, id } = require("@valis/class.validation.js");
const { querySchema } = require("@valis/query.validation.js");

router.get("/", validate(querySchema, "query"), ClassController.getAll);
router.get("/:id", validate(id, "params"),  ClassController.getById);
router.post("/", validate(create), ClassController.create);
router.post("/bulk", validate(creates), ClassController.createBulk);
router.put("/:id", validate(id, "params") ,validate(update), ClassController.update);
router.delete("/:id", validate(id, "params"), ClassController.delete);



module.exports = router;