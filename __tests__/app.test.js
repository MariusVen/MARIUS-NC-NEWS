const request = require("supertest");
const app = require("../app");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");

beforeEach(() => seed(data));

describe("app", () => {
  describe("GET - /api/topics", () => {
    test("status: 200, responds with array of topic objects with slug & description properties", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((res) => {
          expect(res.body.topics).toHaveLength(3);
          res.body.topics.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            );
          });
        });
    });
    test("status: 404 - responds with path not found msg for incorrect path ", () => {
      return request(app)
        .get("/api/topikss")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("path not found");
        });
    });
  });
});
