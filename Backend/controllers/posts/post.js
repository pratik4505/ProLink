
const Post = require('../../models/post');
const User = require('../../models/user');
const Company = require('../../models/company');




exports.addPost=async (req, res) => {
  try {
    const { type, ownerId, content } = req.body;

    let imageUrl = undefined;
    let videoUrl = undefined;
   
   
    if(req.files){
        if (req.files['image']) {
            imageUrl = req.files['image'][0].path;
          }
      
          
          if (req.files['video']) {
            videoUrl = req.files['video'][0].path;
          }
      
    }

    // Create a new post
    const newPost = new Post({
      content: content,
      type: type,
      userId: type === 'user' ? ownerId : undefined,
      companyId: type === 'company' ? ownerId : undefined,
      imageUrl: imageUrl,
      videoUrl: videoUrl,
    });

    // Save the new post to the database
    const savedPost = await newPost.save();

    // Update the user or company with the post ID
    if (type === 'user') {
      // Update the user's posts array
      const user = await User.findByIdAndUpdate(ownerId, {
        $push: { posts: savedPost._id },
      });

      return res.status(200).json({ message: 'Post added successfully' });
    } else if (type === 'company') {
      // Update the company's posts array
      const company = await Company.findByIdAndUpdate(ownerId, {
        $push: { posts: savedPost._id },
      });

      return res.status(200).json({ message: 'Post added successfully' });
    } else {
      return res.status(400).json({ message: 'Invalid type specified' });
    }
  } catch (error) {
    
    return res.status(500).json({ message: 'An error occurred while adding the post' });
  }
};


exports.getPost=async (req,res)=>{

    try {
        const postId = req.params.postId;
        const loggedInUserId = req.userId;
    
        // Find the post by its ID
        const post = await Post.findById(postId);
    
        if (!post) {
          return res.status(404).json({ message: 'Post not found' });
        }
    
        // Initialize variables to store user or company details
        let ownerIdData = null;
        let imageUrl = undefined;
        let summary = undefined;
        let name = undefined;
    
        if (post.type === 'user' && post.userId) {
          // If the post type is 'user', fetch user details
          const user = await User.findById(post.userId).select('_id imageUrl summary userName');
          if (user) {
            ownerIdData = user._id;
            imageUrl = user.imageUrl;
            summary = user.summary;
            name = user.userName;
          }
        } else if (post.type === 'company' && post.companyId) {
          // If the post type is 'company', fetch company details
          const company = await Company.findById(post.companyId).select('_id companyLogo industry name');
          if (company) {
            ownerIdData = company._id;
            imageUrl = company.companyLogo;
            summary = company.industry;
            name = company.name;
          }
        }
    
        // Calculate the like count for the post
        let likeCount = 0;
        if(post.likedBy)
        likeCount = post.likedBy.size;
    
       
        const commentCount = post.comments.length;
    
        const user = await User.findById(loggedInUserId).select('likedPosts');
        

        
        let likeType = undefined;
        let hasLiked=false;
  
        if(User.likedPosts)
       hasLiked = User.likedPosts.has(postId.toString())

       

        if(hasLiked) {
         likeType =user.likedPosts.get(postId); 
        }
       

        
        
        
    
        // Construct the response object
        const responseData = {
            postImageUrl: post.imageUrl || undefined,
            videoUrl: post.videoUrl || undefined,
            type: post.type,
            ownerId: ownerIdData,
            likeCount: likeCount,
            commentCount: commentCount,
            hasLiked: hasLiked,
            likeType: likeType,
            profileImageUrl: imageUrl || undefined, // Alias the imageUrl field to profileImageUrl
            name: name,
            summary: summary,
            createdAt: post.createdAt,
            content: post.content,
            _id:post._id
          };
          
        res.status(200).json(responseData);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching the post' });
      }
    

};

