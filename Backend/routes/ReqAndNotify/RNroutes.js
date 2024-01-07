const express = require("express");
const router = express.Router();

const RNcontroller=require('../../controllers/ReqAndNotify/RNcontroller')
const isAuth=require('../../controllers/auth/is-auth');

router.get('/notification/getNotifications',isAuth,RNcontroller.getNotifications);

router.get('/request/getRequests',isAuth,RNcontroller.getRequests);

router.post('/request/handleRequest',isAuth,RNcontroller.handleRequest);

module.exports = router;