import Router from "express";

import {
    createPost,
    deletePost,
    getAllPosts,
    likeAndUnlikePost,
    commentOnPost,
    deleteCommentOnPost,
    updateCommentOnPost,
    editCaptionOnPost,
    editPost,
} from "../controller/post.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import {verifyJWT} from "../middlewares/authentication.middlewares.js"

const router = Router();

router.route("/create-post").post(verifyJWT , upload.single("post") , createPost);
router.route("/delete-post/:id").delete(verifyJWT , deletePost);
router.route("/get-all-posts").get(verifyJWT , getAllPosts);
router.route("/like-unlike-post/:id").patch(verifyJWT , likeAndUnlikePost);
router.route("/comment-on-post/:id").post(verifyJWT , commentOnPost);
router.route("/delete-comment-on-post/:id").delete(verifyJWT , deleteCommentOnPost);
router.route("/update-comment-on-post/:id").put(verifyJWT , updateCommentOnPost);
router.route("/edit-caption-on-post/:id").put(verifyJWT , editCaptionOnPost);
router.route("/edit-post/:id").put(verifyJWT , upload.single("post") , editPost);

export default router;