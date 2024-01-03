const express = require("express");
const userRouter = require("../src/routes/userRoutes");
const notesRouter = require("../src/routes/noteRoutes");
const app = express();
const dotenv = require("dotenv");
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const connectDB = require("./db");
const mongoose = require("mongoose");
const testRouter = require("./testRoute");

dotenv.config();

app.use(express.json());
app.use(cors());

app.use("/api/auth", userRouter);
app.use("/api/notes", notesRouter);
app.use("/api", testRouter);

app.get("/", (req, res) => {
  res.status(200).send("Notes API");
});

// Connect to the database and start the server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port no. ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

module.exports = app;
