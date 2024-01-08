const express = require("express");
const router = express.Router();
const profileController = require('../../controllers/user/profile')
const isAuth=require('../../controllers/auth/is-auth');

router.get('/isAuth',isAuth,profileController.isAuthorized)
router.get('/profile/getUserProfile/:ownerId',isAuth, profileController.getUserProfile);

router.post('/profile/postDetails',isAuth,profileController.postDetails);

router.post('/profile/postAbout',isAuth,profileController.postAbout);

router.post('/profile/postEducation/:educationId',isAuth,profileController.postEducation);

router.post('/profile/postExperience/:experienceId',isAuth,profileController.postExperience);

router.post('/profile/addSkill',isAuth,profileController.addSkill);

router.delete('/profile/deleteSkill/:key',isAuth,profileController.deleteSkill);

router.post('/profile/endorse',isAuth,profileController.endorse);

router.post('/profile/addSection',isAuth,profileController.addSection);

router.delete('/profile/deleteSection/:key',isAuth,profileController.deleteSection);

router.post('/profile/postRequest',isAuth,profileController.postRequest);

router.post('/profile/addProfileImage',isAuth,profileController.addProfileImage);

module.exports = router;