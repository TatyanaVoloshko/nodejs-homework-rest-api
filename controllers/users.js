const User = require("../models/user");

const fs = require("node:fs/promises");
const path = require("node:path");

const Jimp = require("jimp");

const avatarsDir = path.join(__dirname, "..", "public", "avatars");

async function uploadAvatar(req, res, next) {
  if (!req.file) {
    return res.status(400).json({ message: "No files were uploaded" });
  }
  const { path: tempUpload, filename } = req.file;
  const { id: userId } = req.user;

  const img = await Jimp.read(tempUpload);
  await img.cover(250, 250).writeAsync(tempUpload);

  try {
    const avatarURL = path.join(avatarsDir, filename);
    await fs.rename(tempUpload, avatarURL);

    const doc = await User.findByIdAndUpdate(
      userId,
      { avatarURL },
      { new: true }
    ).exec();

    if (doc === null) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      ResponseBody: { avatarURL },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  uploadAvatar,
};
