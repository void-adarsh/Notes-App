const rateLimit = require("express-rate-limit");

// Rate limiting options
const limiterOptions = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  handler: (req, res) => {
    res
      .status(429)
      .json({ message: "Too many requests, please try again later" });
  },
};

// Create the rate limiter middleware
const limiter = rateLimit(limiterOptions);

module.exports = limiter;
