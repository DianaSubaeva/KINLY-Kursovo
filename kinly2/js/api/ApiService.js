// kinly2/js/api/ApiService.js
class ApiService {
    constructor() {
        this.baseUrl = 'https://kinly.free.beeceptor.com';
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}/${endpoint}`;
        
        console.log(`API: ${options.method || 'GET'} ${url}`);
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
            ...options
        };

        try {
            const response = await fetch(url, defaultOptions);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`API Error:`, error.message);
            throw error;
        }
    }

    // ========== ТОЛЬКО ПИТОМЦЫ ==========
    async getPets() {
        return this.request('pets');
    }

    async createPet(petData) {
        return this.request('pets', {
            method: 'POST',
            body: JSON.stringify(petData)
        });
    }
}