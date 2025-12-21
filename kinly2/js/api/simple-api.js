class SimpleApiService {
    constructor() {
        this.baseUrl = 'https://6945b0c3ed253f51719c1390.mockapi.io/pets';
        
        console.log(' API Service: Только питомцы (базовый функционал)');
        console.log(` Базовая ссылка: ${this.baseUrl}`);
    }
    
    async checkConnection() {
        try {
            const response = await fetch(`${this.baseUrl}`);
            if (response.ok) {
                console.log('Подключение к API: УСПЕХ');
                return true;
            }
            console.log('Подключение к API: ОШИБКА HTTP');
            return false;
        } catch (error) {
            console.log('Подключение к API: СЕТЕВАЯ ОШИБКА', error.message);
            return false;
        }
    }
    
    async getPets() {
        try {
            console.log(`GET ${this.baseUrl}`);
            const response = await fetch(`${this.baseUrl}`);
            
            if (!response.ok) {
                throw new Error(`HTTP ошибка: ${response.status}`);
            }
            
            const pets = await response.json();
            console.log(`Получено ${pets.length} питомцев`);
            return pets;
            
        } catch (error) {
            console.error('Ошибка getPets:', error.message);
            return []; 
        }
    }
    
    async createPet(petData) {
        try {
            console.log(' POST: Создание питомца', petData);
            
            const apiPetData = {
                name: String(petData.name || ''),
                type: String(petData.type || ''),
                breed: String(petData.breed || ''),
                age: Number(petData.age) || 0,
                weight: Number(petData.weight) || 0,
                healthStatus: String(petData.healthStatus || ''),
                nextVaccination: String(petData.nextVaccination || ''),
                avatar: String(petData.avatar || 'default')
            };
            
            const response = await fetch(`${this.baseUrl}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(apiPetData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ошибка: ${response.status}`);
            }
            
            const result = await response.json();
            console.log(' Питомец создан в API:', result);
            return result;
            
        } catch (error) {
            console.error(' Ошибка createPet:', error.message);
            throw error; // Пробрасываем ошибку
        }
    }
    
    async updatePet(petId, petData) {
        try {
            console.log(`📡 PUT: Обновление питомца ${petId}`, petData);
            
            const apiPetData = {
                name: String(petData.name || ''),
                type: String(petData.type || ''),
                breed: String(petData.breed || ''),
                age: Number(petData.age) || 0,
                weight: Number(petData.weight) || 0,
                healthStatus: String(petData.healthStatus || ''),
                nextVaccination: String(petData.nextVaccination || ''),
                avatar: String(petData.avatar || 'default')
            };
            
            const response = await fetch(`${this.baseUrl}${petId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(apiPetData)
            });
            
            const result = await response.json();
            console.log('✅ Питомец обновлен:', result);
            return result;
            
        } catch (error) {
            console.error('❌ Ошибка updatePet:', error.message);
            throw error;
        }
    }
    
    async deletePet(petId) {
        try {
            console.log(`📡 DELETE: Удаление питомца ${petId}`);
            
            const response = await fetch(`${this.baseUrl}${petId}`, {
                method: 'DELETE'
            });
            
            const result = await response.json();
            console.log('✅ Питомец удален:', result);
            return result;
            
        } catch (error) {
            console.error('❌ Ошибка deletePet:', error.message);
            throw error;
        }
    }
}

window.apiService = new SimpleApiService();

window.addEventListener('DOMContentLoaded', async () => {
    const isConnected = await window.apiService.checkConnection();
    if (isConnected) {
        console.log('🎉 API готов к работе!');
    } else {
        console.log('⚠️ API недоступно, но приложение будет работать локально');
    }
});