require('dotenv' ).config();
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const HttpError = require("../../models/http-error");
const User = require("../../models/user");
const Token=require("../../models/token");

const { authenticator } = require("otplib");

// let ElasticEmail = require('@elasticemail/elasticemail-client');
// Temporary storage for email verification tokens with creation time


// const emailTokens = new Map();


// Function to generate an OTP
// const generateOtp = () => {
//   const secret = authenticator.generateSecret();
//   const otp = authenticator.generate(secret);
//   return { otp, secret, createdAt: Date.now() };
// };

 // Send an email with the OTP
    // const mailOptions = {
    //   from: process.env.EMAIL,
    //   to: email,
    //   subject: "Email Verification OTP",
    //   text: `Your OTP for email verification is: ${otp}`,
    // };
  
    // transporter.sendMail(mailOptions, (error, info) => {
      
    //   try{
    //     if (error) {
    //       console.log(error);
    //       throw new HttpError('Email could not be sent',500);
    //     } else {
    //       // Store the secret, email, password, and creation time in temporary storage
    //       const key = `${email}:${password}`;
    //       emailTokens.set(key, { secret, createdAt });
    //       res.status(200).json({ message: "Email sent successfully" });
    //     }
    //   }catch(err){
    //     next(err);
    //   }
     
    // });




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
      const error = new HttpError(
        "Please sign in with Google",
        401
      );

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

    const accessToken = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "6h",
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET_KEY, {
      expiresIn: "7d",
    });

    const newRefreshToken = new Token({
      user: existingUser._id,
      refreshToken,
      accessToken,
    });
    await newRefreshToken.save();

    res.cookie('token', accessToken);
    res.cookie('userId', loadedUser._id.toString());

    // res.cookie('token', token, {
    //   expires: expiryTime,
    //   httpOnly: true, // The cookie cannot be accessed by client-side scripts
    //   secure: process.env.NODE_ENV === 'production', // Set to true in production for HTTPS
    //   sameSite: 'None', // Required for cross-site cookies in modern browsers
    // });
  
    // res.cookie('userId', loadedUser._id.toString(), {
    //   expires: expiryTime,
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'None',
    // });


    res.status(200).json({ token: accessToken, userId: loadedUser._id.toString() });
  } catch (err) {
    next(err);
  }
};

// Route for sending an email with the verification OTP
exports.signUp = async (req, res,next) => {
  const errors = validationResult(req);
  const email = req.body.email;
  const password = req.body.password;
  const userName = req.body.userName;
  
  try {
    // Check for validation errors
   
    if (!errors.isEmpty()) {
      return next(new HttpError('Validation failed', 422, errors.array()));
    }

   

    // Check if the user with the given email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new HttpError('User already exists', 409));
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

    res.status(201).json({ message: 'User created!', userId: result._id });
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

      try{
      const hashedPw = await bcrypt.hash(password, 10);
      const user = new User({
        email: email,
        password: hashedPw,
        username: username
      });
      const result = await user.save();
      res.status(201).json({ message: "Email verified and User created!", userId: result._id });
    }
    catch (err) {

      next(new HttpError(err.message, err.status));
     
    } 

  }
    else {
      res.status(401).json({ message: "Invalid OTP or OTP has expired" });
    }
  } 
  
  else {
    res.status(401).json({ message: "Invalid email address or password" });
  }
};
