const { v4: uuidv4 } = require("uuid");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authSchema, emailSchema } = require("../schemas/users");

const User = require("../models/user");

const sendEmail = require("../helpers/sendMail");
const user = require("../models/user");

async function register(req, res, next) {
  try {
    const { error } = authSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.message });
      return;
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email }).exec();

    if (user !== null) {
      return res.status(409).json({ message: "Email in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const verificationToken = uuidv4();

    const newUser = await User.create({
      email,
      password: passwordHash,
      verificationToken,
    });

    await sendEmail({
      to: email,
      subject: "Email confirmation",
      html: `<p>To confirm your registration, please click on the link below:</p>
      <a href='http://localhost:3000/users/verify/${verificationToken}'>Click me</a>`,
      text: `To confirm your registration, please click on the link below:\n
      http://localhost:3000/users/verify/${verificationToken}`,
    });

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: "starter",
      },
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { error } = authSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.message });
      return;
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email }).exec();

    if (user === null) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    if (user.verify !== true) {
      return res.status(401).json({ message: "Please verify your email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch !== true) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "23h",
    });

    await User.findByIdAndUpdate(user.id, { token });

    return res.status(200).json({
      token: token,
      user: {
        email: user.email,
        subscription: "starter",
      },
    });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    await User.findByIdAndUpdate(req.user.id, { token: null });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

async function getCurrent(req, res, next) {
  try {
    const { email, subscription } = req.user;
    res.json({
      email,
      subscription,
    });
  } catch (error) {
    next(error);
  }
}

async function verify(req, res, next) {
  const { verificationToken } = req.params;

  try {
    const user = await User.findOne({ verificationToken }).exec();

    if (user === null) {
      return res.status(404).json({
        ResponseBody: {
          message: "User not found",
        },
      });
    }

    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });

    res.json({
      ResponseBody: {
        message: "Verification successful",
      },
    });
  } catch (error) {
    next(error);
  }
}

async function resendVerifyEmail(req, res, next) {
  try {
    const { error } = emailSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: "missing required field email" });
      return;
    }
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    if (user.verify) {
      return res
        .status(400)
        .json({ message: "Verification has already been passed" });
    }

    await sendEmail({
      to: email,
      subject: "Email confirmation",
      html: `<p>To confirm your registration, please click on the link below:</p>
      <a href='http://localhost:3000/users/verify/${user.verificationToken}'>Click me</a>`,
      text: `To confirm your registration, please click on the link below:\n
      http://localhost:3000/users/verify/${user.verificationToken}`,
    });

    res.json({ message: "Verification email send succsesfully " });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  logout,
  getCurrent,
  verify,
  resendVerifyEmail,
};
