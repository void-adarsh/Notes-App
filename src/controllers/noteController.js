const noteModel = require("../models/notes");

// Create New Note
const createNote = async (req, res) => {
  const { title, description } = req.body;

  // Check if the title and description are provided in the request body
  if (!title || !description) {
    return res
      .status(400)
      .json({ message: "Title and description are required" });
  }

  const newNote = new noteModel({
    title: title,
    description: description,
    userId: req.userId,
  });

  try {
    // Save the new note to the database
    const savedNote = await newNote.save();

    // Check if the note was saved successfully
    if (!savedNote) {
      return res.status(500).json({ message: "Note could not be saved" });
    }

    res.status(201).json(savedNote);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Get All Notes
const getAllNotes = async (req, res) => {
  try {
    // Check if the user ID is provided in the request
    if (!req.userId) {
      return res.status(400).json({ message: "User ID not provided" });
    }

    // Find all notes belonging to the specified user ID
    const notes = await noteModel.find({ userId: req.userId });

    // Check if any notes were found for the user
    if (!notes || notes.length === 0) {
      return res.status(404).json({ message: "No notes found for the user" });
    }

    // Return the notes if found
    res.status(200).json(notes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Delete Note
const deleteNote = async (req, res) => {
  try {
    // Check if the user ID is provided in the request
    if (!req.userId) {
      return res.status(400).json({ message: "User ID not provided" });
    }

    const id = req.params.id;

    // Check if the note ID is provided in the request
    if (!id) {
      return res.status(400).json({ message: "Note ID not provided" });
    }

    // Find and delete the note by ID
    const deletedNote = await noteModel.findByIdAndRemove(id);

    // Check if the note was found and deleted
    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Return the deleted note
    res.status(200).json({ message: "Note deleted succesfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Update Note
const updateNote = async (req, res) => {
  try {
    // Check if the user ID is provided in the request
    if (!req.userId) {
      return res.status(400).json({ message: "User ID not provided" });
    }

    const id = req.params.id;

    // Check if the note ID is provided in the request
    if (!id) {
      return res.status(400).json({ message: "Note ID not provided" });
    }

    const { title, description } = req.body;

    // Check if title and description are provided in the request body
    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    // Create the updatedNote object
    const updatedNote = {
      title: title,
      description: description,
      userId: req.userId,
    };

    // Find and update the note by ID
    const updatedNoteResult = await noteModel.findByIdAndUpdate(
      id,
      updatedNote,
      { new: true }
    );

    // Check if the note was found and updated
    if (!updatedNoteResult) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Return the updated note
    res.status(200).json(updatedNoteResult);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

//Get Note By ID

const getNoteById = async (req, res) => {
  try {
    // Check if the user ID is provided in the request
    if (!req.userId) {
      return res.status(400).json({ message: "User ID not provided" });
    }

    const noteId = req.params.id;

    // Check if the note ID is provided in the request
    if (!noteId) {
      return res.status(400).json({ message: "Note ID not provided" });
    }

    // Find a specific note by ID for the authenticated user
    const note = await noteModel.findOne({
      _id: noteId,
      userId: req.userId, // Add the user ID to the query to ensure the note belongs to the authenticated user
    });

    // Check if the note is not found
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Return the note
    res.status(200).json(note);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Search Note
const searchNotes = async (req, res) => {
  try {
    // Check if the user ID is provided in the request
    if (!req.userId) {
      return res.status(400).json({ message: "User ID not provided" });
    }

    const { q } = req.query;

    // Check if the search query is provided in the request
    if (!q) {
      return res.status(400).json({ message: "Search query not provided" });
    }

    // Find notes that match the search query for the authenticated user
    const notes = await noteModel.find({
      userId: req.userId,
      $or: [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ],
    });

    // Return the search results
    res.status(200).json(notes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Share Note
const shareNote = async (req, res) => {
  const { id: noteId } = req.params;
  const { targetUserId } = req.body;

  try {
    // Check if the user ID is provided in the request
    if (!req.userId) {
      return res.status(400).json({ message: "User ID not provided" });
    }

    // Check if the target user ID is provided in the request
    if (!targetUserId) {
      return res.status(400).json({ message: "Target user ID not provided" });
    }

    // Find the note by ID for the authenticated user
    const note = await noteModel.findOne({ _id: noteId, userId: req.userId });

    // Check if the note exists for the authenticated user
    if (!note) {
      return res.status(404).json({
        message: "Note not found for the authenticated user",
      });
    }

    // Update the note's userId to the targetUserId
    note.userId = targetUserId;
    await note.save();

    // Return success message
    res.status(200).json({ message: "Note shared successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  createNote,
  deleteNote,
  updateNote,
  getAllNotes,
  getNoteById,
  searchNotes,
  shareNote,
};
