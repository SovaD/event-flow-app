const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contacts');
const eventRoutes = require('./routes/events');

const app = express();

app.use(cors({
  origin: [
    process.env.FRONTEND_URL 
  ].filter(Boolean),
  credentials: true
}));

// app.use(cors({
 
//   origin: '[https://event-flow-kboiimodj-sovads-projects.vercel.app](https://event-flow-kboiimodj-sovads-projects.vercel.app)', 
//   credentials: true, 
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));
app.use(express.json()); 

app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/events', eventRoutes);

app.get('/', (req, res) => {
  res.send('EventFlow API работает в облаке!');
});


const PORT = process.env.PORT || 5000;

// Подключение к базе данных
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => { 
    console.log('Соединение с базой данных установлено');
    
    try {
      await mongoose.connection.collection('contacts').dropIndex('email_1');
      console.log('Индекс email_1 успешно обновлен.');
    } catch (err) {
      console.log('Индекс email_1 не требует удаления.');
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Сервер запущен на порту ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Ошибка подключения к базе:', error.message);
  });