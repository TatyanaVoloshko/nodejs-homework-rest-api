const express = require("express");

const upload = require("../../middlewares/upload")

const UserController = require("../../controllers/users")

const router = express.Router();


router.patch(
  "/avatars",
  upload.single("avatarURL"), UserController.uploadAvatar
);

module.exports = router;