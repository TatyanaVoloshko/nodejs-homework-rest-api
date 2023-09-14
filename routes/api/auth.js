const express = require('express');

const router = express.Router();

const AuthController = require("../../controllers/auth");
const auth = require("../../middlewares/auth")

const jsonParser = express.json();

router.post("/register", jsonParser, AuthController.register);
router.post("/login", jsonParser, AuthController.login);
router.post("/logout", auth, AuthController.logout);
router.get("/current", auth, AuthController.getCurrent);
router.get("/verify/:verificationToken", AuthController.verify);
router.post("/verify", AuthController.resendVerifyEmail);

module.exports = router;