const express = require("express");
const router = express.Router();
const isAuth=require("../controllers/auth/is-auth");
const searchController = require('../controllers/searchController');

router.get("/search",isAuth,searchController.getSearches);

module.exports = router;