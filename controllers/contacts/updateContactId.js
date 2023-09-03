const Contact = require("../../models/contact");
const { contactSchema } = require("../../schemas/contacts");

const updateContactId = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({
      message: "missing fields",
    });
    return;
  }

  const { error } = contactSchema.validate(req.body);
  try {
    if (error) {
      if (error.details[0].type === "string.base") {
        const errorName = error.details[0].message;
        res.status(400).json({
          message: `${errorName}`,
        });
        return;
      } else {
        console.log(error);
        const errorName = error.details[0].path;
        res.status(400).json({
          message: ` missing required ${errorName} field`,
        });
        return;
      }
    }

    const { contactId } = req.params;
    const updatedContact = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});

    if (!updatedContact) {
      res.status(404).json({
        message: "Not found",
      });
      return;
    }
    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
};

module.exports = updateContactId;
