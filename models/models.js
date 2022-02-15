const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics").then(({ rows }) => {
    return rows;
  });
};

exports.selectArticleById = (articleId) => {
  return db
    .query("SELECT * FROM articles WHERE article_id=$1", [articleId])
    .then((result) => {
      const articleArray = result.rows;
      if (articleArray.length === 0) {
        return Promise.reject({ status: 404, msg: "No article found" });
      }
      return articleArray[0];
    });
};
