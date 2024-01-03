const express = require("express");
const router = express.Router();
const messageController=require('../../controllers/message/message');
const isAuth=require("../../controllers/auth/is-auth");

router.get('/message/getChats',isAuth,messageController.getChats);

router.get('/message/getMessages',isAuth,messageController.getMessages);

router.post('/message/getPossibleChats',isAuth,messageController.getPossibleChats);

router.get('/message/createChat/:id',isAuth,messageController.createChat);

router.post('/message/postMessage',isAuth,messageController.postMessage);

module.exports = router;
