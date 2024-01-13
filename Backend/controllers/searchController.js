const Post = require("../models/post");
const User = require("../models/user");
const Company = require("../models/company");

exports.getSearches = async (req, res) => {
  try {
    const encodedQuery = req.query.q;
    

    const userResults = await User.find(
      { $text: { $search: encodedQuery } },
      {
        score: { $meta: "textScore" },
        userName: 1,
        imageUrl: 1,
        summary: 1,
        _id: 1,
      }
    )
      .sort({ score: { $meta: "textScore" } })
      .lean();

    const postResults = await Post.find(
      { $text: { $search: encodedQuery } },
      { score: { $meta: "textScore" }, content: 1, _id: 1 }
    )
      .sort({ score: { $meta: "textScore" } })
      .lean();

    const companyResults = await Company.find(
      { $text: { $search: encodedQuery } },
      { score: { $meta: "textScore" }, name: 1, _id: 1 }
    )
      .sort({ score: { $meta: "textScore" } })
      .lean();

    postResults.forEach((post) => {
      if (post.content.length > 20) {
        post.content = post.content.substring(0, 20) + "...";
      }
    });

    res.json({ users:userResults, posts:postResults,companies: companyResults });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
