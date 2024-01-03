const request = require("supertest");
const app = require("../../index");
const noteModel = require("../../models/notes");

// Mock the authentication middleware to add a dummy userId to the request object
jest.mock("../../middlewares/authMiddleware", () => (req, res, next) => {
  req.userId = "64bf2e15ecb9a44fd451cdeb"; // Replace 'dummyUserId' with an actual ObjectId
  next();
});

// Test Case for createNote function

describe("Note Route", () => {
  describe("POST /api/notes", () => {
    test("should create a new note and return 201 status code if valid data is provided", async () => {
      // Arrange
      const reqBody = {
        title: "Test Note",
        description: "This is a test note",
      };

      // Act
      const response = await request(app)
        .post("/api/notes")
        .send(reqBody)
        .expect(201);

      // Assert
      expect(response.body.title).toBe(reqBody.title);
      expect(response.body.description).toBe(reqBody.description);
      expect(response.body.userId).toBe("64bf2e15ecb9a44fd451cdeb"); // Ensure the userId is set to the dummyUserId
    });

    test("should return 400 status code if title or description is missing", async () => {
      // Arrange
      const reqBody = { title: "Test Note" }; // Missing 'description' field

      // Act
      const response = await request(app)
        .post("/api/notes")
        .send(reqBody)
        .expect(400);

      // Assert
      expect(response.body.message).toBe("Title and description are required");
    });

    test("should return 500 status code if an error occurs while saving the note", async () => {
      // Arrange
      const reqBody = {
        title: "Test Note",
        description: "This is a test note",
      };

      // Mock the 'save' method of the noteModel to simulate an error
      jest
        .spyOn(noteModel.prototype, "save")
        .mockRejectedValue(new Error("Mock Error"));

      // Act
      const response = await request(app)
        .post("/api/notes")
        .send(reqBody)
        .expect(500);

      // Assert
      expect(response.body.message).toBe("Something went wrong");
    });
  });

  // Test Case for getAllNotes function
  describe("GET /api/notes", () => {
    test("should return all notes for the authenticated user", async () => {
      // Arrange
      const mockNotes = [
        {
          title: "Note 1",
          description: "Description 1",
          userId: "64bf2e15ecb9a44fd451cdeb",
        },
        {
          title: "Note 2",
          description: "Description 2",
          userId: "64bf3457c4e88f4c5de5294e",
        },
      ];

      // Mock the 'find' method of noteModel to return the mock notes
      jest.spyOn(noteModel, "find").mockResolvedValue(mockNotes);

      // Act
      const response = await request(app).get("/api/notes").expect(200);

      // Assert
      expect(response.body).toHaveLength(mockNotes.length);
      expect(response.body).toEqual(expect.arrayContaining(mockNotes));
    });

    test("should return 404 status code if no notes are found for the authenticated user", async () => {
      // Arrange
      // Mock the 'find' method of noteModel to return an empty array
      jest.spyOn(noteModel, "find").mockResolvedValue([]);

      // Act
      const response = await request(app).get("/api/notes").expect(404);

      // Assert
      expect(response.body.message).toBe("No notes found for the user");
    });

    test("should return 500 status code if an error occurs while retrieving notes", async () => {
      // Arrange
      // Mock the 'find' method of noteModel to throw an error
      jest.spyOn(noteModel, "find").mockRejectedValue(new Error("Mock Error"));

      // Act
      const response = await request(app).get("/api/notes").expect(500);

      // Assert
      expect(response.body.message).toBe("Something went wrong");
    });
  });

  // Test Case for getNoteById function

  describe("GET /api/notes/:id", () => {
    test("should return the note if it exists and belongs to the authenticated user", async () => {
      // Arrange
      const mockNote = {
        _id: "64c01235ebd4f48a6abe5ab4", // Replace 'dummyNoteId' with an actual ObjectId
        title: "Note 1",
        description: "Description 1",
        userId: "64bf2e15ecb9a44fd451cdeb", // Replace 'dummyUserId' with an actual ObjectId
      };

      // Mock the 'findOne' method of noteModel to return the mock note
      jest.spyOn(noteModel, "findOne").mockResolvedValue(mockNote);

      // Act
      const response = await request(app)
        .get(`/api/notes/${mockNote._id}`)
        .expect(200);

      // Assert
      expect(response.body).toEqual(mockNote);
    });

    test("should return 404 status code if the note does not exist", async () => {
      // Arrange
      const nonExistentNoteId = "abc123"; // Replace with a non-existent ObjectId

      // Mock the 'findOne' method of noteModel to return null (note not found)
      jest.spyOn(noteModel, "findOne").mockResolvedValue(null);

      // Act
      const response = await request(app)
        .get(`/api/notes/${nonExistentNoteId}`)
        .expect(404);

      // Assert
      expect(response.body.message).toBe("Note not found");
    });

    test("should return 500 status code if an error occurs while retrieving the note", async () => {
      // Arrange
      const mockNoteId = "64c01235ebd4f48a6abe5ab4"; // Replace 'dummyNoteId' with an actual ObjectId

      // Mock the 'findOne' method of noteModel to throw an error
      jest
        .spyOn(noteModel, "findOne")
        .mockRejectedValue(new Error("Mock Error"));

      // Act
      const response = await request(app)
        .get(`/api/notes/${mockNoteId}`)
        .expect(500);

      // Assert
      expect(response.body.message).toBe("Something went wrong");
    });
  });

  // deletenote test case

  describe("DELETE /api/notes/:id", () => {
    test("should delete a note by ID for the authenticated user and return 204 status code", async () => {
      const noteIdToDelete = "64c023179b42b5e40f84492e"; // please change the note ID everytime there is a need to rerun the test as the existing deleted ID will throw an error
      const mockDeletedNote = {
        _id: noteIdToDelete,
        title: "Note to Delete",
        description: "Description to Delete",
        userId: "64bf2e15ecb9a44fd451cdeb",
      };

      // Mock the 'findOneAndDelete' method of noteModel to return the deleted note
      jest
        .spyOn(noteModel, "findOneAndDelete")
        .mockResolvedValue(mockDeletedNote);

      const response = await request(app)
        .delete(`/api/notes/${noteIdToDelete}`)
        .expect(204);

      expect(response.body).toEqual({}); // The response body should be an empty object for a successful delete
    });

    test("should return 500 status code if an error occurs while deleting the note", async () => {
      const noteIdToDelete = "dummyNoteId";

      // Mock the 'findOneAndDelete' method of noteModel to throw an error
      jest
        .spyOn(noteModel, "findOneAndDelete")
        .mockRejectedValue(new Error("Mock Error"));

      const response = await request(app)
        .delete(`/api/notes/${noteIdToDelete}`)
        .expect(500);

      expect(response.body.message).toBe("Something went wrong");
    });
  });
});
