const { fetchTopics, selectArticleById } = require("../models/models");

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
