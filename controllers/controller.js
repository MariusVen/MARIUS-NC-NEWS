const {
  fetchTopics,
  selectArticleById,
  updateArticleByID,
  fetchUsers,
  fetchArticles,
  fetchComments,
  checkArticleId,
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

exports.getArticles = (req, res) => {
  fetchArticles().then((articles) => {
    res.status(200).send({ articles: articles });
  });
};

exports.getComments = (req, res, next) => {
  const articleId = req.params.article_id;
  Promise.all([fetchComments(articleId), checkArticleId(articleId)])
    .then((comments) => {
      res.status(200).send({ comments: comments[0] });
    })
    .catch((err) => {
      next(err);
    });
};
