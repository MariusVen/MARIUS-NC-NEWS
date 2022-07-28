const express = require("express");
const cors = require("cors");
const {
  getTopics,
  getArticleById,
  getUpdatedArticleById,
  getUsers,
  getArticles,
  getComments,
  postComments,
  deleteComment,
  getEndPoints,
  getUser,
} = require("./controllers/controller");
const { handlePsqlErrors, handleCustoms, handle500s } = require("./errors");
const app = express();

app.use(express.json());
app.use(cors());

app.get("/api/", getEndPoints);
app.get("/api/topics", getTopics);
app.get("/api/users", getUsers);
app.get("/api/users/:username", getUser);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getComments);
app.patch("/api/articles/:article_id", getUpdatedArticleById);
app.post("/api/articles/:article_id/comments", postComments);
app.delete("/api/comments/:comment_id", deleteComment);

app.use(handlePsqlErrors);
app.use(handleCustoms);
app.use(handle500s);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "path not found" });
});

module.exports = app;
