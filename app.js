const express = require("express");
const {
  getTopics,
  getArticleById,
  getUpdatedArticleById,
} = require("./controllers/controller");
const { handlePsqlErrors, handleCustoms, handle500s } = require("./errors");
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", getUpdatedArticleById);

app.use(handlePsqlErrors);
app.use(handleCustoms);
app.use(handle500s);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "path not found" });
});

module.exports = app;
