exports.handleCustoms = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: "No article found" });
  }
  next(err);
};
exports.handlePsqlErrors = (err, req, res, next) => {
  if ((err.code = "22P02" && !err.status))
    res.status(400).send({ msg: "bad request" });
  next(err);
};
exports.handle500s = (err, req, res, next) => {
  res.status(500).send({ msg: "server error" });
};
