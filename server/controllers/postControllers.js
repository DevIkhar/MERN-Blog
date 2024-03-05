const User = require("../models/userModel");
const Post = require("../models/postModel");
const HttpError = require("../models/errorModel");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

// ====================== Create A Post
// POST: api/posts
// PROTECTED
const createPost = async (req, res, next) => {
  try {
    let { title, description, category } = req.body;
    if (!title || !description || !category || !req.files) {
      return next(
        new HttpError("Fill in all fields and choose thumbnail", 422)
      );
    }
    const { thumbnail } = req.files;
    if (thumbnail.size > 2000000) {
      return next(
        new HttpError("Thumbnial should to big! file should less than 2mb")
      );
    }
    let fileName = thumbnail.name;
    let splittedFilename = fileName.split(".");
    let newFilename =
      splittedFilename[0] +
      uuid() +
      "." +
      splittedFilename[splittedFilename.length - 1];
    thumbnail.mv(
      path.join(__dirname, "..", "uploads", newFilename),
      async (err) => {
        if (err) {
          return next(new HttpError(err));
        }
        const newPost = await Post.create({
          title,
          category,
          description,
          thumbnail: newFilename,
          creator: req.user.id,
        });
        if (!newPost) {
          return next(new HttpError("Post couldn't be change", 422));
        }
        // Find a user and increment count bu 1
        const currentUser = await User.findById(req.user.id);
        const userPostCount = currentUser.posts + 1;
        await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });
        res.status(201).json(newPost);
      }
    );
  } catch (error) {
    return next(new HttpError(error));
  }
};

// ====================== Get All Posts
// GET: api/posts
// UNPROTECTED
const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ updatedAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    return next(new HttpError(error));
  }
};

// ====================== Get single post
//GET: api/posts/:id
// UNPROTECTED
const getPost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return next(new HttpError("Post not found", 404));
    }
    res.status(200).json(post);
  } catch (error) {
    return next(new HttpError(error));
  }
};

// ======================Get post by category
// GET: api/posts/categories/category
// UNPROTECTED
const getCatPosts = async (req, res, next) => {
  try {
    const { category } = req.params;
    const catPosts = await Post.find({ category }).sort({ createdAt: -1 });
    res.status(200).json(catPosts);
  } catch (error) {
    return next(new HttpError(error));
  }
};

// ====================== Get User/Author post
// GET: api/posts/users/:id
// UNPROTECTED
const getUserPosts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const posts = await Post.find({ creator: id }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    return next(new HttpError(error));
  }
};

// =====================Edit Posts
// PATCH : api/posts/:id
// UNPROTECTED
const editPost = async (req, res, next) => {
  try {
    let fileName;
    let newFilename;
    let updatedPost;
    const postId = req.params.id;
    let { title, category, description } = req.body;

    if (!title || !category || !description.length < 12) {
      return next(new HttpError("Fill in all fields.", 422));
    }
      // get old post from db
      const oldPost = await Post.findById(postId);
    if(req.user.id == oldPost.creator){
    if (!req.files) {
      updatedPost = await Post.findOneAndUpdate(
        postId,
        { title, description, category },
        { new: true }
      );
    } else {
      // delete old thumbnail form uploads
      fs.unlink(
        path.join(__dirname, "..", "uploads", oldPost.thumbnail),
        async (err) => {
          if (err) {
            return next(new HttpError(err));
          }
        }
      );

      // upload new thumbnail
      const { thumbnail } = req.files;
      // check file size
      if (thumbnail.size > 200000) {
        return next(
          new HttpError("Thumbnail is too big, should less than 2mb")
        );
      }
      fileName = thumbnail.name;
      let splittedFilename = fileName.split(".");
      newFilename =
        splittedFilename[0] +
        uuid() +
        "." +
        splittedFilename[splittedFilename.length - 1];
      thumbnail.mv(
        path.join(__dirname, "..", "uploads", newFilename),
        async (err) => {
          if (err) {
            return next(new HttpError(err));
          }
        }
      );

      updatedPost = await Post.findByIdAndUpdate(
        postId,
        { title, category, description, thumbnail: newFilename },
        { new: true }
      );
    }
}
    if (!updatedPost) {
      return next(new HttpError("Couldn't Update Post", 400));
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    return next(new HttpError(error));
  }
};

// =====================Delete Posts
// PATCH : api/posts/:id
// UNPROTECTED
const deletePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    if (!postId) {
      return next(new HttpError("Post Unavailable !", 400));
    }
      const post = await Post.findById(postId);
      const fileName = post?.thumbnail;

      if(req.user.id == post.creator){
      // delete thumbnail from uploads folder
      fs.unlink(
        path.join(__dirname, "..", "uploads", fileName),
        async (err) => {
          if (err) {
            return next(new HttpError(err));
          } else {
            await Post.findByIdAndDelete(postId);
            // Find user and reduce post count by 1
            const currentUser = await User.findById(req.user.id);
            const userPostCount = currentUser?.posts - 1;
            await User.findByIdAndUpdate(req.user.id, {posts: userPostCount})
            res.json(`Post ${postId} delete successfully.`)
          }
        })
    }else{
        return next(new HttpError("Post couldn't be deleted.", 403))
    }
    
  } catch (error) {
    return next(new HttpError(error));
  }
};

module.exports = {
  createPost,
  getCatPosts,
  getPosts,
  getPost,
  getUserPosts,
  editPost,
  deletePost,
};