exports.getFeeds=async (req, res) => {
  try {
    const { limit, afterDate } = req.query;
    const userId = req.userId;

    const loggedInUser = await User.findById(userId).select('connections companyFollows likedPosts');

    if (!loggedInUser) {
      return res.status(404).json({ message: 'User not found' });
    }

   
    const filter = {
      $or: [
        { userId: { $in: loggedInUser.connections } },
        { companyId: { $in: loggedInUser.companyFollows } },
      ],
      createdAt: { $lt: new Date(afterDate) },
    };

    // const filter = {
      
    //   createdAt: { $lt: new Date(afterDate) },
    // };

    
    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    
    const responseData = [];

    
    for (const post of posts) {
      let ownerIdData = null;
      let imageUrl = undefined;
      let summary = undefined;
      let name = undefined;

      if (post.type === 'user' && post.userId) {
        const user = await User.findById(post.userId).select('_id imageUrl summary userName');
        if (user) {
          ownerIdData = user._id;
          imageUrl = user.imageUrl;
          summary = user.summary;
          name = user.userName;
        }
      } else if (post.type === 'company' && post.companyId) {
        const company = await Company.findById(post.companyId).select('_id companyLogo industry name');
        if (company) {
          ownerIdData = company._id;
          imageUrl = company.companyLogo;
          summary = company.industry;
          name = company.name;
        }
      }


      let likeCount = 0;
        if(post.likedBy)
        likeCount = post.likedBy.size;
    
       
      const commentCount = post.comments.length;

      let likeType = undefined;
      let hasLiked=false;

      if(loggedInUser.likedPosts)
    {
      hasLiked = loggedInUser.likedPosts.has(post._id.toString())
      
    }
    

      
      if(hasLiked) {
       likeType =loggedInUser.likedPosts.get(post._id); 
      }


     
        
      

      const postResponse = {
        postImageUrl: post.imageUrl || undefined,
        videoUrl: post.videoUrl || undefined,
        type: post.type,
        ownerId: ownerIdData,
        likeCount: likeCount,
        commentCount: commentCount,
        hasLiked: hasLiked,
        likeType: likeType,
        profileImageUrl: imageUrl || undefined,
        name: name,
        summary: summary,
        createdAt: post.createdAt,
        content: post.content,
        _id: post._id,
      };

      responseData.push(postResponse);
    }

    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error fetching feed:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}


exports.postLike =async (req, res) =>  {
  const { postId, likeType } = req.query;
  const userId = req.userId; 

  try {
    
    await User.findByIdAndUpdate(
      userId,
      { $set: { [`likedPosts.${postId}`]: likeType } }
      
    );

   
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $set: { [`likedBy.${userId}`]: likeType } }
      
    );

    res.json(updatedPost);
  } catch (error) {
    console.error('Error updating like:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

exports.postUnlike=async (req, res) => {
 
  const  postId  = req.params.postId;
  const userId = req.userId; 
  
  try {
    
    await User.findByIdAndUpdate(
      userId,
      { $unset: { [`likedPosts.${postId}`]: 1 } }
    );

   
    await Post.findByIdAndUpdate(
      postId,
      { $unset: { [`likedBy.${userId}`]: 1 } }
    );

    res.status(204).json({message:"post unliked successfully"}); 
  } catch (error) {
    console.error('Error updating unlike:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

}

exports.likesByUser = async (req, res)=> {
  const { postId, skip, limit } = req.query;

  try {
   
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    
    const likedByMap = post.likedBy;

    
    const likedByArray = Array.from(likedByMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));

   
    const slicedLikedByArray = likedByArray.slice(skip, skip + limit);

   
    const data = [];

    
    for (const [userId, likeType] of slicedLikedByArray) {
      
      const user = await User.findById(userId).select('userName summary imageUrl');

      if (user) {
        // Add user details to the data array
        data.push({
          id: userId,
          likeType,
          userName: user.userName,
          summary: user.summary,
          imageUrl: user.imageUrl
        });
      }
    }

    
    const hasMore = likedByArray.length > skip + limit;

    res.status(200).json({ data, hasMore });
  } catch (error) {
    console.error('Error fetching likes by user data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
