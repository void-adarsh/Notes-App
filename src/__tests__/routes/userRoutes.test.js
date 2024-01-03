const request = require("supertest");
const app = require("../../index"); // Replace "../index" with the correct path to your main Express app file
const userModel = require("../../models/users"); // Import the user model if needed

describe("User Routes", () => {
  // Test data for sign-up and login
  // Note :  Please first signup with a data and then add that data into the existing user
  // Please change the signup userData everytime you run the test case as it might cause error
  const userData = {
    username: "user1",
    email: "user1@example.com",
    password: "user123",
  };
  // When once signed up, please add that data into this
  const existingUser = {
    email: "abc@example.com",
    password: "abc123",
  };

  // Clean up the database or perform necessary actions after each test case
  afterEach(async () => {
    // Delete the test user created during the test case (Example using Mongoose with MongoDB)
    await userModel.deleteOne({ email: userData.email });
  });

  describe("POST /api/auth/signup", () => {
    it("should sign up a new user and return a token", async () => {
      const response = await request(app)
        .post("/api/auth/signup")
        .send(userData)
        .expect(201);

      // Ensure that the response contains the user and token
      expect(response.body).toHaveProperty("user");
      expect(response.body).toHaveProperty("token");
    });

    it("should return 400 if missing fields during sign-up", async () => {
      const response = await request(app)
        .post("/api/auth/signup")
        .send({ username: "testuser" })
        .expect(400);

      // Ensure that the response contains the error message
      expect(response.body).toHaveProperty(
        "message",
        "All fields are required"
      );
    });

    it("should return 400 for invalid email during sign-up", async () => {
      const response = await request(app)
        .post("/api/auth/signup")
        .send({ ...userData, email: "invalidemail" })
        .expect(400);

      // Ensure that the response contains the error message
      expect(response.body).toHaveProperty("message", "Invalid email format");
    });
  });

  describe("POST /api/auth/login", () => {
    it("should log in an existing user and return a token", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send(existingUser)
        .expect(200);

      // Ensure that the response contains the user and token
      expect(response.body).toHaveProperty("user");
      expect(response.body).toHaveProperty("token");
    });

    it("should return 400 if missing fields during login", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: "existinguser@example.com" })
        .expect(400);

      // Ensure that the response contains the error message
      expect(response.body).toHaveProperty(
        "message",
        "Email and password are required"
      );
    });

    it("should return 404 for non-existing user during login", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "nonexistinguser@example.com",
          password: "testpassword",
        })
        .expect(404);

      // Ensure that the response contains the error message
      expect(response.body).toHaveProperty("message", "User not found!");
    });

    it("should return 401 for incorrect password during login", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: existingUser.email,
          password: "incorrectpassword",
        })
        .expect(401);

      // Ensure that the response contains the error message
      expect(response.body).toHaveProperty("message", "Invalid credentials");
    });
  });
});
