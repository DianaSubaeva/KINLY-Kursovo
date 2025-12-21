class App {
    constructor() {
        this.currentPet = null;
        this.currentPage = 'overview';
        this.presenters = {};
        setTimeout(() => this.init(), 300);
    }
    
    async init() {
        console.log(' App.init() начат');
        
        this.dataManager = new DataManager();
        console.log(' DataManager создан');
        
        await this.dataManager.init();
        console.log(' DataManager инициализирован');
        
        this.modalManager = new ModalManager(this);
        this.notificationManager = new NotificationManager(this);
        this.petManager = new PetManager(this);
        this.profileManager = new ProfileManager(this);
        
        const currentPetId = this.dataManager.getCurrentPetId();
        if (currentPetId) {
            this.currentPet = this.dataManager.getPet(currentPetId);
            console.log(' Текущий питомец:', this.currentPet);
        }
        
        this.presenters.overview = new OverviewPresenter(this);
        this.presenters.health = new HealthPresenter(this);
        this.presenters.care = new CarePresenter(this);
        this.presenters.nutrition = new NutritionPresenter(this);
        this.presenters.gallery = new GalleryPresenter(this);
        this.presenters.reminders = new RemindersPresenter(this);
        
        this.setupEventListeners();
        this.updateCurrentDate();
        this.petManager.renderPetsList();
        this.loadPage('overview');
        
        console.log('Приложение полностью инициализировано');
    }
    
    setupEventListeners() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.closest('.nav-link').dataset.page;
                this.loadPage(page);
            });
        });
        
        document.getElementById('notification-bell').addEventListener('click', () => {
            this.notificationManager.showNotification('Нет новых уведомлений', 'info');
        });
        
        document.getElementById('add-pet-btn').addEventListener('click', () => {
            this.petManager.showAddPetModal();
        });
    }
    
    loadPage(page) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === page) {
                link.classList.add('active');
            }
        });
        
        this.updateBreadcrumb(page);
        
        if (this.presenters[page]) {
            this.presenters[page].render();
            this.currentPage = page;
        }
    }
    
    updateBreadcrumb(page) {
        const breadcrumb = document.getElementById('breadcrumb');
        const pageNames = {
            overview: 'Обзор',
            health: 'Здоровье',
            care: 'Уход',
            nutrition: 'Питание',
            gallery: 'Галерея',
            reminders: 'Напоминания'
        };
        
        breadcrumb.innerHTML = `
            <a href="#">Главная</a>
            <span class="breadcrumb-divider">/</span>
            <span class="current">${pageNames[page]}</span>
        `;
    }
    
    updateCurrentDate() {
        const dateElement = document.getElementById('current-date');
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateString = now.toLocaleDateString('ru-RU', options);
        
        dateElement.innerHTML = `
            <span class="date-icon"><i class="far fa-calendar"></i></span>
            ${dateString}
        `;
    }
    
    switchPet(petId) {
        this.currentPet = this.dataManager.getPet(petId);
        this.dataManager.setCurrentPetId(petId);
        this.petManager.renderPetsList();
        this.saveData();
        
        this.loadPage(this.currentPage);
    }
    
    updateCurrentPetData() {
        const currentPetId = this.dataManager.getCurrentPetId();
        this.currentPet = this.dataManager.getPet(currentPetId);
    }
    
    showNotification(message, type = 'info') {
        this.notificationManager.showNotification(message, type);
    }
    
    saveData() {
        this.dataManager.saveData();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM загружен, создаю App...');
    window.app = new App();
});