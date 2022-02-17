const {
  fetchTopics,
  selectArticleById,
  updateArticleByID,
  fetchUsers,
} = require("../models/models");

exports.getTopics = (req, res) => {
  fetchTopics().then((topics) => {
    res.status(200).send({ topics: topics });
  });
};

exports.getArticleById = (req, res, next) => {
  const article_id = req.params.article_id;
  selectArticleById(article_id)
    .then((newArticle) => {
      res.status(200).send({ article: newArticle });
    })
    .catch((err) => {
      next(err);
    });
};
exports.getUpdatedArticleById = (req, res, next) => {
  const newVote = req.body;
  const article_id = req.params.article_id;

  updateArticleByID(newVote, article_id)
    .then((updatedArticle) => {
      res.status(200).send({ article: updatedArticle });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (req, res) => {
  fetchUsers().then((users) => {
    res.status(200).send({ users: users });
  });
};
