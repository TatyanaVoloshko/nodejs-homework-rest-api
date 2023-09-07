// const contactsChanging = require("../../models/contacts");
const { contactSchema } = require("../../schemas/contacts");
const Contact = require('../../models/contact')

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
    const { _id } = req.user;
    const newContact = await Contact.create({...req.body, owner: _id});
    res.status(201).json(
      newContact );
  } catch (error) {
    next(error);
  }
};

module.exports = addNewContact;
