// backend/simple-server.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Разрешаем все CORS запросы
app.use(cors());
app.use(express.json());

// Храним данные в памяти
let pets = [
    {
        id: 1,
        name: 'Джаспер',
        type: 'cat',
        breed: 'Абиссинский',
        age: 3,
        weight: 4.8,
        healthStatus: 'Отличное'
    },
    {
        id: 2,
        name: 'Вупи',
        type: 'dog',
        breed: 'Золотистый ретривер',
        age: 5,
        weight: 28,
        healthStatus: 'Хорошее'
    }
];

// 1. ПОЛУЧИТЬ всех питомцев
app.get('/api/pets', (req, res) => {
    console.log('📞 Получен запрос GET /api/pets');
    res.json(pets);
});

// 2. СОЗДАТЬ нового питомца
app.post('/api/pets', (req, res) => {
    console.log('📝 Получен запрос POST /api/pets:', req.body);
    
    const newPet = {
        id: Date.now(), // Простой ID
        ...req.body,
        createdAt: new Date().toISOString()
    };
    
    pets.push(newPet);
    
    res.json({
        success: true,
        message: 'Питомец создан',
        pet: newPet
    });
});

// 3. ОБНОВИТЬ питомца
app.put('/api/pets/:id', (req, res) => {
    const petId = parseInt(req.params.id);
    const petIndex = pets.findIndex(p => p.id === petId);
    
    console.log(`✏️ Получен запрос PUT /api/pets/${petId}:`, req.body);
    
    if (petIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Питомец не найден'
        });
    }
    
    pets[petIndex] = { ...pets[petIndex], ...req.body };
    
    res.json({
        success: true,
        message: 'Питомец обновлен',
        pet: pets[petIndex]
    });
});

// 4. УДАЛИТЬ питомца
app.delete('/api/pets/:id', (req, res) => {
    const petId = parseInt(req.params.id);
    const initialLength = pets.length;
    
    console.log(`🗑️ Получен запрос DELETE /api/pets/${petId}`);
    
    pets = pets.filter(p => p.id !== petId);
    
    if (pets.length < initialLength) {
        res.json({
            success: true,
            message: 'Питомец удален'
        });
    } else {
        res.status(404).json({
            success: false,
            message: 'Питомец не найден'
        });
    }
});

// 5. ПРОСТОЙ эндпоинт для проверки
app.get('/api/check', (req, res) => {
    res.json({
        status: 'ok',
        message: 'API работает!',
        petsCount: pets.length
    });
});

// Запускаем сервер
app.listen(PORT, () => {
    console.log(`🚀 Простой API сервер запущен: http://localhost:${PORT}`);
    console.log('📡 Доступные эндпоинты:');
    console.log(`   GET    http://localhost:${PORT}/api/pets`);
    console.log(`   POST   http://localhost:${PORT}/api/pets`);
    console.log(`   PUT    http://localhost:${PORT}/api/pets/:id`);
    console.log(`   DELETE http://localhost:${PORT}/api/pets/:id`);
    console.log(`   GET    http://localhost:${PORT}/api/check`);
});