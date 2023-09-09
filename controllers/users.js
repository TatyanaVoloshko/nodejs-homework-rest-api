const User = require("../models/user");

const fs = require("node:fs/promises");
const path = require("node:path");

const Jimp = require("jimp");

const avatarsDir = path.join(__dirname, "../../", "public", "avatars");



async function uploadAvatar(req, res, next) {
    const { path: tempUpload, originalname } = req.file;
    const { _id: id } = req.user;
    const imageName = `${id}_${originalname}`;

    const img = await Jimp.read(tempUpload);
    await img.cover(250, 250).writeAsync(tempUpload);
   
  try {
      await fs.rename(
          req.file.path,
          path.join(__dirname, "..", "public", "avatars", req.file.filename)
      );

      const doc = await User.findByIdAndUpdate(req.user.id, { avatarURL: req.file.filename }, { new: true }).exec();
      
      if (doc === null) {
          return res.status(404).send({ message: "User not found" });
      }
      
      res.send(doc);
  } catch (error) {
    next(error);
  }
}

module.exports = {
    uploadAvatar,
};
