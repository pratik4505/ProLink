
require('dotenv' ).config();


const express=require('express');
const mongoose = require('mongoose');
const HttpError = require('./models/http-error');
const googleAuth=require('./routes/auth/google_auth');
const authRoutes = require('./routes/auth/auth');
const postRoutes=require('./routes/posts/post');
const commentRoutes=require('./routes/posts/comments');
const userRoutes=require('./routes/users/profileRoutes');
const messageRoutes=require('./routes/message/messageRoutes');
const RNroutes=require('./routes/ReqAndNotify/RNroutes');
const searchRoutes=require('./routes/searchRoute');
const app =express();
const bodyParser = require('body-parser');
const MONGODB_URI=`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.0rkt5ow.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority`
const passport = require("passport");
const multer = require('multer');
const path = require('path');
const cookieParser = require('cookie-parser');
const jobRoutes = require('./routes/job/jobRoutes');
const helmet = require('helmet');
const cors=require('cors');
const fs = require('fs');

app.use(helmet());


app.use('/public', express.static(path.join(__dirname, 'public')));


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'image') {
     
      cb(null, './public/images/');
    } 
    else if (file.fieldname === 'video') {
      
      cb(null, './public/videos/');
    }
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
  }
});

  
const fileFilter = (req, file, cb) => {
  if (
    (file.fieldname === 'image' && (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg')) ||
    (file.fieldname === 'video' && (file.mimetype === 'video/mp4' || file.mimetype === 'video/mpeg'))
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter }).fields([
  { name: 'image', maxCount: 1 }, 
  { name: 'video', maxCount: 1 }, 
]);


app.use(helmet());

const allowedOrigins = process.env.NODE_ENV === 'production' ? process.env.PRODUCTION_ORIGIN : 'http://localhost:5173';
app.use(
  cors({
    origin: (origin, callback) => {
      if ( process.env.NODE_ENV === 'production') {
        if (!origin || allowedOrigins===origin) {
          callback(null, true);
        } else {
          callback(new Error(`${origin} not allowed by cors`));
        }
      } else {
        callback(null, true);
      }
    },
    optionsSuccessStatus: 200,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }),
);



app.use(passport.initialize());

app.use(cookieParser());

app.use(bodyParser.json());




//app.use(express.urlencoded({extended:true}));


app.use(upload);

app.use(userRoutes)
app.use(googleAuth);
app.use(authRoutes);
app.use(postRoutes);
app.use(commentRoutes);
app.use(jobRoutes);
app.use(messageRoutes);
app.use(RNroutes);
app.use(searchRoutes);


app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
  });
  
  app.use((error, req, res, next) => {
    if (res.headerSent) {
      return next(error);
    }
    
   res.status(500);
   
    if(error.data){
      res.json({ message: error.message || 'An unknown error occurred!',data:error.data });
    }
    else{
    res.json({ message: error.message || 'An unknown error occurred!' });

    }

  });



  mongoose
  .connect(
    MONGODB_URI
  )
  .then(result => {
     const server=app.listen(process.env.PORT||3000);
     const socketIo= require('./socket');
     const io=socketIo.init(server);
     socketIo.runIO(io);
    
    
  })
  .catch(err => console.log(err));

  

