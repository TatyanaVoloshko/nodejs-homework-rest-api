const Contact = require("../../models/contact");

const removeContactId = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const removedContact = await Contact.findByIdAndRemove(contactId);
    if (!removedContact) {
      res.status(404).json({
        message: "Not found",
      });
      return;
    }

    if (removedContact.owner !== req.user.id) {
       return res.status(401).json({ message: "Not authorized" });
    }

    return res.json({
      message: "contact deleted",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = removeContactId;
