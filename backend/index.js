const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contacts');
const eventRoutes = require('./routes/events');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); 

app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/events', eventRoutes);


app.get('/', (req, res) => {
  res.send('EventFlow API работает!');
});

const PORT = process.env.PORT || 5000;

// Подключение к локальной базе данных
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => { 
    console.log('База данных подключена успешно (Local)');
    
    try {
      await mongoose.connection.collection('contacts').dropIndex('email_1');
      console.log('Старый индекс email_1 успешно удален! Теперь можно добавлять пустые email.');
    } catch (err) {
      console.log('Индекс email_1 не найден или уже был удален (это нормально).');
    }

    app.listen(PORT, () => {
      console.log(`Сервер запущен на http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Ошибка подключения к базе:', error.message);
  });