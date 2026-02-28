const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: { 
    type: String, 
    enum: ['Свадьба', 'Корпоратив', 'День рождения', 'Другое'], 
    default: 'Другое' 
  },
  date: { type: Date, required: true },
  location: { type: String, default: '' },
  description: { type: String, default: '' },
  photoUrl: { type: String, default: '' },
  guests: [{
    guest: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' },
    status: { 
      type: String, 
      enum: ['Ожидает', 'Подтвержден', 'Отклонен'], 
      default: 'Ожидает' 
    }
  }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', EventSchema);