class OverviewPresenter extends Presenter {
    constructor(app) {
        super(app);
        this.overviewModal = null;
        
        if (typeof OverviewModal !== 'undefined') {
            this.overviewModal = new OverviewModal(app);
        }
        
        // Привязываем контекст для обработчиков
        this.handleDocumentClick = this.handleDocumentClick.bind(this);
        this.handleAddEvent = this.handleAddEvent.bind(this);
        this.handleAddCare = this.handleAddCare.bind(this);
    }
    
    getContent() {
        const pet = this.getCurrentPet();
        const events = this.dataManager.getEvents(pet.id);
        
        const careItems = this.dataManager.getCareItems ? 
            this.dataManager.getCareItems(pet.id) : [];
        
        const recentCareItems = careItems
            .sort((a, b) => {
                const dateA = new Date(`${a.date}T${a.time || '00:00'}`);
                const dateB = new Date(`${b.date}T${b.time || '00:00'}`);
                return dateB - dateA;
            });
        
        const getCareIcon = (type) => {
            const icons = {
                feeding: 'bone',
                walk: 'walking',
                grooming: 'cut',
                bath: 'bath',
                nails: 'cut',
                teeth: 'tooth',
                medication: 'pills',
                play: 'baseball-ball',
                training: 'graduation-cap'
            };
            return icons[type] || 'heart';
        };
        
        const formatDateDisplay = (dateString) => {
            if (!dateString) return 'Недавно';
            
            const date = new Date(dateString);
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (date.toDateString() === today.toDateString()) {
                return 'Сегодня';
            } else if (date.toDateString() === yesterday.toDateString()) {
                return 'Вчера';
            } else {
                return date.toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long'
                });
            }
        };
        
        const formatTimeAgo = (dateString, timeString) => {
            if (!dateString) return 'недавно';
            
            const itemDate = new Date(dateString + (timeString ? 'T' + timeString : ''));
            if (isNaN(itemDate.getTime())) return 'недавно';
            
            const now = new Date();
            const diffMs = now - itemDate;
            const diffMinutes = Math.floor(diffMs / (1000 * 60));
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            const diffDays = Math.floor(diffHours / 24);
            
            if (diffMinutes < 60) {
                return diffMinutes <= 1 ? 'только что' : `${diffMinutes} мин назад`;
            } else if (diffHours < 24) {
                return `${diffHours} час${diffHours === 1 ? '' : (diffHours > 1 && diffHours < 5 ? 'а' : 'ов')} назад`;
            } else if (diffDays === 1) {
                return 'вчера';
            } else if (diffDays < 7) {
                return `${diffDays} дн${diffDays === 1 ? 'ь' : 'я'} назад`;
            } else {
                return `${diffDays} дней назад`;
            }
        };
        
        const groupedCareItems = {};
        recentCareItems.forEach(item => {
            const dateKey = item.date || new Date().toISOString().split('T')[0];
            if (!groupedCareItems[dateKey]) {
                groupedCareItems[dateKey] = [];
            }
            groupedCareItems[dateKey].push(item);
        });
        
        const sortedDates = Object.keys(groupedCareItems).sort((a, b) => new Date(b) - new Date(a));
        
        return `
            <section class="full-width-section">
                <div class="section-header">
                    <h2>Общая статистика</h2>
                    <p>Основные показатели здоровья вашего питомца</p>
                </div>
                <div class="quick-stats">
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-heartbeat"></i></div>
                        <div class="stat-info">
                            <span class="value" id="health-status-value">${pet.healthStatus || 'Отличное'}</span>
                            <span class="label">Состояние здоровья</span>
                        </div>
                        <button class="stat-edit-btn" data-stat="healthStatus">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-weight"></i></div>
                        <div class="stat-info">
                            <span class="value" id="weight-value">${pet.weight || '4.8'} кг</span>
                            <span class="label">Текущий вес</span>
                        </div>
                        <button class="stat-edit-btn" data-stat="weight">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-birthday-cake"></i></div>
                        <div class="stat-info">
                            <span class="value" id="age-value">${pet.age || '3'} года</span>
                            <span class="label">Возраст</span>
                        </div>
                        <button class="stat-edit-btn" data-stat="age">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-syringe"></i></div>
                        <div class="stat-info">
                            <span class="value" id="vaccination-value">${pet.nextVaccination ? this.calculateDaysLeft(pet.nextVaccination) : '28'} дней</span>
                            <span class="label">До вакцинации</span>
                        </div>
                        <button class="stat-edit-btn" data-stat="vaccination">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </div>
            </section>

            <section class="full-width-section">
                <div class="section-header">
                    <h2>Ближайшие события</h2>
                    <p>Предстоящие визиты и процедуры</p>
                    <button class="add-event-btn" id="add-event-btn">
                        <i class="fas fa-plus"></i> Добавить событие
                    </button>
                </div>
                <div class="events-grid">
                    ${events.length > 0 ? events.map(event => `
                        <div class="event-card">
                            <div class="event-icon"><i class="fas fa-${this.getEventIcon(event.type)}"></i></div>
                            <div class="event-content">
                                <h4>${event.title}</h4>
                                <p>${event.description}</p>
                                <span class="event-date">${this.formatDate(event.date)}, ${event.time}</span>
                            </div>
                            <button class="event-edit-btn" data-event-id="${event.id}">Редактировать</button>
                        </div>
                    `).join('') : '<p style="grid-column: 1/-1; text-align: center; color: var(--text-tertiary);">Нет событий</p>'}
                </div>
            </section>

            <section class="full-width-section">
                <div class="section-header">
                    <h2>Журнал ухода</h2>
                    <p>Последние процедуры и уход за питомцем</p>
                    <button class="add-care-btn" id="add-care-btn">
                        <i class="fas fa-plus"></i> Добавить запись
                    </button>
                </div>
                <div class="care-journal">
                    <div class="care-timeline">
                        ${sortedDates.length > 0 ? sortedDates.map(dateKey => {
                            const items = groupedCareItems[dateKey];
                            return `
                                <div class="care-entry">
                                    <div class="care-date">${formatDateDisplay(dateKey)}</div>
                                    <div class="care-items">
                                        ${items.map(item => `
                                            <div class="care-item" data-care-id="${item.id}">
                                                <div class="care-icon"><i class="fas fa-${getCareIcon(item.type)}"></i></div>
                                                <div class="care-details">
                                                    <strong>${item.title || 'Без названия'}</strong>
                                                    <span>${item.time ? item.time + ', ' : ''}${formatTimeAgo(item.date, item.time)}</span>
                                                    <p>${item.description || 'Нет описания'}</p>
                                                    ${item.notes ? `<small style="color: var(--text-tertiary); font-style: italic;">${item.notes}</small>` : ''}
                                                </div>
                                                <button class="btn-edit care-edit-btn" data-care-id="${item.id}">Редактировать</button>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            `;
                        }).join('') : `
                            <div class="care-entry">
                                <div class="care-date">Сегодня</div>
                                <div class="care-items">
                                    <div class="care-item">
                                        <div class="care-icon"><i class="fas fa-plus-circle"></i></div>
                                        <div class="care-details">
                                            <strong>Нет записей ухода</strong>
                                            <span>Добавьте первую запись</span>
                                            <p>Нажмите кнопку "Добавить запись" выше</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `}
                    </div>
                </div>
            </section>
        `;
    }
    
    getEventIcon(type) {
        const icons = {
            medical: 'hospital',
            medication: 'pills',
            grooming: 'cut',
            bath: 'bath',
            walk: 'walking',
            play: 'baseball-ball'
        };
        
        return icons[type] || 'calendar';
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', { 
            day: 'numeric', 
            month: 'long' 
        });
    }
    
    calculateDaysLeft(dateString) {
        const today = new Date();
        const targetDate = new Date(dateString);
        const diffTime = targetDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    }
    
    setupEventListeners() {
        super.setupEventListeners();
        
        // Удаляем старые обработчики
        this.removeEventListeners();
        
        this.setupModal();
        
        // Обработчик для кликов по документу (делегирование)
        document.addEventListener('click', this.handleDocumentClick);
        
        // Обработчики для кнопок добавления
        const addEventBtn = document.getElementById('add-event-btn');
        if (addEventBtn) {
            addEventBtn.addEventListener('click', this.handleAddEvent);
        }
        
        const addCareBtn = document.getElementById('add-care-btn');
        if (addCareBtn) {
            addCareBtn.addEventListener('click', this.handleAddCare);
        }
    }
    
    removeEventListeners() {
        // Удаляем обработчик кликов по документу
        document.removeEventListener('click', this.handleDocumentClick);
        
        // Удаляем обработчики с кнопок
        const addEventBtn = document.getElementById('add-event-btn');
        if (addEventBtn) {
            addEventBtn.removeEventListener('click', this.handleAddEvent);
        }
        
        const addCareBtn = document.getElementById('add-care-btn');
        if (addCareBtn) {
            addCareBtn.removeEventListener('click', this.handleAddCare);
        }
    }
    
    handleDocumentClick(e) {
        // Обработка кликов на кнопки редактирования событий
        if (e.target.classList.contains('event-edit-btn')) {
            const eventId = parseInt(e.target.dataset.eventId);
            this.setupModal();
            if (this.overviewModal) {
                this.overviewModal.showEditEventModal(eventId);
            }
            return;
        }
        
        // Обработка кликов на кнопки редактирования статистики
        if (e.target.closest('.stat-edit-btn')) {
            const statBtn = e.target.closest('.stat-edit-btn');
            const stat = statBtn.dataset.stat;
            this.setupModal();
            if (this.overviewModal) {
                this.overviewModal.showEditStatModal(stat);
            }
            return;
        }
        
        // Обработка кликов на кнопки редактирования ухода
        if (e.target.classList.contains('care-edit-btn')) {
            const careItemId = parseInt(e.target.dataset.careId);
            this.setupModal();
            if (this.overviewModal) {
                this.overviewModal.showEditCareModalById(careItemId);
            }
            return;
        }
    }
    
    handleAddEvent() {
        this.setupModal();
        if (this.overviewModal) {
            this.overviewModal.showAddEventModal();
        }
    }
    
    handleAddCare() {
        this.setupModal();
        if (this.overviewModal) {
            this.overviewModal.showAddCareModal();
        }
    }
    
    setupModal() {
        if (!this.overviewModal && typeof OverviewModal !== 'undefined') {
            this.overviewModal = new OverviewModal(this.app);
        }
        
        if (this.overviewModal && typeof this.overviewModal.setOverviewPresenter === 'function') {
            this.overviewModal.setOverviewPresenter(this);
        }
    }
    
    getCurrentPet() {
        return this.app.getCurrentPet();
    }
    
    // При уничтожении презентера удаляем обработчики
    destroy() {
        this.removeEventListeners();
        super.destroy();
    }
}