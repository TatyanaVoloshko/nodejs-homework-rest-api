const contactsChanging = require("../../models/contacts");
const { contactSchema } = require("../../schemas/contacts");

const updateContactId = async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body);
    if (error) {
      res.status(400).json({
        message: "missing fields",
      });
      return;
    }
    const { contactId } = req.params;
    const updatedContact = await contactsChanging.updateContact(
      contactId,
      req.body
    );
    if (!updatedContact) {
      res.status(404).json({
        message: "Not found",
      });
      return;
    }
    res.json(
    updatedContact);
  } catch (error) {
    next(error);
  }
};

module.exports = updateContactId;
