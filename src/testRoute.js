const express = require("express");
const rateLimitMiddleware = require("./middlewares/rateLimitMiddleware");

const testRouter = express.Router();

// Apply the rateLimitMiddleware to the /test route
testRouter.get("/test", rateLimitMiddleware, (req, res) => {
  res.send("This is a test route");
});

module.exports = testRouter;
