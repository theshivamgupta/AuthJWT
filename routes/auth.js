const router = require("express").Router();
const User = require("../models/User");
const { registerValidation, loginValidation } = require("../validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  // lets validate
  try {
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
  } catch (err) {
    return res.status(400).send(err);
  }

  //checking if email already exists
  //  const emailExists = await User.findOne({ email: req.body.email });
  //  if (emailExists) return res.status(400).send("Email Already Exists");

  //hashing the password
  const salt = await bcrypt.genSalt(10);
  const hashPass = await bcrypt.hash(req.body.password, salt);
  console.log("here");
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPass,
  });
  try {
    const saveduser = await user.save();
    res.send({ user: user._id });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
  } catch (err) {
    return res.status(400).send(err);
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email Does not Exists");

  // if password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Wrong Password");

  //create and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.SECRET);
  res.header("authToken", token).send(token);

  // res.send("Logged in");
});

module.exports = router;
