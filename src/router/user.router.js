import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
  changeCurrentUserPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar
} from "../controller/user.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/authentication.middlewares.js";

const router = Router();

router.route("/register").post(upload.single("avatar"), registerUser);

router.route("/login").post(loginUser);
router.route("/logout").get(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentUserPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
router
  .route("/update-avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

export default router;
