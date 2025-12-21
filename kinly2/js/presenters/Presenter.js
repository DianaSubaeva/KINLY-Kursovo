class Presenter {
    constructor(app) {
        this.app = app;
        this.dataManager = app.dataManager;
        this.modalManager = app.modalManager;
        this.notificationManager = app.notificationManager;
    }
    
    render() {
        const content = this.getContent();
        document.getElementById('page-content').innerHTML = content;
        this.setupEventListeners();
    }
    
    getContent() {
        return '';
    }
    
    setupEventListeners() {
    }
    
    getCurrentPet() {
        return this.app.currentPet;
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    }
    
    calculateDaysLeft(targetDate) {
        const target = new Date(targetDate);
        const today = new Date();
        const diffTime = target - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }
}