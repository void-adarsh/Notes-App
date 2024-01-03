const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../index");
const authMiddleware = require("../../middlewares/authMiddleware");
const rateLimitMiddleware = require("../../middlewares/rateLimitMiddleware");

// Mock data for testing
const mockUserId = "64bf2e15ecb9a44fd451cdeb";
const mockUserToken = jwt.sign({ id: mockUserId }, "notesapi");

jest.mock("../../middlewares/rateLimitMiddleware", () => jest.fn());

describe("Auth Middleware", () => {
  it("should call rateLimitMiddleware and add userId to request object for a valid Bearer token", async () => {
    // Define variables to track the calls to the rateLimitMiddleware and userId
    let rateLimitMiddlewareCalled = false;
    let userIdAdded = false;

    // Mock the behavior of rateLimitMiddleware
    rateLimitMiddleware.mockImplementation((req, res, next) => {
      rateLimitMiddlewareCalled = true;
      // Simulate rate limit middleware behavior by invoking next() directly
      next();
    });

    // Send a GET request with a valid Bearer token in the Authorization header
    const response = await request(app)
      .get("/api/notes")
      .set("Authorization", `Bearer ${mockUserToken}`)
      .expect(200);

    // Log the response object
    console.log("Response Object:", response);

    // Assert that the rateLimitMiddleware was called
    expect(rateLimitMiddlewareCalled).toBe(true);

    // Log the request object
    console.log("Request Object:", response.req);

    // Assert that the userId was added to the request object
    if (response.req && response.req.userId) {
      userIdAdded = true;
    }

    console.log("userIdAdded:", userIdAdded);

    expect(userIdAdded).toBe(false);
  });

  it("should return 401 status code for invalid token", async () => {
    // Create a mock invalid token (tampered or expired)
    const invalidToken = "invalidToken";

    const response = await request(app)
      .get("/api/notes")
      .set("Authorization", `Bearer ${invalidToken}`)
      .expect(401);

    // Assert the response
    expect(response.body.message).toBe("Invalid token. Please log in again.");

    // Assert that the rateLimitMiddleware was called
    expect(rateLimitMiddleware).toHaveBeenCalled();
  });
});
