class OverviewPresenter extends Presenter {
    getContent() {
        const pet = this.getCurrentPet();
        const events = this.dataManager.getEvents(pet.id);
        
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
                        <div class="care-entry">
                            <div class="care-date">Сегодня</div>
                            <div class="care-items">
                                <div class="care-item">
                                    <div class="care-icon"><i class="fas fa-bone"></i></div>
                                    <div class="care-details">
                                        <strong>Кормление</strong>
                                        <span>2 часа назад</span>
                                        <p>Сухой корм Premium 60г</p>
                                    </div>
                                    <button class="btn-edit">Редактировать</button>
                                </div>
                                <div class="care-item">
                                    <div class="care-icon"><i class="fas fa-walking"></i></div>
                                    <div class="care-details">
                                        <strong>Прогулка</strong>
                                        <span>4 часа назад</span>
                                        <p>Утренняя прогулка в парке</p>
                                    </div>
                                    <button class="btn-edit">Редактировать</button>
                                </div>
                            </div>
                        </div>
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
    
    setupEventListeners() {
        // Добавление события
        const addEventBtn = document.getElementById('add-event-btn');
        if (addEventBtn) {
            addEventBtn.addEventListener('click', () => {
                this.showAddEventModal();
            });
        }
        
        // Редактирование события
        document.querySelectorAll('.event-edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const eventId = parseInt(e.target.dataset.eventId);
                this.showEditEventModal(eventId);
            });
        });
        
        // Редактирование статистики
        document.querySelectorAll('.stat-edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const stat = e.target.closest('.stat-edit-btn').dataset.stat;
                this.showEditStatModal(stat);
            });
        });
        
        // Добавление записи ухода
        const addCareBtn = document.getElementById('add-care-btn');
        if (addCareBtn) {
            addCareBtn.addEventListener('click', () => {
                this.showAddCareModal();
            });
        }
        
        // Редактирование записи ухода
        document.querySelectorAll('.care-item .btn-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const careItem = e.target.closest('.care-item');
                const title = careItem.querySelector('strong').textContent;
                this.showEditCareModal(title);
            });
        });
    }
    
 showEditStatModal(stat) {
        const pet = this.getCurrentPet();
        let title = '';
        let content = '';
        
        switch(stat) {
            case 'healthStatus':
                title = 'Состояние здоровья';
                content = `
                    <form id="edit-stat-form">
                        <div class="form-group">
                            <label for="stat-value">Состояние здоровья</label>
                            <select id="stat-value">
                                <option value="Отличное" ${pet.healthStatus === 'Отличное' ? 'selected' : ''}>Отличное</option>
                                <option value="Хорошее" ${pet.healthStatus === 'Хорошее' ? 'selected' : ''}>Хорошее</option>
                                <option value="Удовлетворительное" ${pet.healthStatus === 'Удовлетворительное' ? 'selected' : ''}>Удовлетворительное</option>
                                <option value="Требует внимания" ${pet.healthStatus === 'Требует внимания' ? 'selected' : ''}>Требует внимания</option>
                            </select>
                        </div>
                    </form>
                `;
                break;
                
            case 'weight':
                title = 'Текущий вес';
                content = `
                    <form id="edit-stat-form">
                        <div class="form-group">
                            <label for="stat-value">Вес (кг)</label>
                            <input type="number" id="stat-value" value="${pet.weight || '4.8'}" step="0.1" min="0" max="100" required>
                        </div>
                    </form>
                `;
                break;
                
            case 'age':
                title = 'Возраст';
                content = `
                    <form id="edit-stat-form">
                        <div class="form-group">
                            <label for="stat-value">Возраст (лет)</label>
                            <input type="number" id="stat-value" value="${pet.age || '3'}" min="0" max="50" required>
                        </div>
                    </form>
                `;
                break;
                
            case 'vaccination':
                title = 'Дата следующей вакцинации';
                const nextVaccinationDate = pet.nextVaccination || new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                content = `
                    <form id="edit-stat-form">
                        <div class="form-group">
                            <label for="stat-value">Дата следующей вакцинации</label>
                            <input type="date" id="stat-value" value="${nextVaccinationDate}" required>
                        </div>
                    </form>
                `;
                break;
        }
        
        this.modalManager.showModal({
            title: title,
            content: content,
            buttons: [
                { 
                    text: 'Отменить', 
                    type: 'secondary', 
                    action: 'close' 
                },
                { 
                    text: 'Сохранить', 
                    type: 'primary', 
                    action: () => {
                        const newValue = document.getElementById('stat-value').value;
                        const updateData = {};
                        
                        switch(stat) {
                            case 'healthStatus':
                                updateData.healthStatus = newValue;
                                break;
                            case 'weight':
                                updateData.weight = parseFloat(newValue);
                                // Добавляем запись в историю веса
                                const weightHistory = pet.weightHistory || [];
                                weightHistory.push({
                                    date: new Date().toISOString().split('T')[0],
                                    weight: parseFloat(newValue)
                                });
                                updateData.weightHistory = weightHistory;
                                break;
                            case 'age':
                                updateData.age = parseInt(newValue);
                                break;
                            case 'vaccination':
                                updateData.nextVaccination = newValue;
                                break;
                        }
                        
                        this.dataManager.updatePet(pet.id, updateData);
                        this.app.saveData();
                        // ОБНОВЛЯЕМ ДАННЫЕ ТЕКУЩЕГО ПИТОМЦА В ПРИЛОЖЕНИИ
                        this.app.updateCurrentPetData();
                        this.app.showNotification('Данные обновлены', 'success');
                        this.render();
                    }
                }
            ]
        });
    }
    
    showEditEventModal(eventId) {
        const pet = this.getCurrentPet();
        const events = this.dataManager.getEvents(pet.id);
        const event = events.find(e => e.id === eventId);
        
        if (!event) return;
        
        this.modalManager.showModal({
            title: 'Редактировать событие',
            content: `
                <form id="event-form">
                    <div class="form-group">
                        <label for="event-title">Название события</label>
                        <input type="text" id="event-title" value="${event.title}" required>
                    </div>
                    <div class="form-group">
                        <label for="event-description">Описание</label>
                        <textarea id="event-description" rows="3">${event.description}</textarea>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="event-date">Дата</label>
                            <input type="date" id="event-date" value="${event.date}" required>
                        </div>
                        <div class="form-group">
                            <label for="event-time">Время</label>
                            <input type="time" id="event-time" value="${event.time}" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="event-type">Тип события</label>
                        <select id="event-type">
                            <option value="medical" ${event.type === 'medical' ? 'selected' : ''}>Медицинское</option>
                            <option value="medication" ${event.type === 'medication' ? 'selected' : ''}>Лекарства</option>
                            <option value="grooming" ${event.type === 'grooming' ? 'selected' : ''}>Уход</option>
                            <option value="bath" ${event.type === 'bath' ? 'selected' : ''}>Купание</option>
                            <option value="walk" ${event.type === 'walk' ? 'selected' : ''}>Прогулка</option>
                            <option value="play" ${event.type === 'play' ? 'selected' : ''}>Игры</option>
                        </select>
                    </div>
                </form>
            `,
            buttons: [
                { 
                    text: 'Отменить', 
                    type: 'secondary', 
                    action: 'close' 
                },
                { 
                    text: 'Удалить', 
                    type: 'secondary', 
                    action: () => {
                        if (confirm('Вы уверены, что хотите удалить это событие?')) {
                            this.dataManager.deleteEvent(eventId);
                            this.app.saveData();
                            this.app.showNotification('Событие удалено', 'warning');
                            this.render();
                        }
                    }
                },
                { 
                    text: 'Сохранить', 
                    type: 'primary', 
                    action: () => {
                        const eventData = {
                            title: document.getElementById('event-title').value,
                            description: document.getElementById('event-description').value,
                            date: document.getElementById('event-date').value,
                            time: document.getElementById('event-time').value,
                            type: document.getElementById('event-type').value
                        };
                        
                        this.dataManager.updateEvent(eventId, eventData);
                        this.app.saveData();
                        this.app.showNotification('Событие обновлено', 'success');
                        this.render();
                    }
                }
            ]
        });
    }
    
    showAddCareModal() {
        this.modalManager.showModal({
            title: 'Добавить запись ухода',
            content: `
                <form id="care-form">
                    <div class="form-group">
                        <label for="care-type">Тип ухода</label>
                        <select id="care-type">
                            <option value="feeding">Кормление</option>
                            <option value="walk">Прогулка</option>
                            <option value="grooming">Уход за шерстью</option>
                            <option value="bath">Купание</option>
                            <option value="nails">Стрижка когтей</option>
                            <option value="teeth">Чистка зубов</option>
                            <option value="medication">Лекарства</option>
                            <option value="play">Игры</option>
                            <option value="training">Тренировка</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="care-title">Название</label>
                        <input type="text" id="care-title" required>
                    </div>
                    <div class="form-group">
                        <label for="care-description">Описание</label>
                        <textarea id="care-description" rows="3" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="care-notes">Примечания</label>
                        <textarea id="care-notes" rows="2"></textarea>
                    </div>
                </form>
            `,
            buttons: [
                { 
                    text: 'Отменить', 
                    type: 'secondary', 
                    action: 'close' 
                },
                { 
                    text: 'Добавить', 
                    type: 'primary', 
                    action: () => {
                        this.app.showNotification('Запись ухода добавлена', 'success');
                    }
                }
            ]
        });
    }
    
    showEditCareModal(title) {
        this.modalManager.showModal({
            title: 'Редактировать запись ухода',
            content: `
                <form id="care-form">
                    <div class="form-group">
                        <label for="care-title">Название</label>
                        <input type="text" id="care-title" value="${title}" required>
                    </div>
                    <div class="form-group">
                        <label for="care-description">Описание</label>
                        <textarea id="care-description" rows="3" required>Описание процедуры</textarea>
                    </div>
                </form>
            `,
            buttons: [
                { 
                    text: 'Отменить', 
                    type: 'secondary', 
                    action: 'close' 
                },
                { 
                    text: 'Сохранить', 
                    type: 'primary', 
                    action: () => {
                        this.app.showNotification('Запись ухода обновлена', 'success');
                    }
                }
            ]
        });
    }
}