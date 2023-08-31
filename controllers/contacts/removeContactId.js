const contactsChanging = require("../../models/contacts");

const removeContactId = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const removedContact = await contactsChanging.removeContact(contactId);
    if (!removedContact) {
      res.status(404).json({
        message: "Not found",
      });
      return;
    }
    res.json({
      message: "contact deleted",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = removeContactId;
