const fs = require('fs/promises');
const path = require("node:path");
const crypto = require("node:crypto");

const contactsPath = path.join(__dirname, "contacts.json");

async function listContacts() {
  const data = await fs.readFile(contactsPath);
  const contacts = JSON.parse(data);
  return contacts;
}

async function getContactById(contactId) {
  const data = await listContacts();

  const finId = data.find((contact) => contact.id === contactId);

  return finId || null;
}

async function removeContact(contactId) {
  const data = await listContacts();

  const index = data.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    return null;
  }

  const [removedContact] = data.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(data));
  return removedContact;
}

async function addContact({ name, email, phone }) {
  const data = await listContacts();
  const newContact = { id: crypto.randomUUID(), name, email, phone };
  data.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(data));
  return newContact;
}

async function updateContact(contactId, { name, email, phone }) {
  const data = await listContacts();
  const index = data.findIndex((contact) => contact.id === contactId);
 if (index === -1) {
   return null;
  }
  data[index] = { id: contactId, name, email, phone };
  await fs.writeFile(contactsPath, JSON.stringify(data));
  return data[index];
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
