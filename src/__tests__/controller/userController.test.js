const request = require("supertest");
const app = require("../../index");
const userModel = require("../../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// Define a mock user data for testing
const mockUserData = {
  username: "testuser",
  email: "test@example.com",
  password: "testpassword",
};

describe("User Sign Up", () => {
  beforeEach(async () => {
    // Clear the database before each test
    await userModel.deleteMany({});
  });

  it("should return 201 and a user with a token if signup is successful", async () => {
    const response = await request(app)
      .post("/api/auth/signup")
      .send(mockUserData)
      .expect(201);

    // Check the response contains the user and token properties
    expect(response.body).toHaveProperty("user");
    expect(response.body).toHaveProperty("token");

    // Check if the user is saved in the database
    const savedUser = await userModel.findOne({ email: mockUserData.email });
    expect(savedUser).toBeTruthy();

    // Check if the user properties are correct
    expect(savedUser.username).toBe(mockUserData.username);
    expect(savedUser.email).toBe(mockUserData.email);

    // Check if the password is hashed
    const isPasswordMatch = await bcrypt.compare(
      mockUserData.password,
      savedUser.password
    );
    expect(isPasswordMatch).toBe(true);

    // Check if the token is valid and contains the correct user data
    const decodedToken = jwt.verify(response.body.token, "notesapi");
    expect(decodedToken.email).toBe(mockUserData.email);
    expect(decodedToken.id).toBe(savedUser._id.toString());
  });

  it("should return 400 if any of the required fields are missing", async () => {
    const incompleteUserData = {
      username: "testuser",
      password: "testpassword",
    };

    const response = await request(app)
      .post("/api/auth/signup")
      .send(incompleteUserData)
      .expect(400);

    expect(response.body).toHaveProperty("message", "All fields are required");
  });

  it("should return 400 if the email format is invalid", async () => {
    const invalidEmailUserData = {
      username: "testuser",
      email: "invalidemail",
      password: "testpassword",
    };

    const response = await request(app)
      .post("/api/auth/signup")
      .send(invalidEmailUserData)
      .expect(400);

    expect(response.body).toHaveProperty("message", "Invalid email format");
  });
});

describe("User Login", () => {
  // Test data for user login
  const userData = {
    email: "testuser@example.com",
    password: "testpassword",
  };

  // Create a test user before running the tests
  beforeAll(async () => {
    await userModel.deleteMany({}); // Clear any existing data
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    await userModel.create({
      email: userData.email,
      password: hashedPassword,
      username: "Test User",
    });
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Close the database connection after tests
  });

  it("should return 200 and user with token if login is successful", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send(userData)
      .expect(200);
    expect(response.body).toHaveProperty("user");
    expect(response.body).toHaveProperty("token");
    expect(response.body.user).toHaveProperty("_id");
    expect(response.body.user).toHaveProperty("email", userData.email);
  });

  it("should return 400 if email or password is missing", async () => {
    const invalidData = { email: "testuser@example.com" }; // Missing password field
    await request(app).post("/api/auth/login").send(invalidData).expect(400);
  });

  it("should return 400 if email format is invalid", async () => {
    const invalidData = { email: "invalid_email", password: "testpassword" };
    await request(app).post("/api/auth/login").send(invalidData).expect(400);
  });

  it("should return 404 if user with the provided email does not exist", async () => {
    const invalidData = {
      email: "nonexistentuser@example.com",
      password: "testpassword",
    };
    await request(app).post("/api/auth/login").send(invalidData).expect(404);
  });

  it("should return 401 if provided password is incorrect", async () => {
    const invalidData = {
      email: "testuser@example.com",
      password: "incorrect_password",
    };
    await request(app).post("/api/auth/login").send(invalidData).expect(401);
  });
});
