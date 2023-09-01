const express = require('express')

const router = express.Router()

const {contacts: ctrl} = require("../../controllers")

router.get("/", ctrl.listContact);

router.get('/:contactId', ctrl.getContactId);

router.post('/', ctrl.addNewContact);

router.delete('/:contactId', ctrl.removeContactId);

router.put('/:contactId', ctrl.updateContactId);

router.patch('/:contactId', ctrl.updateStatusContact);

module.exports = router
