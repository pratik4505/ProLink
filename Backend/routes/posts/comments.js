const express = require("express");
const router = express.Router();
const commentController=require('../../controllers/posts/comment');
const isAuth=require('../../controllers/auth/is-auth');
router.get('/post/getComments/:postId',isAuth,commentController.getComments );

router.post('/post/addComment',isAuth,commentController.addComment);

router.post('/post/comment/addReply',isAuth,commentController.addReply);

module.exports = router;