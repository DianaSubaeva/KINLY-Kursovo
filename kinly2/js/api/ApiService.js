
class ApiService {
    constructor() {
        this.baseUrl = 'https://kinly.free.beeceptor.com';
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}/${endpoint}`;
        
        console.log(`API Request: ${url}`); // Для отладки
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
            ...options
        };

        try {
            const response = await fetch(url, defaultOptions);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Request Error:', error);
            // Если API недоступно, вернем пустой массив для тестирования
            if (endpoint === 'pets') {
                console.warn('Использую тестовые данные из-за ошибки API');
                return this.getMockPets();
            }
            throw error;
        }
    }

    // Возвращает тестовых питомцев, если API не отвечает
    getMockPets() {
        return [
            {
                id: 1,
                name: 'Джаспер (тест)',
                type: 'cat',
                breed: 'Абиссинский',
                age: 3,
                weight: 4.8,
                healthStatus: 'Отличное'
            },
            {
                id: 2,
                name: 'Вупи (тест)',
                type: 'dog',
                breed: 'Золотистый ретривер',
                age: 5,
                weight: 28,
                healthStatus: 'Хорошее'
            }
        ];
    }

    // ========== МЕТОДЫ ДЛЯ РАБОТЫ С ПИТОМЦАМИ ==========
    
    async getPets() {
        return this.request('pets');
    }

    async getPet(id) {
        return this.request(`pets/${id}`);
    }

    async createPet(petData) {
        return this.request('pets', {
            method: 'POST',
            body: JSON.stringify(petData)
        });
    }

    async updatePet(id, updates) {
        return this.request(`pets/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates)
        });
    }

    async deletePet(id) {
        return this.request(`pets/${id}`, {
            method: 'DELETE'
        });
    }
}