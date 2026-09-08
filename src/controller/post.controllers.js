import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import cloudinary from "cloudinary";

const createPost = asyncHandler(async (req, res) => {
  const { caption } = req.body;

  const loginUserId = req.user._id;

  const file = req.file?.path;

  if (!file) {
    throw new ApiError(401, "file is required");
  }

  const fileUpload = await uploadOnCloudinary(file);

  if (!fileUpload) {
    throw new ApiError(500, "File upload on cloudinary error");
  }

  const newPost = await Post.create({
    caption,
    post: {
      id: fileUpload.public_id,
      secure_url: fileUpload.secure_url,
      resource_type: fileUpload.resource_type,
    },

    type: "post",

    owner: loginUserId,
  });

  return res.status(201).json({
    message: "Post created successfully",
    newPost,
  });
});

const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const loginUserId = req.user._id;

  const post = await Post.findById(id);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  if (post.owner.toString() !== loginUserId.toString()) {
    throw new ApiError(403, "You are not the owner of this post");
  }

  await cloudinary.v2.uploader.destroy(post.post.id);
  await Post.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Post deleted successfully"));
});

const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find()
    .populate("owner", "name email")
    .populate("likes", "name email")
    .populate("comments.user", "name    email");

  return res
    .status(200)
    .json(new ApiResponse(200, posts, "Posts fetched successfully"));
});

const likeAndUnlikePost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const loginUserId = req.user._id;

  const post = await Post.findById(id);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const isLiked = post.likes.includes(loginUserId);

  if (isLiked) {
    post.likes.pull(loginUserId);
    await post.save();
    return res
      .status(200)
      .json(new ApiResponse(200, post, "Post unliked successfully"));
  } else {
    post.likes.push(loginUserId);
    await post.save();
    return res
      .status(200)
      .json(new ApiResponse(200, post, "Post liked successfully"));
  }
});

const commentOnPost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;

  const post = await Post.findById(id);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  post.comments.push({
    user: req.user._id,
    name: req.user.fullName,
    comment,
  });

  await post.save();

  return res
    .status(200)
    .json(new ApiResponse(200, post, "Comment added successfully"));
});

const deleteCommentOnPost = asyncHandler(async (req , res) => {

const {id} = req.params;

const post = await Post.findById(id);

if(!post){
    throw new ApiError(404 , "Post not found");
}

const commentIndex = post.comments.findIndex(comment => comment.user.toString() === req.user._id.toString());

if(commentIndex === -1){
    throw new ApiError (404 , "Comment not found");
}

post.comments.splice(commentIndex, 1);
await post.save();

return res
    .status(200)
    .json(new ApiResponse(200, post, "Comment deleted successfully"));
});

const updateCommentOnPost = asyncHandler(async (req , res) => {

const {id} = req.params;

const {comment} = req.body;

const post = await Post.findById(id);

if(!post){
    throw new ApiError(404 , "Post not found");
}

const commentIndex = post.comments.findIndex(comment => comment.user.toString() === req.user._id.toString());

if(commentIndex === -1){
    throw new ApiError (404 , "Comment not found");
}

post.comments[commentIndex].comment = comment;
await post.save();

return res
    .status(200)
    .json(new ApiResponse(200, post, "Comment updated successfully"));
});

const editCaptionOnPost = asyncHandler(async (req , res) => {

const {id} = req.params;

const {caption} = req.body;

const post = await Post.findById(id);

if(!post){
    throw new ApiError(404 , "Post not found");
}

if (
    post.owner.toString() !==
    req.user._id.toString()
) {
    throw new ApiError(
        403,
        "You are not the owner of this post"
    );
}

post.caption = caption;
await post.save();

return res
    .status(200)
    .json(new ApiResponse(200, post, "Caption updated successfully"));
});

const editPost = asyncHandler(async (req , res) => {

const {id} = req.params;

const post = await Post.findById(id);

if(!post){
    throw new ApiError(404 , "Post not found");
}

const file = req.file?.path;

if(!file){
    throw new ApiError(401 , "file is required");
};

if(post.owner.toString() !== req.user._id.toString()){
    throw new ApiError(403 , "You are not the owner of this post");
};

await cloudinary.v2.uploader.destroy(post.post.id);

const fileUpload = await uploadOnCloudinary(file);

if(!fileUpload){
    throw new ApiError(500 , "File upload on cloudinary error");
};

post.post = {
    id: fileUpload.public_id,
    secure_url: fileUpload.secure_url,
    resource_type: fileUpload.resource_type,
};

await post.save();

return res
    .status(200)
    .json(new ApiResponse(200, post, "Post updated successfully"));
});

export {
  createPost,
  deletePost,
  getAllPosts,
  likeAndUnlikePost,
  commentOnPost,
  deleteCommentOnPost,
  updateCommentOnPost,
  editCaptionOnPost,
  editPost
};
