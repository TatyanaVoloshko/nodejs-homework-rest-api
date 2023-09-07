const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authSchema } = require("../schemas/users");

const User = require("../models/user");

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

    const newUser = await User.create({ email, password: passwordHash });

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
  


module.exports = {
  register,
  login,
  logout,
  getCurrent,
};
