const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const contacts = await Contact.find({ owner: req.user.userId }).sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Ошибка загрузки контактов" });
  }
});

router.post('/add', authMiddleware, async (req, res) => {
  try {
    const contactData = { ...req.body, owner: req.user.userId };

    if (!contactData.email || contactData.email.trim() === "") {
      contactData.email = undefined;
    }

    const newContact = new Contact(contactData);
    await newContact.save();
    res.status(201).json(newContact);
  } catch (error) {
    
    console.error("!!!ОШИБКА БД ПРИ ДОБАВЛЕНИИ КОНТАКТА:", error.message);
    res.status(400).json({ message: "Ошибка добавления контакта", error: error.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    
    if (!updateData.email || updateData.email.trim() === "") {
      updateData.email = null; 
    }

    const updated = await Contact.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.userId }, 
      updateData, 
      { returnDocument: 'after' } 
    );
    res.json(updated);
  } catch (error) {
    console.error("!!!ОШИБКА БД ПРИ ОБНОВЛЕНИИ КОНТАКТА:", error.message);
    res.status(400).json({ message: "Ошибка обновления контакта" });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Contact.findOneAndDelete({ _id: req.params.id, owner: req.user.userId });
    res.json({ message: "Контакт удален" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка удаления контакта" });
  }
});

module.exports = router;