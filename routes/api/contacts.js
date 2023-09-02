const express = require('express')

const router = express.Router()

const { contacts: ctrl } = require("../../controllers")

const checkIsValidId = require('../../middlewares/isValidId')

router.get("/", ctrl.listContact);

router.get("/:contactId", checkIsValidId, ctrl.getContactId);

router.post('/', ctrl.addNewContact);

router.delete('/:contactId', checkIsValidId,  ctrl.removeContactId);

router.put('/:contactId', checkIsValidId, ctrl.updateContactId);

router.patch('/:contactId/favorite', checkIsValidId, ctrl.updateStatusContact);

module.exports = router
