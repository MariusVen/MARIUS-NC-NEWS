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
  });
  describe("GET /api/articles/:article:id", () => {
    test("status: 200 - responds with correct article object with author, title, article_id, body, topic, created_at & votes properties ", () => {
      const article_id = 9;
      return request(app)
        .get(`/api/articles/${article_id}`)
        .expect(200)
        .then((res) => {
          expect(res.body.article).toEqual(
            expect.objectContaining({
              author: "butter_bridge",
              title: "They're not exactly dogs, are they?",
              article_id: 9,
              body: "Well? Think about it.",
              topic: "mitch",
              created_at: "2020-06-06T09:10:00.000Z",
              votes: res.body.article.votes,
            })
          );
        });
    });
    test("status: 200 - responds with correct article including comment_count property ", () => {
      const article_id = 9;
      return request(app)
        .get(`/api/articles/${article_id}`)
        .expect(200)
        .then((res) => {
          expect(res.body.article).toEqual(
            expect.objectContaining({
              author: "butter_bridge",
              title: "They're not exactly dogs, are they?",
              article_id: 9,
              body: "Well? Think about it.",
              topic: "mitch",
              created_at: "2020-06-06T09:10:00.000Z",
              votes: res.body.article.votes,
              comment_count: 2,
            })
          );
        });
    });
    test(`status: 404 - responds with "path not found message" for incorrect path `, () => {
      return request(app)
        .get("/api/arcticlesz")
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
  describe("PATCH /api/articles/:article_id", () => {
    test("status: 200 - responds with updated article ", () => {
      const newVote = { inc_votes: 10 };
      const article_id = 9;
      return request(app)
        .patch(`/api/articles/${article_id}`)
        .send(newVote)
        .expect(200)
        .then((res) => {
          expect(res.body.article).toEqual({
            author: "butter_bridge",
            title: "They're not exactly dogs, are they?",
            article_id: 9,
            body: "Well? Think about it.",
            topic: "mitch",
            created_at: "2020-06-06T09:10:00.000Z",
            votes: res.body.article.votes,
          });
        });
    });
    test(`status: 404 - responds with "path not found message" for incorrect path `, () => {
      return request(app)
        .patch("/api/articlesz")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("path not found");
        });
    });
    test(`status: 404 - responds with "no article found" message for valid but non-existend article id`, () => {
      const article_id = 100;
      const newVote = { inc_votes: 10 };
      return request(app)
        .patch(`/api/articles/${article_id}`)
        .send(newVote)
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("No article found");
        });
    });
    test(`status: 400 - responds with "input missing required fields" message if input missing required fields`, () => {
      const newVote = {};
      const article_id = 9;
      return request(app)
        .patch(`/api/articles/${article_id}`)
        .send(newVote)
        .expect(400)
        .then((res) => expect(res.body.msg).toBe("missing required fields"));
    });
    test(`status: 400 - responds with "input property is incorrect type" message if input is incorrect type`, () => {
      const newVote = { inc_votes: "Hello" };
      const article_id = 9;
      return request(app)
        .patch(`/api/articles/${article_id}`)
        .send(newVote)
        .expect(400)
        .then((res) =>
          expect(res.body.msg).toBe("input property is incorrect type")
        );
    });
  });

  describe("GET /api/users", () => {
    test("status: 200 - responds with array of users objects with username property", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((res) => {
          expect(res.body.users).toHaveLength(4);
          res.body.users.forEach((user) => {
            expect(user).toEqual(
              expect.objectContaining({
                username: expect.any(String),
              })
            );
          });
        });
    });
    test("status: 404 - responds with path not found msg for incorrect path ", () => {
      return request(app)
        .get("/api/userz")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("path not found");
        });
    });
  });
  describe("GET /api/articles", () => {
    test("status: 200 - responds with array of articles objects with author, title, article_id, topic, created_at, votes properties  ", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((res) => {
          expect(res.body.articles).toHaveLength(12);
          res.body.articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
              })
            );
          });
        });
    });
    test("status: 200 - responds with array of articles sorted by date in descending order ", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((res) => {
          expect(res.body.articles).toHaveLength(12);
          expect(res.body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    test(`status: 404 - responds with "path not found" msg for incorrect path`, () => {
      return request(app)
        .get("/api/articlez")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("path not found");
        });
    });
  });
  describe("GET /api/articles/:article_id/comments", () => {
    test("status: 200 - responds with array of topic objects with comment_id, votes, created_at, author, body properties", () => {
      const article_id = 9;
      return request(app)
        .get(`/api/articles/${article_id}/comments`)
        .expect(200)
        .then((res) => {
          expect(res.body.comments).toHaveLength(2);
          res.body.comments.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
              })
            );
          });
        });
    });
    test(`status: 404 - responds with "no article found" message for valid but non-existend id`, () => {
      const article_id = 100;
      return request(app)
        .get(`/api/articles/${article_id}/comments`)
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("No article found");
        });
    });
    test(`status: 400 - responds with "bad request" message if article_id is not a number `, () => {
      const article_id = "sd";
      return request(app)
        .get(`/api/articles/${article_id}/comments`)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("bad request");
        });
    });
  });
});
