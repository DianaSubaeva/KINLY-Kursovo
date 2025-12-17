window.MOCK_HEALTH = {
    // Показатели здоровья для каждого питомца
    metrics: [
        {
            petId: 1,
            appetite: 92,
            activity: 88,
            sleep: 95,
            mood: 90,
            temperature: 38.5,
            pulse: 60,
            breathing: 20
        },
        {
            petId: 2,
            appetite: 85,
            activity: 90,
            sleep: 88,
            mood: 92,
            temperature: 38.2,
            pulse: 65,
            breathing: 18
        }
    ],
    
    // История веса
    weightHistory: [
        {
            petId: 1,
            data: [
                { date: '2025-01-01', weight: 4.2, notes: 'Нормальный вес' },
                { date: '2025-02-01', weight: 4.3, notes: 'Небольшой привес' },
                { date: '2025-03-01', weight: 4.4, notes: 'Стабильный рост' },
                { date: '2025-04-01', weight: 4.5, notes: 'Хорошая форма' },
                { date: '2025-05-01', weight: 4.5, notes: 'Стабильно' },
                { date: '2025-06-01', weight: 4.6, notes: 'Летний период' },
                { date: '2025-07-01', weight: 4.6, notes: 'Без изменений' },
                { date: '2025-08-01', weight: 4.6, notes: 'Вес: 4.6 кг' },
                { date: '2025-09-01', weight: 4.7, notes: 'Осенний привес' },
                { date: '2025-10-01', weight: 4.8, notes: 'Текущий вес: 4.8 кг' }
            ]
        },
        {
            petId: 2,
            data: [
                { date: '2025-01-01', weight: 26.5, notes: 'Норма' },
                { date: '2025-02-01', weight: 27.0, notes: 'Хороший рост' },
                { date: '2025-03-01', weight: 27.2, notes: 'Стабильно' },
                { date: '2025-04-01', weight: 27.5, notes: 'Весенний период' },
                { date: '2025-05-01', weight: 27.5, notes: 'Без изменений' },
                { date: '2025-06-01', weight: 27.8, notes: 'Активное лето' },
                { date: '2025-07-01', weight: 28.0, notes: 'Оптимальный вес' },
                { date: '2025-08-01', weight: 27.8, notes: 'Легкая потеря' },
                { date: '2025-09-01', weight: 27.8, notes: 'Стабильно' },
                { date: '2025-10-01', weight: 28.0, notes: 'Текущий вес' }
            ]
        }
    ],
    
    // Медицинские записи (история болезней, прививки, осмотры)
    medicalRecords: [
        {
            id: 101,
            petId: 1,
            type: 'vaccination',
            title: 'Комплексная вакцинация',
            description: 'Ежегодная прививка от бешенства и основных вирусов',
            date: '2025-10-15',
            doctor: 'Ветеринарная клиника "Друг"',
            notes: 'Перенес вакцинацию хорошо, без побочных эффектов',
            nextDate: '2026-10-15',
            completed: true
        },
        {
            id: 102,
            petId: 1,
            type: 'checkup',
            title: 'Профилактический осмотр',
            description: 'Плановый осмотр у ветеринара',
            date: '2025-09-20',
            doctor: 'Доктор Иванова',
            notes: 'Все показатели в норме, рекомендовано продолжить текущий уход',
            completed: true
        },
        {
            id: 103,
            petId: 1,
            type: 'vaccination',
            title: 'Прививка от бешенства',
            description: 'Обязательная ежегодная вакцинация',
            date: '2024-11-22',
            doctor: 'Ветеринарная клиника "ЗооМед"',
            notes: 'Сделана по графику',
            nextDate: '2025-11-22',
            completed: true
        },
        {
            id: 104,
            petId: 1,
            type: 'treatment',
            title: 'Лечение простуды',
            description: 'Курс антибиотиков и витаминов',
            date: '2025-08-10',
            doctor: 'Доктор Петров',
            notes: 'Назначен курс лечения на 7 дней, симптомы прошли на 3-й день',
            completed: true
        },
        {
            id: 201,
            petId: 2,
            type: 'vaccination',
            title: 'Комплексная вакцинация',
            description: 'Прививки от чумы, энтерита, бешенства',
            date: '2025-09-15',
            doctor: 'Ветеринарная клиника "Друг"',
            notes: 'Перенес нормально, небольшое покраснение в месте укола',
            nextDate: '2026-09-15',
            completed: true
        },
        {
            id: 202,
            petId: 2,
            type: 'checkup',
            title: 'Осмотр перед поездкой',
            description: 'Общий осмотр перед путешествием',
            date: '2025-07-05',
            doctor: 'Доктор Сидоров',
            notes: 'Здоров, готов к поездке',
            completed: true
        }
    ],
    
    // Прививочный календарь
    vaccinationSchedule: [
        {
            id: 1,
            petId: 1,
            vaccine: 'Комплексная вакцинация',
            dateGiven: '2025-10-15',
            nextDue: '2026-10-15',
            status: 'completed'
        },
        {
            id: 2,
            petId: 1,
            vaccine: 'Прививка от бешенства',
            dateGiven: '2024-11-22',
            nextDue: '2025-11-22',
            daysLeft: 28,
            status: 'pending'
        },
        {
            id: 3,
            petId: 2,
            vaccine: 'Комплексная вакцинация',
            dateGiven: '2025-09-15',
            nextDue: '2026-09-15',
            status: 'completed'
        }
    ],
    
    // Показатели здоровья (расширенные)
    healthIndicators: [
        {
            petId: 1,
            date: '2025-10-25',
            temperature: 38.5,
            pulse: 60,
            breathing: 20,
            appetite: 'good',
            activity: 'high',
            mood: 'happy',
            notes: 'Все показатели в норме'
        },
        {
            petId: 1,
            date: '2025-10-20',
            temperature: 38.3,
            pulse: 62,
            breathing: 22,
            appetite: 'normal',
            activity: 'normal',
            mood: 'calm',
            notes: 'Легкая вялость после прогулки'
        },
        {
            petId: 2,
            date: '2025-10-25',
            temperature: 38.2,
            pulse: 65,
            breathing: 18,
            appetite: 'excellent',
            activity: 'high',
            mood: 'energetic',
            notes: 'Отличная форма'
        }
    ],
    
    // Рекомендации по здоровью
    healthRecommendations: [
        {
            petId: 1,
            type: 'diet',
            title: 'Контроль веса',
            description: 'Рекомендуется поддерживать вес в пределах 4.5-5.0 кг',
            priority: 'medium',
            status: 'active'
        },
        {
            petId: 1,
            type: 'exercise',
            title: 'Ежедневные игры',
            description: 'Не менее 30 минут активных игр в день',
            priority: 'high',
            status: 'active'
        },
        {
            petId: 1,
            type: 'prevention',
            title: 'Регулярная обработка от паразитов',
            description: 'Обработка раз в 3 месяца',
            priority: 'high',
            status: 'active'
        },
        {
            petId: 2,
            type: 'diet',
            title: 'Сбалансированное питание',
            description: 'Корм для крупных пород, 2 раза в день',
            priority: 'high',
            status: 'active'
        },
        {
            petId: 2,
            type: 'exercise',
            title: 'Длительные прогулки',
            description: 'Не менее 2 прогулок по 40 минут в день',
            priority: 'high',
            status: 'active'
        }
    ],
    
    // График периодических процедур
    routineProcedures: [
        {
            id: 1,
            petId: 1,
            procedure: 'Обработка от блох и клещей',
            frequency: 'monthly',
            lastDate: '2025-10-01',
            nextDate: '2025-11-01',
            status: 'pending'
        },
        {
            id: 2,
            petId: 1,
            procedure: 'Чистка зубов',
            frequency: 'weekly',
            lastDate: '2025-10-23',
            nextDate: '2025-10-30',
            status: 'pending'
        },
        {
            id: 3,
            petId: 1,
            procedure: 'Стрижка когтей',
            frequency: 'biweekly',
            lastDate: '2025-10-15',
            nextDate: '2025-10-29',
            status: 'pending'
        },
        {
            id: 4,
            petId: 2,
            procedure: 'Обработка от глистов',
            frequency: 'quarterly',
            lastDate: '2025-09-01',
            nextDate: '2025-12-01',
            status: 'pending'
        }
    ]
};