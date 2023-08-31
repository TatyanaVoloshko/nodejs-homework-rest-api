const contactsChanging = require("../../models/contacts");
const { contactSchema } = require("../../schemas/contacts");

const addNewContact = async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body);
    if (error) {
      console.log(error);
      const errorName = error.details[0].path;
      res.status(400).json({
        message: ` missing required ${errorName} field`
      });
      return;
    }
    const newContact = await contactsChanging.addContact(req.body);
    res.status(201).json(
      newContact );
  } catch (error) {
    next(error);
  }
};

module.exports = addNewContact;
