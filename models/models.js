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
  if (isNaN(+article_id)) {
    return Promise.reject({ status: 400, msg: "invalid article ID" });
  } else if (newVote === undefined) {
    return Promise.reject({ status: 400, msg: "missing required fields" });
  } else if (isNaN(+newVote)) {
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
  return db.query("SELECT * FROM users").then(({ rows }) => {
    return rows;
  });
};

exports.fetchUser = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username=$1`, [username])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "user not found" });
      } else {
        return rows;
      }
    });
};

exports.fetchArticles = (sort = "created_at", order = "desc", topic = "") => {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.body, articles.article_id, articles.topic, articles.created_at, articles.votes,
      CAST(COUNT(comments.article_id) AS INT) AS comment_count 
      FROM articles 
      LEFT JOIN comments 
      ON comments.article_id = articles.article_id
      WHERE articles.topic like '%${topic}%'
      GROUP BY articles.article_id
      ORDER BY ${sort} ${order};`
    )
    .then(({ rows }) => {
      return rows;
    });
};
exports.fetchComments = (articleId) => {
  return db
    .query(
      "SELECT author, created_at, votes, body, comment_id, article_id FROM comments WHERE article_Id=$1 ",
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
exports.checkQueries = (sort = "created_at", order = "desc", topic = "") => {
  const sortArray = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "comment_count",
  ];
  const orderArray = ["desc", "asc"];
  const topicArray = [""];

  return db.query("SELECT * FROM topics").then(({ rows }) => {
    rows.map((row) => {
      topicArray.push(row["slug"]);
    });
    if (!sortArray.includes(sort)) {
      return Promise.reject({ status: 400, msg: "invalid `sort_by` query" });
    } else if (!orderArray.includes(order)) {
      return Promise.reject({ status: 400, msg: "invalid `order` query" });
    } else if (!topicArray.includes(topic)) {
      return Promise.reject({ status: 404, msg: "non-existent `topic` query" });
    }
  });
};

exports.checkArticleId = (articleId) => {
  return db
    .query("SELECT * FROM articles WHERE article_Id=$1", [articleId])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "No article found" });
      }
    });
};

exports.checkCommentKeys = (keys, object) => {
  const newArr = [];
  for (let i = 0; i < keys.length; i++) {
    if (!object.hasOwnProperty(keys[i])) {
      return Promise.reject({
        status: 400,
        msg: `missing ${keys[i]} property`,
      });
    }
  }
};

exports.checkUserName = (username) => {
  return db
    .query("SELECT * FROM users WHERE username=$1", [username])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "username does not exist" });
      }
    });
};

exports.addComment = (username, body, articleId) => {
  return db
    .query(
      "INSERT INTO comments (author, body, article_id) VALUES($1, $2, $3) RETURNING *;",
      [username, body, articleId]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "No article found" });
      } else return rows[0];
    });
};

exports.removeCommentByID = (commentId) => {
  if (isNaN(+commentId)) {
    return Promise.reject({
      status: 400,
      msg: "invalid ID, e.g not-an-id",
    });
  } else {
    return db
      .query("DELETE FROM comments WHERE comment_Id =$1 RETURNING *;", [
        commentId,
      ])
      .then(({ rows }) => {
        return {};
      });
  }
};

exports.checkCommentById = (commentId) => {
  return db
    .query("SELECT * FROM comments WHERE comment_Id =$1", [commentId])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "non existent comment ID" });
      }
    });
};
