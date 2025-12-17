class DataManager {
    constructor() {
        this.data = {
            pets: [],
            currentPetId: null,
            events: [],
            meals: [],
            careItems: [],
            photos: [],
            reminders: [],
            healthData: {
                metrics: [],
                weightHistory: [],
                medicalRecords: [],
                vaccinationSchedule: [],
                healthIndicators: [],
                healthRecommendations: [],
                routineProcedures: []
            }
        };
        
        this.loadInitialData();
    }
    
    loadInitialData() {
        const savedData = localStorage.getItem(KINLY_CONST.STORAGE_KEYS.PET_TRACKER);
        
        if (savedData) {
            this.data = JSON.parse(savedData);
        } else {
            this.data = {
                pets: MOCK_PETS || [],
                currentPetId: MOCK_PETS && MOCK_PETS.length > 0 ? MOCK_PETS[0].id : null,
                events: MOCK_EVENTS || [],
                meals: MOCK_MEALS || [],
                careItems: MOCK_CARE_ITEMS || [],
                photos: MOCK_PHOTOS || [],
                reminders: MOCK_REMINDERS || [],
                healthData: MOCK_HEALTH || {
                    metrics: [],
                    weightHistory: [],
                    medicalRecords: [],
                    vaccinationSchedule: [],
                    healthIndicators: [],
                    healthRecommendations: [],
                    routineProcedures: []
                }
            };
        }
    }
    
    // ===== МЕТОДЫ ДЛЯ РАБОТЫ С ЗДОРОВЬЕМ =====
    
    getHealthMetrics(petId) {
        const petMetrics = this.data.healthData.metrics.find(m => m.petId === petId);
        if (petMetrics) return petMetrics;
        
        // Если нет данных, создаем базовые
        const defaultMetrics = {
            petId,
            appetite: 90,
            activity: 85,
            sleep: 95,
            mood: 90,
            temperature: 38.5,
            pulse: 60,
            breathing: 20
        };
        
        this.data.healthData.metrics.push(defaultMetrics);
        return defaultMetrics;
    }
    
    updateHealthMetrics(petId, metrics) {
        const index = this.data.healthData.metrics.findIndex(m => m.petId === petId);
        if (index !== -1) {
            this.data.healthData.metrics[index] = { ...this.data.healthData.metrics[index], ...metrics };
        } else {
            this.data.healthData.metrics.push({ petId, ...metrics });
        }
        this.saveData();
    }
    
    getWeightHistory(petId) {
        const history = this.data.healthData.weightHistory.find(w => w.petId === petId);
        if (history) return history.data;
        
        // Если нет истории, берем из питомца или создаем пустую
        const pet = this.getPet(petId);
        if (pet && pet.weightHistory) {
            return pet.weightHistory;
        }
        return [];
    }
    
    addWeightRecord(petId, weightRecord) {
        let history = this.data.healthData.weightHistory.find(w => w.petId === petId);
        if (!history) {
            history = { petId, data: [] };
            this.data.healthData.weightHistory.push(history);
        }
        
        history.data.push({
            id: Date.now(),
            date: weightRecord.date || new Date().toISOString().split('T')[0],
            weight: weightRecord.weight,
            notes: weightRecord.notes || ''
        });
        
        // Сортируем по дате
        history.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Обновляем текущий вес питомца
        this.updatePet(petId, { weight: weightRecord.weight });
        
        this.saveData();
    }
    
    getMedicalRecords(petId) {
        return this.data.healthData.medicalRecords.filter(record => record.petId === petId);
    }
    
    addMedicalRecord(recordData) {
        const newRecord = {
            id: Date.now(),
            ...recordData
        };
        
        this.data.healthData.medicalRecords.push(newRecord);
        this.saveData();
        return newRecord;
    }
    
    updateMedicalRecord(recordId, recordData) {
        const index = this.data.healthData.medicalRecords.findIndex(r => r.id === recordId);
        if (index !== -1) {
            this.data.healthData.medicalRecords[index] = { 
                ...this.data.healthData.medicalRecords[index], 
                ...recordData 
            };
            this.saveData();
            return true;
        }
        return false;
    }
    
    deleteMedicalRecord(recordId) {
        const index = this.data.healthData.medicalRecords.findIndex(r => r.id === recordId);
        if (index !== -1) {
            this.data.healthData.medicalRecords.splice(index, 1);
            this.saveData();
            return true;
        }
        return false;
    }
    
    getVaccinationSchedule(petId) {
        return this.data.healthData.vaccinationSchedule.filter(v => v.petId === petId);
    }
    
    addVaccination(vaccineData) {
        const newVaccine = {
            id: Date.now(),
            ...vaccineData
        };
        
        this.data.healthData.vaccinationSchedule.push(newVaccine);
        this.saveData();
        return newVaccine;
    }
    
    updateVaccination(vaccineId, vaccineData) {
        const index = this.data.healthData.vaccinationSchedule.findIndex(v => v.id === vaccineId);
        if (index !== -1) {
            this.data.healthData.vaccinationSchedule[index] = { 
                ...this.data.healthData.vaccinationSchedule[index], 
                ...vaccineData 
            };
            this.saveData();
            return true;
        }
        return false;
    }
    
    getHealthIndicators(petId, limit = 10) {
        const indicators = this.data.healthData.healthIndicators
            .filter(i => i.petId === petId)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        
        return indicators.slice(0, limit);
    }
    
    addHealthIndicator(indicatorData) {
        const newIndicator = {
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            ...indicatorData
        };
        
        this.data.healthData.healthIndicators.push(newIndicator);
        this.saveData();
        return newIndicator;
    }
    
    getHealthRecommendations(petId) {
        return this.data.healthData.healthRecommendations.filter(r => r.petId === petId);
    }
    
    getRoutineProcedures(petId) {
        return this.data.healthData.routineProcedures.filter(p => p.petId === petId);
    }
    
    // Генерация истории веса (для обратной совместимости)
    generateWeightHistory(petId, baseWeight = 4.8) {
        const history = [];
        const now = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const weight = baseWeight + (Math.random() * 0.4 - 0.2); // ±0.2 кг
            
            history.push({
                date: date.toISOString().split('T')[0],
                weight: parseFloat(weight.toFixed(1)),
                notes: i === 0 ? 'Текущий вес' : 'Запись веса'
            });
        }
        
        return history;
    }
    
    saveData() {
        localStorage.setItem(KINLY_CONST.STORAGE_KEYS.PET_TRACKER, JSON.stringify(this.data));
    }
    
    setData(data) {
        this.data = { ...this.data, ...data };
    }
    
    getData() {
        return this.data;
    }
    
    getPets() {
        return this.data.pets;
    }
    
    getPet(petId) {
        return this.data.pets.find(pet => pet.id === petId);
    }
    
    addPet(petData) {
        const newPet = {
            id: Date.now(),
            ...petData
        };
        
        this.data.pets.push(newPet);
        
        if (!this.data.currentPetId) {
            this.data.currentPetId = newPet.id;
        }
        
        this.saveData();
        return newPet;
    }
    
    updatePet(petId, petData) {
        const index = this.data.pets.findIndex(pet => pet.id === petId);
        if (index !== -1) {
            this.data.pets[index] = { ...this.data.pets[index], ...petData };
            this.saveData();
            return true;
        }
        return false;
    }
    
    deletePet(petId) {
        const index = this.data.pets.findIndex(pet => pet.id === petId);
        if (index !== -1) {
            this.data.pets.splice(index, 1);
            
            if (this.data.currentPetId === petId && this.data.pets.length > 0) {
                this.data.currentPetId = this.data.pets[0].id;
            } else if (this.data.pets.length === 0) {
                this.data.currentPetId = null;
            }
            
            this.saveData();
            return true;
        }
        return false;
    }
    
    getCurrentPetId() {
        return this.data.currentPetId;
    }
    
    setCurrentPetId(petId) {
        this.data.currentPetId = petId;
        this.saveData();
    }
    
    getEvents(petId) {
        return this.data.events.filter(event => event.petId === petId);
    }
    
    addEvent(eventData) {
        const newEvent = {
            id: Date.now(),
            ...eventData
        };
        
        this.data.events.push(newEvent);
        this.saveData();
        return newEvent;
    }
    
    updateEvent(eventId, eventData) {
        const index = this.data.events.findIndex(event => event.id === eventId);
        if (index !== -1) {
            this.data.events[index] = { ...this.data.events[index], ...eventData };
            this.saveData();
            return true;
        }
        return false;
    }
    
    deleteEvent(eventId) {
        const index = this.data.events.findIndex(event => event.id === eventId);
        if (index !== -1) {
            this.data.events.splice(index, 1);
            this.saveData();
            return true;
        }
        return false;
    }
    
    getMeals(petId) {
        return this.data.meals.filter(meal => meal.petId === petId);
    }
    
    addMeal(mealData) {
        const newMeal = {
            id: Date.now(),
            ...mealData
        };
        
        this.data.meals.push(newMeal);
        this.saveData();
        return newMeal;
    }
    
    updateMeal(mealId, mealData) {
        const index = this.data.meals.findIndex(meal => meal.id === mealId);
        if (index !== -1) {
            this.data.meals[index] = { ...this.data.meals[index], ...mealData };
            this.saveData();
            return true;
        }
        return false;
    }
    
    deleteMeal(mealId) {
        const index = this.data.meals.findIndex(meal => meal.id === mealId);
        if (index !== -1) {
            this.data.meals.splice(index, 1);
            this.saveData();
            return true;
        }
        return false;
    }
    
    getReminders(petId) {
        return this.data.reminders.filter(reminder => reminder.petId === petId);
    }
    
    addReminder(reminderData) {
        const newReminder = {
            id: Date.now(),
            ...reminderData
        };
        
        this.data.reminders.push(newReminder);
        this.saveData();
        return newReminder;
    }
    
    updateReminder(reminderId, reminderData) {
        const index = this.data.reminders.findIndex(reminder => reminder.id === reminderId);
        if (index !== -1) {
            this.data.reminders[index] = { ...this.data.reminders[index], ...reminderData };
            this.saveData();
            return true;
        }
        return false;
    }
    
    deleteReminder(reminderId) {
        const index = this.data.reminders.findIndex(reminder => reminder.id === reminderId);
        if (index !== -1) {
            this.data.reminders.splice(index, 1);
            this.saveData();
            return true;
        }
        return false;
    }
    
    getCareItems(petId) {
        return this.data.careItems.filter(item => item.petId === petId);
    }
    
    addCareItem(careItemData) {
        const newCareItem = {
            id: Date.now(),
            ...careItemData
        };
        
        this.data.careItems.push(newCareItem);
        this.saveData();
        return newCareItem;
    }
    
    updateCareItem(careItemId, careItemData) {
        const index = this.data.careItems.findIndex(item => item.id === careItemId);
        if (index !== -1) {
            this.data.careItems[index] = { ...this.data.careItems[index], ...careItemData };
            this.saveData();
            return true;
        }
        return false;
    }
    
    deleteCareItem(careItemId) {
        const index = this.data.careItems.findIndex(item => item.id === careItemId);
        if (index !== -1) {
            this.data.careItems.splice(index, 1);
            this.saveData();
            return true;
        }
        return false;
    }
    
    getPhotos(petId) {
        return this.data.photos.filter(photo => photo.petId === petId);
    }
    
    addPhoto(photoData) {
        const newPhoto = {
            id: Date.now(),
            ...photoData
        };
        
        this.data.photos.push(newPhoto);
        this.saveData();
        return newPhoto;
    }
    
    updatePhoto(photoId, photoData) {
        const index = this.data.photos.findIndex(photo => photo.id === photoId);
        if (index !== -1) {
            this.data.photos[index] = { ...this.data.photos[index], ...photoData };
            this.saveData();
            return true;
        }
        return false;
    }
    
    deletePhoto(photoId) {
        const index = this.data.photos.findIndex(photo => photo.id === photoId);
        if (index !== -1) {
            this.data.photos.splice(index, 1);
            this.saveData();
            return true;
        }
        return false;
    }
    
    getMedicalHistory(petId) {
        return this.data.events.filter(event => event.petId === petId && event.type === 'medical');
    }
    
    addMedicalHistory(record) {
        const newRecord = {
            id: Date.now(),
            type: 'medical',
            ...record
        };
        
        this.data.events.push(newRecord);
        this.saveData();
        return newRecord;
    }
    
    updateMedicalHistory(recordId, recordData) {
        const index = this.data.events.findIndex(event => event.id === recordId && event.type === 'medical');
        if (index !== -1) {
            this.data.events[index] = { ...this.data.events[index], ...recordData };
            this.saveData();
            return true;
        }
        return false;
    }
    
    deleteMedicalHistory(recordId) {
        const index = this.data.events.findIndex(event => event.id === recordId && event.type === 'medical');
        if (index !== -1) {
            this.data.events.splice(index, 1);
            this.saveData();
            return true;
        }
        return false;
    }
}