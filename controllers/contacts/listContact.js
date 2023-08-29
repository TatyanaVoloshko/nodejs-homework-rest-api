const contactsChanging = require("../../models/contacts");

const listContact = async (req, res, next) => {
  try {
    const contacts = await contactsChanging.listContacts();
    res.json(contacts);
  } catch (error) {
    next(error);
  }
};

module.exports = listContact;
