// authMiddleware.js
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const SECRET_KEY = process.env.SECRET_KEY || "notesapi";

dotenv.config();

const rateLimitMiddleware = require("./rateLimitMiddleware");

const authMiddleware = (req, res, next) => {
  try {
    // Use the rate limiter middleware here before authentication
    rateLimitMiddleware(req, res, () => {
      let token = req.header("Authorization");
      if (!token) {
        return res.status(401).json({
          message: "Authentication required. Please provide a valid token.",
        });
      }

      // Check if the token is in the correct format (Bearer <token>)
      if (!token.startsWith("Bearer ")) {
        return res.status(401).json({
          message: "Invalid token format. Please provide a valid Bearer token.",
        });
      }

      token = token.split(" ")[1];
      try {
        let user = jwt.verify(token, SECRET_KEY);
        console.log("Decoded User:", user);
        req.userId = user.id;
        next();
      } catch (error) {
        return res.status(401).json({
          message: "Invalid token. Please log in again.",
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = authMiddleware;
