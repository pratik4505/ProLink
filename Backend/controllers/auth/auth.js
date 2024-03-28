require("dotenv").config();
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const HttpError = require("../../models/http-error");
const User = require("../../models/user");
const Token = require("../../models/token");

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    let loadedUser = await User.findOne({ email: email });
    if (!loadedUser) {
      const error = new HttpError(
        "A user with this email could not be found.",
        401
      );

      throw error;
    }

    if (!loadedUser.password) {
      const error = new HttpError("Please sign in with Google", 401);

      throw error;
    }

    const isEqual = await bcrypt.compare(password, loadedUser.password);

    if (!isEqual) {
      const error = new HttpError("Wrong password!", 401);

      throw error;
    }

    const token = jwt.sign(
      {
        email: loadedUser.email,
        userId: loadedUser._id.toString(),
      },
      process.env.SECRET_KEY
    );

    // _id userName imageUrl email
    // res.cookie('token', token,{ secure: true, sameSite: 'None' });
    // res.cookie('userId', loadedUser._id.toString() ,{ secure: true, sameSite: 'None' });
    res
      .status(200)
      .json({
        
        email: loadedUser.email,
        imageUrl: loadedUser.imageUrl,
        userName: loadedUser.userName,
        token: token,
        userId: loadedUser._id.toString(),
      });
    // res.status(200).json({ token: accessToken, userId: loadedUser._id.toString() });
  } catch (err) {
    next(err);
  }
};

// Route for sending an email with the verification OTP
exports.signUp = async (req, res, next) => {
  const errors = validationResult(req);
  const email = req.body.email;
  const password = req.body.password;
  const userName = req.body.userName;

  try {
    // Check for validation errors

    if (!errors.isEmpty()) {
      return next(new HttpError("Validation failed", 422, errors.array()));
    }

    // Check if the user with the given email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new HttpError("User already exists", 409));
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      email,
      password: hashedPassword,
      userName,
    });

    // Save the user to the database
    const result = await user.save();

    res.status(201).json({ message: "User created!", userId: result._id });
  } catch (err) {
    return next(err);
  }
};

exports.verify = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;
  const otp = req.body.otp;
  const key = `${email}:${password}`;
  const storedData = emailTokens.get(key);

  if (storedData) {
    const { secret, createdAt } = storedData;
    const isValid = authenticator.check(otp, secret);

    if (isValid && Date.now() - createdAt <= 5 * 60 * 1000) {
      // Successful verification within the 5-minute window
      emailTokens.delete(key); // Remove the entry from storage

      try {
        const hashedPw = await bcrypt.hash(password, 10);
        const user = new User({
          email: email,
          password: hashedPw,
          username: username,
        });
        const result = await user.save();
        res
          .status(201)
          .json({
            message: "Email verified and User created!",
            userId: result._id,
          });
      } catch (err) {
        next(new HttpError(err.message, err.status));
      }
    } else {
      res.status(401).json({ message: "Invalid OTP or OTP has expired" });
    }
  } else {
    res.status(401).json({ message: "Invalid email address or password" });
  }
};
