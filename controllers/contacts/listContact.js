const Contact = require("../../models/contact");

const listContact = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const contacts = await Contact.find({owner: userId});
    res.json(contacts);
  } catch (error) {
    next(error);
  }
};

module.exports = listContact;
