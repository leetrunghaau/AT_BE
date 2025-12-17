const express = require("express");
const router = express.Router();
const testController = require("../controllers/test.controller");

router.post("/meta", testController.meta);

module.exports = router;