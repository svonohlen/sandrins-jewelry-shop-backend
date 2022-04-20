const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js"); //collection of standard and secure cryptographic algorithms, using it here for passwords
const jwt = require("jsonwebtoken");

//Register

router.post("/register", async (req, res) => {
  //could write if function here to check if any input is missing and provide according error message in catch block

  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      //encrypt pw
      req.body.password,
      process.env.PASSWORD_SECRET
    ).toString(), //to save in db write tostring
  });
  //save user to database, is async since it can take couple of ms. since it can fail try catch needed
  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//login

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username }); //findOne is mongodb function
    !user && res.status(401).json("wrong credentials"); //check if user exists
    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASSWORD_SECRET
    ); // decrypt password
    const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    OriginalPassword !== req.body.password &&
      res.status(401).json("wrong credentials"); //check if pw is correct

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SK,
      { expiresIn: "3d" }
    );

    const { password, ...others } = user._doc; //in order to not send pw, only others is being send (extracted password and others is the rest). _doc is needed since mongodb stores our documents(like user) in doc folder so cannot pass user directly in
    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
