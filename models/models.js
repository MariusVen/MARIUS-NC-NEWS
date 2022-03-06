const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics").then(({ rows }) => {
    return rows;
  });
};

exports.selectArticleById = (articleId) => {
  return db
    .query(
      `SELECT articles.*, 
       CAST(COUNT(comments.article_id) AS INT) AS comment_count 
       FROM articles 
       LEFT JOIN comments 
       ON comments.article_id = articles.article_id 
       WHERE articles.article_id=$1
       GROUP BY articles.article_id;`,
      [articleId]
    )
    .then((result) => {
      const articleArray = result.rows;
      if (articleArray.length === 0) {
        return Promise.reject({ status: 404, msg: "No article found" });
      }
      return articleArray[0];
    });
};

exports.updateArticleByID = (voteToAdd, article_id) => {
  const newVote = voteToAdd.inc_votes;
  if (newVote === undefined) {
    return Promise.reject({ status: 400, msg: "missing required fields" });
  } else if (typeof newVote != "number") {
    return Promise.reject({
      status: 400,
      msg: "input property is incorrect type",
    });
  }
  return db
    .query(
      "UPDATE articles SET votes = votes+ $1 WHERE article_id=$2 RETURNING *;",
      [newVote, article_id]
    )
    .then((result) => {
      const articleArray = result.rows;
      if (articleArray.length === 0) {
        return Promise.reject({ status: 404, msg: "No article found" });
      }
      return result.rows[0];
    });
};

exports.fetchUsers = () => {
  return db.query("SELECT username FROM users").then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticles = () => {
  return db
    .query(
      "SELECT author, title, article_id, topic, created_at, votes FROM articles ORDER BY created_at desc"
    )
    .then(({ rows }) => {
      return rows;
    });
};
exports.fetchComments = (articleId) => {
  return db
    .query(
      "SELECT author, created_at, votes, body, comment_id FROM comments WHERE article_Id=$1",
      [articleId]
    )
    .then(({ rows }) => {
      const commentArray = rows;
      if (commentArray.length === 0) {
        return [];
      }
      return commentArray;
    });
};

exports.checkArticleId = (articleId) => {
  return db
    .query("SELECT * FROM articles WHERE article_Id=$1", [articleId])
    .then(({ rows }) => {
      if (rows.length === 0) {
        console.table(rows);
        return Promise.reject({ status: 404, msg: "No article found" });
      }
    });
};
