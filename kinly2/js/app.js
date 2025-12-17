class App {
    constructor() {
        this.currentPet = null;
        this.currentPage = 'overview';
        this.presenters = {};
        
        this.init();
    }
    
    init() {
        // Инициализация компонентов
        this.dataManager = new DataManager();
        this.modalManager = new ModalManager(this);
        this.notificationManager = new NotificationManager(this);
        this.petManager = new PetManager(this);
        this.profileManager = new ProfileManager(this);
        
        // Установка текущего питомца
        const currentPetId = this.dataManager.getCurrentPetId();
        this.currentPet = this.dataManager.getPet(currentPetId);
        
        // Инициализация презентеров
        this.presenters.overview = new OverviewPresenter(this);
        this.presenters.health = new HealthPresenter(this);
        this.presenters.care = new CarePresenter(this);
        this.presenters.nutrition = new NutritionPresenter(this);
        this.presenters.gallery = new GalleryPresenter(this);
        this.presenters.reminders = new RemindersPresenter(this);
        
        // Настройка обработчиков событий
        this.setupEventListeners();
        
        // Установка текущей даты
        this.updateCurrentDate();
        
        // Обновление списка питомцев
        this.petManager.renderPetsList();
        
        // Загрузка начальной страницы
        this.loadPage('overview');
    }
    
    setupEventListeners() {
        // Навигация
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.closest('.nav-link').dataset.page;
                this.loadPage(page);
            });
        });
        
        // Колокольчик уведомлений
        document.getElementById('notification-bell').addEventListener('click', () => {
            this.notificationManager.showNotification('Нет новых уведомлений', 'info');
        });
        
        // Добавление питомца
        document.getElementById('add-pet-btn').addEventListener('click', () => {
            this.petManager.showAddPetModal();
        });
    }
    
    loadPage(page) {
        // Обновление активной ссылки в навигации
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === page) {
                link.classList.add('active');
            }
        });
        
        // Обновление хлебных крошек
        this.updateBreadcrumb(page);
        
        // Загрузка контента страницы
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
        
        // Перезагрузка текущей страницы с новыми данными
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

// Инициализация приложения при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});