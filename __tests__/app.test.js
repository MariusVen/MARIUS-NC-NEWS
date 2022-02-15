const request = require("supertest");
const app = require("../app");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");

afterAll(() => db.end());
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
    describe("GET /api/articles/:article:id", () => {
      test("status: 200 - responds with correct article object with author, title, article_id, body, topic, created_at & votes properties ", () => {
        const article_id = 9;
        return request(app)
          .get(`/api/articles/${article_id}`)
          .expect(200)
          .then((res) => {
            expect(res.body.article).toEqual({
              author: "butter_bridge",
              title: "They're not exactly dogs, are they?",
              article_id: 9,
              body: "Well? Think about it.",
              topic: "mitch",
              created_at: "2020-06-06T09:10:00.000Z",
              votes: 0,
            });
          });
        ``;
      });
      test(`status: 404 - responds with "path not found message" for incorrect path `, () => {
        return request(app)
          .get("/api/topikss")
          .expect(404)
          .then((res) => {
            expect(res.body.msg).toBe("path not found");
          });
      });
      test(`status: 404 - responds with "no article found" message for valid but non-existend id`, () => {
        const article_id = 100;
        return request(app)
          .get(`/api/articles/${article_id}`)
          .expect(404)
          .then((res) => {
            expect(res.body.msg).toBe("No article found");
          });
      });
      test(`status: 400 - responds with "bad request" message for invalid article_id`, () => {
        return request(app)
          .get("/api/articles/notID")
          .expect(400)
          .then((res) => expect(res.body.msg).toBe("bad request"));
      });
    });
  });
});
