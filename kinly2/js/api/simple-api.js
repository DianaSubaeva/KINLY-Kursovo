// js/api/simple-api.js
class SimpleApiService {
    constructor(baseUrl = 'http://localhost:3001/api') {
        this.baseUrl = baseUrl;
    }
    
    // Проверка подключения
    async checkConnection() {
        try {
            const response = await fetch(`${this.baseUrl}/check`);
            return response.ok;
        } catch (error) {
            console.log('❌ API недоступно');
            return false;
        }
    }
    
    // Получить всех питомцев
    async getPets() {
        try {
            const response = await fetch(`${this.baseUrl}/pets`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.log('Ошибка при получении питомцев:', error);
            return [];
        }
    }
    
    // Создать питомца
    async createPet(petData) {
        try {
            const response = await fetch(`${this.baseUrl}/pets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(petData)
            });
            
            const data = await response.json();
            console.log('API ответ:', data);
            return data;
            
        } catch (error) {
            console.log('Ошибка при создании питомца:', error);
            throw error;
        }
    }
    
    // Обновить питомца
    async updatePet(petId, petData) {
        try {
            const response = await fetch(`${this.baseUrl}/pets/${petId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(petData)
            });
            
            const data = await response.json();
            console.log('API ответ:', data);
            return data;
            
        } catch (error) {
            console.log('Ошибка при обновлении питомца:', error);
            throw error;
        }
    }
    
    // Удалить питомца
    async deletePet(petId) {
        try {
            const response = await fetch(`${this.baseUrl}/pets/${petId}`, {
                method: 'DELETE'
            });
            
            const data = await response.json();
            console.log('API ответ:', data);
            return data;
            
        } catch (error) {
            console.log('Ошибка при удалении питомца:', error);
            throw error;
        }
    }
}

// Создаем глобальный экземпляр
window.apiService = new SimpleApiService();