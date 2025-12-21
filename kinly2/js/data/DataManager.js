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
        
        this.useApi = false;
        this.initialized = false;
        
        console.log('DataManager создан (ждём инициализацию)');
    }

    async init() {
        console.log('DataManager.init() начат');
        
        this.useApi = window.apiService !== undefined;
        console.log('useApi =', this.useApi);
        console.log('window.apiService =', window.apiService);
        
        if (this.useApi && window.apiService) {
            console.log('API доступно, пробую загрузить данные...');
            try {
                const apiPets = await window.apiService.getPets();
                console.log('API вернуло:', apiPets);
                
                if (apiPets && Array.isArray(apiPets) && apiPets.length > 0) {
                    console.log(`Найдено ${apiPets.length} питомцев в API`);
                    
                    this.data.pets = apiPets.map(apiPet => ({
                        id: apiPet.id,
                        name: apiPet.name,
                        type: apiPet.type,
                        breed: apiPet.breed || '',
                        age: apiPet.age || 0,
                        weight: apiPet.weight || 0,
                        healthStatus: apiPet.healthStatus || '',
                        nextVaccination: apiPet.nextVaccination || '',
                        avatar: apiPet.avatar || 'default',
                        allergies: [],
                        healthMetrics: {},
                        weightHistory: []
                    }));
                    
                    console.log(`Загружены питомцы:`, this.data.pets.map(p => p.name));
                    
                    if (this.data.pets.length > 0) {
                        this.data.currentPetId = this.data.pets[0].id;
                        console.log(`Текущий питомец: ${this.data.pets[0].name}`);
                    }
                    
                    this.saveData();
                    this.initialized = true;
                    return;
                }
            } catch (error) {
                console.error('Ошибка загрузки из API:', error);
            }
        }
        
        const savedData = localStorage.getItem(KINLY_CONST.STORAGE_KEYS.PET_TRACKER);
        if (savedData) {
            this.data = JSON.parse(savedData);
            console.log('Данные загружены из localStorage');
        } else {
            this.data.pets = window.MOCK_PETS || [];
            this.data.events = window.MOCK_EVENTS || [];
            this.data.meals = window.MOCK_MEALS || [];
            this.data.careItems = window.MOCK_CARE_ITEMS || [];
            this.data.photos = window.MOCK_PHOTOS || [];
            this.data.reminders = window.MOCK_REMINDERS || [];
            this.data.healthData = window.MOCK_HEALTH || {
                metrics: [],
                weightHistory: [],
                medicalRecords: [],
                vaccinationSchedule: [],
                healthIndicators: [],
                healthRecommendations: [],
                routineProcedures: []
            };
            
            if (this.data.pets.length > 0) {
                this.data.currentPetId = this.data.pets[0].id;
            }
            console.log('📥 Загружены mock данные');
        }
        
        this.initialized = true;
    }

    getCurrentPetId() {
        return this.data.currentPetId;
    }

    setCurrentPetId(petId) {
        this.data.currentPetId = petId;
        this.saveData();
    }

    getPet(petId) {
        return this.data.pets.find(pet => pet.id == petId);
    }

    getPets() {
        return this.data.pets;
    }
    
    saveData() {
        localStorage.setItem(KINLY_CONST.STORAGE_KEYS.PET_TRACKER, JSON.stringify(this.data));
        console.log('Данные сохранены в localStorage');
    }
    
    async addPet(petData) {
    console.log(' DataManager: Добавляю питомца:', petData);
    const newPet = {
        id: Date.now(),
        name: petData.name || '',
        type: petData.type || '',
        breed: petData.breed || '',
        age: petData.age || 0,
        weight: petData.weight || 0,
        healthStatus: petData.healthStatus || '',
        nextVaccination: petData.nextVaccination || '',
        avatar: petData.avatar || 'default',
        allergies: [],
        healthMetrics: {},
        weightHistory: []
    };
    
    this.data.pets.push(newPet);
    if (!this.data.currentPetId) {
        this.data.currentPetId = newPet.id;
    }
    
    if (this.useApi && window.apiService) {
        try {
            console.log('Отправляю в API...');
            
            const apiPetData = {
                name: newPet.name,
                type: newPet.type,
                breed: newPet.breed,
                age: newPet.age,
                weight: newPet.weight,
                healthStatus: newPet.healthStatus,
                nextVaccination: newPet.nextVaccination,
                avatar: newPet.avatar
            };
            
            console.log('📦 Данные для API:', apiPetData);
            
            const apiResponse = await window.apiService.createPet(apiPetData);
            
            // Обновляем ID на тот, что присвоил API
            newPet.id = apiResponse.id;
            console.log('✅ Питомец сохранен в API с ID:', apiResponse.id);
            
            // Обновляем локальный список с новым ID
            const index = this.data.pets.findIndex(p => p.id === Date.now());
            if (index !== -1) {
                this.data.pets[index].id = apiResponse.id;
            }
            
        } catch (error) {
            console.log('⚠️ Не удалось отправить в API:', error.message);
            console.log('⚠️ Полная ошибка:', error);
        }
    }
    
    // 3. Сохраняем в localStorage
    this.saveData();
    return newPet;
}
    
    async updatePet(petId, petData) {
        const index = this.data.pets.findIndex(pet => pet.id === petId);
        if (index === -1) return false;
        
        this.data.pets[index] = { ...this.data.pets[index], ...petData };
        
        if (this.useApi && window.apiService) {
            try {
                await window.apiService.updatePet(petId, petData);
                console.log('✅ Питомец обновлен в API');
            } catch (error) {
                console.log('⚠️ Не удалось обновить в API');
            }
        }
        
        this.saveData();
        return true;
    }
    
    async deletePet(petId) {
        const index = this.data.pets.findIndex(pet => pet.id === petId);
        if (index === -1) return false;
        
        this.data.pets.splice(index, 1);
        
        if (this.data.currentPetId === petId && this.data.pets.length > 0) {
            this.data.currentPetId = this.data.pets[0].id;
        } else if (this.data.pets.length === 0) {
            this.data.currentPetId = null;
        }
        
        if (this.useApi && window.apiService) {
            try {
                await window.apiService.deletePet(petId);
                console.log('✅ Питомец удален из API');
            } catch (error) {
                console.log('⚠️ Не удалось удалить из API');
            }
        }
        
        this.saveData();
        return true;
    }

    getEvents(petId) {
        return this.data.events.filter(event => event.petId === petId);
    }

    getCareItems(petId) {
        return this.data.careItems.filter(item => item.petId === petId);
    }

    getHealthMetrics(petId) {
        const petMetrics = this.data.healthData.metrics.find(m => m.petId === petId);
        if (petMetrics) return petMetrics;
        
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
            this.data.healthData.metrics[index] = { 
                ...this.data.healthData.metrics[index], 
                ...metrics 
            };
        } else {
            this.data.healthData.metrics.push({ petId, ...metrics });
        }
        this.saveData();
    }

    getWeightHistory(petId) {
        const history = this.data.healthData.weightHistory.find(w => w.petId === petId);
        if (history) return history.data;
        
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
        
        history.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        
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
}