const express = require("express");
const {
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  searchNotes,
  getAllNotes,
  shareNote,
} = require("../controllers/noteController");
const authMiddleware = require("../middlewares/authMiddleware");
const notesRouter = express.Router();

notesRouter.get("/search", authMiddleware, searchNotes);
notesRouter.get("/", authMiddleware, getAllNotes);
notesRouter.get("/:id", authMiddleware, getNoteById);
notesRouter.post("/", authMiddleware, createNote);
notesRouter.put("/:id", authMiddleware, updateNote);
notesRouter.delete("/:id", authMiddleware, deleteNote);
notesRouter.post("/:id/share", authMiddleware, shareNote);

module.exports = notesRouter;
