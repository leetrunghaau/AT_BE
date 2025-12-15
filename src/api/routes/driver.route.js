const express = require("express");
const router = express.Router();
const DriverController = require("@controls/driver.controller");
const validate = require("@mids/validation.middleware.js");
const { create, update, creates, id } = require("@valis/driver.validation");
const { querySchema } = require("@valis/query.validation.js");

router.get("/", validate(querySchema, "query"), DriverController.getAll);
router.get("/:id", validate(id, "params"), DriverController.getById);
router.post("/", validate(create), DriverController.create);
router.post("/bulk", validate(creates), DriverController.createBulk);
router.put("/:id", [validate(id, "params"), validate(update)], DriverController.update);
router.delete("/:id", validate(id, "params"), DriverController.delete);

module.exports = router;