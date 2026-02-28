const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const authMiddleware = require("../middleware/auth");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const events = await Event.find({ owner: req.user.userId }).populate(
      "guests.guest",
    );
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Ошибка загрузки событий" });
  }
});

router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { title, category, date, location, description, photoUrl, guests } =
      req.body;
    const guestsWithStatus = guests.map((id) => ({
      guest: id,
      status: "Ожидает",
    }));

    const newEvent = new Event({
      title,
      category,
      date,
      location,
      description,
      photoUrl,
      guests: guestsWithStatus,
      owner: req.user.userId,
    });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ message: "Ошибка создания события" });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, category, date, location, description, photoUrl, guests } =
      req.body;

    const existingEvent = await Event.findOne({
      _id: req.params.id,
      owner: req.user.userId,
    });
    if (!existingEvent)
      return res.status(404).json({ message: "Событие не найдено" });

    const updatedGuests = guests.map((guestId) => {
      const existingGuest = existingEvent.guests.find(
        (g) => g.guest && g.guest.toString() === guestId,
      );
      return existingGuest
        ? existingGuest
        : { guest: guestId, status: "Ожидает" };
    });

    const updatedEvent = await Event.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.userId },
      {
        title,
        category,
        date,
        location,
        description,
        photoUrl,
        guests: updatedGuests,
      },
      { returnDocument: "after" },
    ).populate("guests.guest");

    res.json(updatedEvent);
  } catch (error) {
    res.status(400).json({ message: "Ошибка обновления события" });
  }
});

router.put("/:eventId/guest/:guestId", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const event = await Event.findOneAndUpdate(
      { _id: req.params.eventId, "guests.guest": req.params.guestId },
      { $set: { "guests.$.status": status } },
      { returnDocument: "after" },
    ).populate("guests.guest");
    res.json(event);
  } catch (error) {
    res.status(400).json({ message: "Ошибка обновления статуса" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Event.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.userId,
    });
    res.json({ message: "Событие удалено" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка удаления события" });
  }
});

router.get("/public/:eventId/guest/:guestId", async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId).populate(
      "guests.guest",
    );
    if (!event) return res.status(404).json({ message: "Событие не найдено" });
    const guestRecord = event.guests.find(
      (g) => g.guest && g.guest._id.toString() === req.params.guestId,
    );
    if (!guestRecord)
      return res.status(404).json({ message: "Гость не найден" });

    res.json({
      event: {
        title: event.title,
        date: event.date,
        location: event.location,
        description: event.description,
        photoUrl: event.photoUrl,
      },
      guest: { name: guestRecord.guest.name },
      currentStatus: guestRecord.status,
    });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

router.post("/public/:eventId/guest/:guestId/rsvp", async (req, res) => {
  try {
    const { status } = req.body;
    await Event.findOneAndUpdate(
      { _id: req.params.eventId, "guests.guest": req.params.guestId },
      { $set: { "guests.$.status": status } },
    );
    res.json({ message: "Ответ записан!" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сохранения ответа" });
  }
});

module.exports = router;
