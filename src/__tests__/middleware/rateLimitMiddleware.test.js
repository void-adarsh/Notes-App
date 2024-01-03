const request = require("supertest");
const app = require("../../index");
const limiter = require("../../middlewares/rateLimitMiddleware");

describe("rateLimitMiddleware", () => {
  it("should limit the number of requests to 100 per 15 minutes", async () => {
    // Send 100 requests within 15 minutes
    for (let i = 0; i < 100; i++) {
      await request(app).get("/api/test").expect(200);
    }

    // Send one more request, it should return a 429 status code
    const response = await request(app).get("/api/test").expect(429);
    expect(response.body.message).toBe(
      "Too many requests, please try again later"
    );
  });
});
