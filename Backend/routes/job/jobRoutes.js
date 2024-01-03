const express = require("express");
const router = express.Router();
const jobsController=require("../../controllers/job/job");
const isAuth=require("../../controllers/auth/is-auth");
router.get('/jobs/getJobs',isAuth,jobsController.getJobs);

router.get('/jobs/getJobSearch',isAuth,jobsController.getJobSearch);

module.exports = router;
