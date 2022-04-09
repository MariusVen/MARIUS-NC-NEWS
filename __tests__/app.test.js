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
  describe.only("GET /api/articles", () => {
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
    test("status: 200 - responds with array of article objects including comment_count property  ", () => {
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
                comment_count: expect.any(Number),
              })
            );
          });
        });
    });
    test("status: 200 - default sort & order: `created_at`, `desc` ", () => {
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
    test("status: 200 - accepts `sort_by` query, e.g. `?sort_by=votes`", () => {
      return request(app)
        .get("/api/articles?sort_by=votes")
        .expect(200)
        .then((res) => {
          expect(res.body.articles).toHaveLength(12);
          expect(res.body.articles).toBeSortedBy("votes", {
            descending: true,
          });
        });
    });
    test("status: 200 - accepts `order` query, e.g. `?order=desc`", () => {
      return request(app)
        .get("/api/articles?order_by=desc")
        .expect(200)
        .then((res) => {
          expect(res.body.articles).toHaveLength(12);
          expect(res.body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    test("status: 200 - accepts `topic` query, e.g. `?topic=cats`", () => {
      return request(app)
        .get("/api/articles/?topic=cats")
        .expect(200)
        .then((res) => {
          expect(res.body.articles).toHaveLength(1);
          res.body.articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: "cats",
                created_at: expect.any(String),
                votes: expect.any(Number),
              })
            );
          });
        });
    });
    test("status: 400 - invalid `sort_by` query, e.g. `?sort_by=bananas` ", () => {
      return request(app)
        .get(`/api/articles/?sort_by=bananas`)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("invalid `sort_by` query");
        });
    });
    test("status: 400 - invalid `order` query, e.g. `?order=bananas` ", () => {
      return request(app)
        .get(`/api/articles/?order_by=bananas`)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("invalid `order` query");
        });
    });
    test("status: 404 - non-existent `topic` query, e.g. `?topic=bananas`", () => {
      return request(app)
        .get(`/api/articles/?topic=bananas`)
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("non-existent `topic` query");
        });
    });
    test("Status 200. valid `topic` query, but has no articles responds with an empty array of articles, e.g. `?topic=paper`", () => {
      return request(app)
        .get("/api/articles/?topic=paper")
        .expect(200)
        .then((res) => {
          expect(res.body.articles).toEqual([]);
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
    test("status: 200 - responds with empty array if article exists, but doesn't have associates comments", () => {
      const article_id = 2;
      return request(app)
        .get(`/api/articles/${article_id}/comments`)
        .expect(200)
        .then((res) => {
          expect(res.body.comments).toHaveLength(0);
          expect(res.body.comments).toEqual([]);
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
  describe("POST /api/articles/:article_id/comments", () => {
    test("status: 201 - responds with added comment ", () => {
      const article_id = 9;
      const data = { body: "testing", username: "butter_bridge" };
      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send(data)
        .expect(201)
        .then((res) => {
          expect(res.body.comment).toEqual({
            author: "butter_bridge",
            article_id: 9,
            body: "testing",
            comment_id: res.body.comment.comment_id,
            created_at: res.body.comment.created_at,
            votes: res.body.comment.votes,
          });
          expect(res.body.comment).toEqual(
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
    test(`Status: 400 - invalid ID, e.g. string of "not-an-id"`, () => {
      const article_id = "not-an-id";
      const data = { body: "testing", username: "butter_bridge" };
      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send(data)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("bad request");
        });
    });
    test(`status: 404 - responds with "no article found" message for valid but non-existend article id`, () => {
      const article_id = 100;
      const data = { body: "testing", username: "butter_bridge" };
      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send(data)
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("No article found");
        });
    });

    test(`status: 400 - missing required field(s), e.g. no username or body properties`, () => {
      const article_id = 9;
      const data = { body: "testing" };
      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send(data)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("missing username property");
        });
    });
    // test(`status 404 - username does not exist`, () => {
    //   const article_id = 9;
    //   const data = { body: "testing", username: "randomUsername" };
    //   return request(app)
    //     .post(`/api/articles/${article_id}/comments`)
    //     .send(data)
    //     .expect(400)
    //     .then((res) => {
    //       expect(res.body.msg).toBe("username does not exist");
    //     });
    // });
    test("status: 201 - ignores unnecessary properties ", () => {
      const article_id = 9;
      const data = {
        body: "testing",
        username: "butter_bridge",
        color: "blue",
      };
      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send(data)
        .expect(201)
        .then((res) => {
          expect(res.body.comment).toEqual({
            author: "butter_bridge",
            article_id: 9,
            body: "testing",
            comment_id: res.body.comment.comment_id,
            created_at: res.body.comment.created_at,
            votes: res.body.comment.votes,
          });
          expect(res.body.comment).toEqual(
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
});
