const express = require("express");
const router = express.Router();

const postController=require('../../controllers/posts/post');
const isAuth=require('../../controllers/auth/is-auth');




router.post('/addPost',isAuth,postController.addPost);

router.get('/getPost/:postId',isAuth,postController.getPost);

router.get('/getFeeds',isAuth,postController.getFeeds);

router.get('/postUnlike/:postId',isAuth,postController.postUnlike);

router.post('/post/like',isAuth,postController.postLike);



router.get('/post/likesByUser',isAuth,postController.likesByUser);

module.exports = router;