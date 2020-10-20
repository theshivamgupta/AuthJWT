const router = require("express").Router();
const User = require("../models/User");

router.get("/", (req, res) => {
  res.json({ posts: { title: "My first post", description: "random data" } });
});

module.exports = router;
