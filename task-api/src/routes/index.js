const express = require("express");
const router = express.Router();

const localFileRouter = require("./localFileRoutes");
const categoryRouter = require("./categoryRoutes");
const taskRouter = require("./taskRoutes");

router.use("/file", localFileRouter);
router.use("/categories", categoryRouter);
router.use("/tasks", taskRouter);

module.exports = router;
