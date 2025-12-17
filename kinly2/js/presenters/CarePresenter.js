class CarePresenter extends Presenter {
    constructor(app) {
        super(app);
        this.careLog = [];
        this.careStats = {
            lastBath: '3 дня назад',
            lastNailTrim: '14 дней',
            lastParasiteTreatment: '7 дней',
            lastTeethCleaning: '2 дня назад'
        };
    }
    
    getContent() {
        const pet = this.getCurrentPet();
        if (!pet) return '';
        
        // Загружаем careLog только если еще не загружен
        if (this.careLog.length === 0) {
            this.loadCareLog();
        }
        
        return `
            <section class="full-width-section">
                <div class="section-header">
                    <h2>Уход за питомцем</h2>
                    <p>Процедуры и гигиена</p>
                </div>
                <div class="quick-stats">
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-bath"></i></div>
                        <div class="stat-info">
                            <span class="value" id="last-bath-value">${this.careStats.lastBath}</span>
                            <span class="label">Последнее купание</span>
                        </div>
                        <button class="stat-edit-btn" data-care="bath">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-cut"></i></div>
                        <div class="stat-info">
                            <span class="value" id="last-nails-value">${this.careStats.lastNailTrim}</span>
                            <span class="label">Стрижка когтей</span>
                        </div>
                        <button class="stat-edit-btn" data-care="nails">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-spray-can"></i></div>
                        <div class="stat-info">
                            <span class="value" id="last-parasites-value">${this.careStats.lastParasiteTreatment}</span>
                            <span class="label">Обработка от паразитов</span>
                        </div>
                        <button class="stat-edit-btn" data-care="parasites">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-tooth"></i></div>
                        <div class="stat-info">
                            <span class="value" id="last-teeth-value">${this.careStats.lastTeethCleaning}</span>
                            <span class="label">Чистка зубов</span>
                        </div>
                        <button class="stat-edit-btn" data-care="teeth">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </div>
            </section>

            <section class="full-width-section">
                <div class="section-header">
                    <h2>Журнал ухода</h2>
                    <p>История процедур и ухода за питомцем</p>
                    <button class="add-care-btn" id="add-care-btn">
                        <i class="fas fa-plus"></i> Добавить процедуру
                    </button>
                </div>
                <div class="care-journal">
                    <div class="care-timeline">
                        ${this.careLog.length > 0 ? this.careLog.map(entry => `
                            <div class="care-entry">
                                <div class="care-date">${this.getRelativeDate(entry.date)}</div>
                                <div class="care-items">
                                    ${entry.items.map(item => `
                                        <div class="care-item" data-item-id="${item.id}">
                                            <div class="care-icon"><i class="fas fa-${this.getCareIcon(item.type)}"></i></div>
                                            <div class="care-details">
                                                <strong>${item.title}</strong>
                                                <span>${item.time}</span>
                                                <p>${item.description}</p>
                                                ${item.details ? `<p style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">${item.details}</p>` : ''}
                                            </div>
                                            <button class="btn-edit care-item-edit" data-item-id="${item.id}">Редактировать</button>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('') : '<p style="text-align: center; color: var(--text-tertiary); padding: 20px;">Нет записей</p>'}
                    </div>
                </div>
            </section>
        `;
    }
    
    getRelativeDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = now - date;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Сегодня';
        if (diffDays === 1) return 'Вчера';
        if (diffDays < 7) return `${diffDays} дня назад`;
        return this.formatDate(dateString);
    }
    
    getCareIcon(type) {
        const icons = {
            feeding: 'bone',
            walk: 'walking',
            medication: 'pills',
            play: 'baseball-ball',
            bath: 'bath',
            nails: 'cut',
            parasites: 'spray-can',
            teeth: 'tooth',
            grooming: 'spa',
            training: 'graduation-cap'
        };
        
        return icons[type] || 'heart';
    }
    
    loadCareLog() {
        const pet = this.getCurrentPet();
        if (!pet) return [];
        
        const savedData = localStorage.getItem(`careLog_${pet.id}`);
        
        if (savedData) {
            this.careLog = JSON.parse(savedData);
        } else {
            // Начальные данные
            this.careLog = [
                {
                    id: 1,
                    date: new Date().toISOString().split('T')[0],
                    items: [
                        {
                            id: 101,
                            type: 'feeding',
                            title: 'Кормление',
                            time: '2 часа назад',
                            description: 'Сухой корм Premium 60г',
                            details: 'Кормление прошло нормально, аппетит хороший'
                        },
                        {
                            id: 102,
                            type: 'walk',
                            title: 'Прогулка',
                            time: '4 часа назад',
                            description: 'Утренняя прогулка в парке',
                            details: 'Активная прогулка продолжительностью 45 минут'
                        }
                    ]
                },
                {
                    id: 2,
                    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
                    items: [
                        {
                            id: 201,
                            type: 'medication',
                            title: 'Витамины',
                            time: '24 октября, 09:00',
                            description: 'Комплекс витаминов для шерсти',
                            details: 'Принял витамины без проблем'
                        },
                        {
                            id: 202,
                            type: 'play',
                            title: 'Активные игры',
                            time: '24 октября, 18:00',
                            description: 'Игра с мячом в саду',
                            details: 'Играл активно, хорошо отреагировал на команды'
                        }
                    ]
                }
            ];
            this.saveCareLog();
        }
        
        return this.careLog;
    }
    
    saveCareLog() {
        const pet = this.getCurrentPet();
        if (pet) {
            localStorage.setItem(`careLog_${pet.id}`, JSON.stringify(this.careLog));
        }
    }
    
    saveCareStats() {
        const pet = this.getCurrentPet();
        if (pet) {
            localStorage.setItem(`careStats_${pet.id}`, JSON.stringify(this.careStats));
        }
    }
    
    setupEventListeners() {
        // Добавление процедуры
        const addCareBtn = document.getElementById('add-care-btn');
        if (addCareBtn) {
            addCareBtn.addEventListener('click', () => {
                this.showAddCareModal();
            });
        }
        
        // Редактирование процедур ухода
        document.querySelectorAll('.care-item-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = parseInt(e.target.dataset.itemId);
                this.showEditCareItemModal(itemId);
            });
        });
        
        // Редактирование статистики ухода
        document.querySelectorAll('.stat-edit-btn[data-care]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const careType = e.target.closest('.stat-edit-btn').dataset.care;
                this.showEditCareStatModal(careType);
            });
        });
    }
    
    showEditCareStatModal(careType) {
        let title = '';
        let fieldLabel = '';
        let currentValue = this.careStats[this.getCareStatKey(careType)];
        
        switch(careType) {
            case 'bath':
                title = 'Последнее купание';
                fieldLabel = 'Когда было последнее купание?';
                break;
            case 'nails':
                title = 'Стрижка когтей';
                fieldLabel = 'Когда была последняя стрижка когтей?';
                break;
            case 'parasites':
                title = 'Обработка от паразитов';
                fieldLabel = 'Когда была последняя обработка?';
                break;
            case 'teeth':
                title = 'Чистка зубов';
                fieldLabel = 'Когда была последняя чистка зубов?';
                break;
        }
        
        this.modalManager.showModal({
            title: title,
            content: `
                <form id="care-stat-form">
                    <div class="form-group">
                        <label for="care-value">${fieldLabel}</label>
                        <input type="text" id="care-value" value="${currentValue}" placeholder="например: 3 дня назад" required>
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
                        const newValue = document.getElementById('care-value').value;
                        const statKey = this.getCareStatKey(careType);
                        this.careStats[statKey] = newValue;
                        
                        // Обновляем отображение
                        const valueElement = document.getElementById(`${statKey}-value`);
                        if (valueElement) {
                            valueElement.textContent = newValue;
                        }
                        
                        this.saveCareStats();
                        this.app.showNotification('Данные обновлены', 'success');
                    }
                }
            ]
        });
    }
    
    getCareStatKey(careType) {
        const keys = {
            bath: 'lastBath',
            nails: 'lastNailTrim',
            parasites: 'lastParasiteTreatment',
            teeth: 'lastTeethCleaning'
        };
        return keys[careType] || careType;
    }
    
    showAddCareModal() {
        this.modalManager.showModal({
            title: 'Добавить процедуру ухода',
            content: `
                <form id="care-form">
                    <div class="form-group">
                        <label for="care-type">Тип процедуры</label>
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
                        <label for="care-details">Детали</label>
                        <textarea id="care-details" rows="2"></textarea>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="care-date">Дата</label>
                            <input type="date" id="care-date" value="${new Date().toISOString().split('T')[0]}" required>
                        </div>
                        <div class="form-group">
                            <label for="care-time">Время</label>
                            <input type="time" id="care-time" required>
                        </div>
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
                        const careType = document.getElementById('care-type').value;
                        const careDate = document.getElementById('care-date').value;
                        
                        // Находим или создаем запись для этой даты
                        let entry = this.careLog.find(e => e.date === careDate);
                        if (!entry) {
                            entry = {
                                id: Date.now(),
                                date: careDate,
                                items: []
                            };
                            this.careLog.unshift(entry); // Добавляем в начало
                        }
                        
                        // Добавляем новую процедуру
                        entry.items.push({
                            id: Date.now(),
                            type: careType,
                            title: document.getElementById('care-title').value,
                            time: document.getElementById('care-time').value,
                            description: document.getElementById('care-description').value,
                            details: document.getElementById('care-details').value
                        });
                        
                        // Сортируем журнал по дате (новые сверху)
                        this.careLog.sort((a, b) => new Date(b.date) - new Date(a.date));
                        
                        this.saveCareLog();
                        this.app.showNotification('Процедура добавлена', 'success');
                        this.render();
                    }
                }
            ]
        });
    }
    
    showEditCareItemModal(itemId) {
        let item = null;
        let entryDate = '';
        
        // Находим элемент в журнале
        for (const entry of this.careLog) {
            const foundItem = entry.items.find(i => i.id === itemId);
            if (foundItem) {
                item = foundItem;
                entryDate = entry.date;
                break;
            }
        }
        
        if (!item) return;
        
        this.modalManager.showModal({
            title: 'Редактировать процедуру',
            content: `
                <form id="care-edit-form">
                    <div class="form-group">
                        <label for="care-title">Название</label>
                        <input type="text" id="care-title" value="${item.title}" required>
                    </div>
                    <div class="form-group">
                        <label for="care-description">Описание</label>
                        <textarea id="care-description" rows="3" required>${item.description}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="care-details">Детали</label>
                        <textarea id="care-details" rows="2">${item.details || ''}</textarea>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="care-date">Дата</label>
                            <input type="date" id="care-date" value="${entryDate}" required>
                        </div>
                        <div class="form-group">
                            <label for="care-time">Время</label>
                            <input type="time" id="care-time" value="${item.time.includes(':') ? item.time : '12:00'}" required>
                        </div>
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
                        if (confirm('Вы уверены, что хотите удалить эту запись?')) {
                            // Удаляем элемент из журнала
                            for (const entry of this.careLog) {
                                const itemIndex = entry.items.findIndex(i => i.id === itemId);
                                if (itemIndex > -1) {
                                    entry.items.splice(itemIndex, 1);
                                    
                                    // Если запись пуста, удаляем ее
                                    if (entry.items.length === 0) {
                                        const entryIndex = this.careLog.findIndex(e => e.id === entry.id);
                                        if (entryIndex > -1) {
                                            this.careLog.splice(entryIndex, 1);
                                        }
                                    }
                                    
                                    break;
                                }
                            }
                            
                            this.saveCareLog();
                            this.app.showNotification('Запись удалена', 'warning');
                            this.render();
                        }
                    }
                },
                { 
                    text: 'Сохранить', 
                    type: 'primary', 
                    action: () => {
                        // Находим и обновляем элемент
                        for (const entry of this.careLog) {
                            const itemIndex = entry.items.findIndex(i => i.id === itemId);
                            if (itemIndex > -1) {
                                const newDate = document.getElementById('care-date').value;
                                
                                // Если дата изменилась, перемещаем элемент в другую запись
                                if (entry.date !== newDate) {
                                    // Удаляем из старой записи
                                    const [movedItem] = entry.items.splice(itemIndex, 1);
                                    
                                    // Обновляем данные элемента
                                    movedItem.title = document.getElementById('care-title').value;
                                    movedItem.description = document.getElementById('care-description').value;
                                    movedItem.details = document.getElementById('care-details').value;
                                    movedItem.time = document.getElementById('care-time').value;
                                    
                                    // Находим или создаем новую запись
                                    let newEntry = this.careLog.find(e => e.date === newDate);
                                    if (!newEntry) {
                                        newEntry = {
                                            id: Date.now(),
                                            date: newDate,
                                            items: []
                                        };
                                        this.careLog.push(newEntry);
                                    }
                                    
                                    newEntry.items.push(movedItem);
                                } else {
                                    // Обновляем элемент на месте
                                    entry.items[itemIndex].title = document.getElementById('care-title').value;
                                    entry.items[itemIndex].description = document.getElementById('care-description').value;
                                    entry.items[itemIndex].details = document.getElementById('care-details').value;
                                    entry.items[itemIndex].time = document.getElementById('care-time').value;
                                }
                                
                                break;
                            }
                        }
                        
                        // Сортируем журнал по дате
                        this.careLog.sort((a, b) => new Date(b.date) - new Date(a.date));
                        
                        this.saveCareLog();
                        this.app.showNotification('Запись обновлена', 'success');
                        this.render();
                    }
                }
            ]
        });
    }
}