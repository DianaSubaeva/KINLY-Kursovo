class HealthPresenter extends Presenter {
    constructor(app) {
        super(app);
        this.chartPeriod = 'month'; // month, quarter, year
        this.healthMetrics = {
            appetite: 92,
            activity: 88,
            sleep: 95,
            mood: 90
        };
    }
    
    getContent() {
        const pet = this.getCurrentPet();
        if (!pet) return '';
        
        // Загружаем healthMetrics из питомца, если есть
        if (pet.healthMetrics) {
            this.healthMetrics = pet.healthMetrics;
        }
        
        const weightHistory = pet.weightHistory || this.generateWeightHistory(pet.weight || 4.8);
        
        return `
            <section class="full-width-section">
                <div class="section-header">
                    <h2>Состояние здоровья</h2>
                    <p>Мониторинг здоровья ${pet.name}</p>
                </div>
                <div class="quick-stats">
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-heartbeat"></i></div>
                        <div class="stat-info">
                            <span class="value">${pet.healthStatus || 'Отличное'}</span>
                            <span class="label">Общее состояние</span>
                        </div>
                        <button class="stat-edit-btn" data-stat="healthStatus">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-thermometer-half"></i></div>
                        <div class="stat-info">
                            <span class="value">38.5°C</span>
                            <span class="label">Температура</span>
                        </div>
                        <button class="stat-edit-btn" data-stat="temperature">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-tint"></i></div>
                        <div class="stat-info">
                            <span class="value">60 уд/мин</span>
                            <span class="label">Пульс</span>
                        </div>
                        <button class="stat-edit-btn" data-stat="pulse">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-lungs"></i></div>
                        <div class="stat-info">
                            <span class="value">20 дых/мин</span>
                            <span class="label">Дыхание</span>
                        </div>
                        <button class="stat-edit-btn" data-stat="breathing">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </div>
            </section>

            <section class="full-width-section">
                <div class="section-header">
                    <h2>Динамика показателей</h2>
                    <p>Отслеживание веса и активности</p>
                </div>
                <div class="charts-grid">
                    <div class="chart-card">
                        <div class="chart-header">
                            <h3>Вес по месяцам</h3>
                            <div class="chart-controls">
                                <span class="control-btn ${this.chartPeriod === 'month' ? 'active' : ''}" data-period="month">Месяц</span>
                                <span class="control-btn ${this.chartPeriod === 'quarter' ? 'active' : ''}" data-period="quarter">3 месяца</span>
                                <span class="control-btn ${this.chartPeriod === 'year' ? 'active' : ''}" data-period="year">Год</span>
                            </div>
                        </div>
                        <div class="chart-container">
                            <div class="weight-chart" id="weight-chart">
                                ${this.renderWeightChart(weightHistory)}
                            </div>
                            <div class="chart-labels" id="chart-labels">
                                ${this.renderChartLabels()}
                            </div>
                        </div>
                        <div class="form-actions" style="margin-top: 20px;">
                            <button class="btn btn-primary" id="add-weight-btn">
                                <i class="fas fa-plus"></i> Добавить запись веса
                            </button>
                        </div>
                    </div>
                    
                    <div class="chart-card">
                        <div class="chart-header">
                            <h3>Показатели здоровья</h3>
                            <button class="btn-edit" id="edit-health-metrics-btn">
                                <i class="fas fa-edit"></i> Редактировать
                            </button>
                        </div>
                        <div class="health-metrics">
                            <div class="metric-item">
                                <span class="metric-label">Аппетит</span>
                                <div class="metric-bar">
                                    <div class="metric-fill" id="appetite-bar" style="width: ${this.healthMetrics.appetite}%"></div>
                                </div>
                                <span class="metric-value" id="appetite-value">${this.healthMetrics.appetite}%</span>
                            </div>
                            <div class="metric-item">
                                <span class="metric-label">Активность</span>
                                <div class="metric-bar">
                                    <div class="metric-fill" id="activity-bar" style="width: ${this.healthMetrics.activity}%"></div>
                                </div>
                                <span class="metric-value" id="activity-value">${this.healthMetrics.activity}%</span>
                            </div>
                            <div class="metric-item">
                                <span class="metric-label">Сон</span>
                                <div class="metric-bar">
                                    <div class="metric-fill" id="sleep-bar" style="width: ${this.healthMetrics.sleep}%"></div>
                                </div>
                                <span class="metric-value" id="sleep-value">${this.healthMetrics.sleep}%</span>
                            </div>
                            <div class="metric-item">
                                <span class="metric-label">Настроение</span>
                                <div class="metric-bar">
                                    <div class="metric-fill" id="mood-bar" style="width: ${this.healthMetrics.mood}%"></div>
                                </div>
                                <span class="metric-value" id="mood-value">${this.healthMetrics.mood}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="full-width-section">
                <div class="section-header">
                    <h2>Медицинская история</h2>
                    <p>Прививки и посещения ветеринара</p>
                    <button class="add-event-btn" id="add-medical-event">
                        <i class="fas fa-plus"></i> Добавить запись
                    </button>
                </div>
                <div class="events-grid" id="medical-history-grid">
                    <!-- Медицинские записи будут загружены динамически -->
                </div>
            </section>
        `;
    }
    
    // ===== НОВЫЕ МЕТОДЫ ДЛЯ ГРАФИКА =====
    
    renderWeightChart(weightHistory) {
        if (!weightHistory || weightHistory.length === 0) {
            return '<div class="no-data">Нет данных о весе</div>';
        }
        
        // Определяем диапазон дат для графика
        const dates = weightHistory.map(item => new Date(item.date));
        const minDate = new Date(Math.min(...dates));
        const maxDate = new Date(Math.max(...dates));
        
        // Определяем диапазон веса
        const weights = weightHistory.map(item => item.weight);
        const minWeight = Math.min(...weights);
        const maxWeight = Math.max(...weights);
        const weightRange = maxWeight - minWeight;
        
        // Сортируем по дате
        const sortedHistory = [...weightHistory].sort((a, b) => 
            new Date(a.date) - new Date(b.date)
        );
        
        // Создаем точки графика
        let pointsHTML = '';
        sortedHistory.forEach((item, index) => {
            // Рассчитываем позицию по X (время)
            const date = new Date(item.date);
            const timeDiff = maxDate - minDate;
            const daysDiff = date - minDate;
            const xPercent = timeDiff > 0 ? (daysDiff / timeDiff) * 100 : 50;
            
            // Рассчитываем позицию по Y (вес)
            const yPercent = weightRange > 0 ? 
                ((item.weight - minWeight) / weightRange) * 100 : 
                50;
            
            // Инвертируем Y, так как в CSS bottom 0% - это низ
            const yPosition = 100 - yPercent;
            
            pointsHTML += `
                <div class="chart-point" 
                     style="left: ${xPercent}%; bottom: ${yPosition}%;"
                     data-weight="${item.weight}"
                     data-date="${item.date}">
                </div>
            `;
        });
        
        // Создаем линию графика
        const lineHTML = '<div class="chart-line"></div>';
        
        return pointsHTML + lineHTML;
    }
    
    renderChartLabels() {
        // Метки для графика (последние 7 месяцев)
        const months = [];
        const now = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthNames = [
                'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
                'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'
            ];
            months.push(monthNames[date.getMonth()]);
        }
        
        return months.map(month => `<span>${month}</span>`).join('');
    }
    
    generateWeightHistory(baseWeight = 4.8) {
        // Генерируем историю веса за последние 6 месяцев
        const history = [];
        const now = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            // Небольшие колебания веса (±0.2 кг)
            const weight = baseWeight + (Math.random() * 0.4 - 0.2);
            
            history.push({
                date: date.toISOString().split('T')[0],
                weight: parseFloat(weight.toFixed(1))
            });
        }
        
        return history;
    }
    
    loadMedicalHistory() {
        // Загрузка медицинской истории
        const pet = this.getCurrentPet();
        const medicalHistory = [
            {
                id: 1,
                title: 'Комплексная вакцинация',
                description: 'Ежегодная прививка от основных заболеваний',
                date: '2025-11-22',
                daysLeft: 28,
                type: 'vaccination'
            },
            {
                id: 2,
                title: 'Профилактический осмотр',
                description: 'Плановый осмотр у ветеринара',
                date: '2025-09-15',
                type: 'checkup'
            }
        ];
        
        const grid = document.getElementById('medical-history-grid');
        if (grid) {
            grid.innerHTML = medicalHistory.map(event => `
                <div class="event-card">
                    <div class="event-icon"><i class="fas fa-hospital"></i></div>
                    <div class="event-content">
                        <h4>${event.title}</h4>
                        <p>${event.description}</p>
                        <span class="event-date">${this.formatDate(event.date)}</span>
                    </div>
                    <button class="event-edit-btn" data-event-id="${event.id}">Редактировать</button>
                </div>
            `).join('');
            
            // Добавляем обработчики для кнопок редактирования
            document.querySelectorAll('#medical-history-grid .event-edit-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const eventId = e.target.dataset.eventId;
                    this.showEditMedicalModal(eventId);
                });
            });
        }
    }
    
    setupEventListeners() {
        super.setupEventListeners();
        
        // Переключение периода графика
        document.querySelectorAll('.control-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.chartPeriod = e.target.dataset.period;
                this.render();
            });
        });
        
        // Добавление записи веса
        const addWeightBtn = document.getElementById('add-weight-btn');
        if (addWeightBtn) {
            addWeightBtn.addEventListener('click', () => {
                this.showAddWeightModal();
            });
        }
        
        // Редактирование показателей здоровья
        const editHealthMetricsBtn = document.getElementById('edit-health-metrics-btn');
        if (editHealthMetricsBtn) {
            editHealthMetricsBtn.addEventListener('click', () => {
                this.showEditHealthMetricsModal();
            });
        }
        
        // Добавление медицинской записи
        const addMedicalEventBtn = document.getElementById('add-medical-event');
        if (addMedicalEventBtn) {
            addMedicalEventBtn.addEventListener('click', () => {
                this.showAddMedicalEventModal();
            });
        }
        
        // Редактирование статистики
        document.querySelectorAll('.stat-edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const stat = e.target.closest('.stat-edit-btn').dataset.stat;
                this.showEditHealthStatModal(stat);
            });
        });
        
        // Загружаем медицинскую историю
        this.loadMedicalHistory();

        
        // Показ значений веса при наведении на точки графика
        document.querySelectorAll('.chart-point').forEach(point => {
            point.addEventListener('mouseenter', (e) => {
                const weight = e.target.dataset.weight;
                const date = e.target.dataset.date;
                this.showChartTooltip(e.target, weight, date);
            });
            
            point.addEventListener('mouseleave', () => {
                this.hideChartTooltip();
            });
        });
    }
    
    showEditHealthStatModal(stat) {
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
                
            case 'temperature':
                title = 'Температура';
                content = `
                    <form id="edit-stat-form">
                        <div class="form-group">
                            <label for="stat-value">Температура (°C)</label>
                            <input type="number" id="stat-value" value="38.5" step="0.1" min="35" max="42" required>
                        </div>
                    </form>
                `;
                break;
                
            case 'pulse':
                title = 'Пульс';
                content = `
                    <form id="edit-stat-form">
                        <div class="form-group">
                            <label for="stat-value">Пульс (уд/мин)</label>
                            <input type="number" id="stat-value" value="60" min="40" max="200" required>
                        </div>
                    </form>
                `;
                break;
                
            case 'breathing':
                title = 'Дыхание';
                content = `
                    <form id="edit-stat-form">
                        <div class="form-group">
                            <label for="stat-value">Дыхание (дых/мин)</label>
                            <input type="number" id="stat-value" value="20" min="10" max="60" required>
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
                        this.app.showNotification('Данные обновлены', 'success');
                        this.render();
                    }
                }
            ]
        });
    }
    
    showAddWeightModal() {
        const pet = this.getCurrentPet();
        
        this.modalManager.showModal({
            title: 'Добавить запись веса',
            content: `
                <form id="weight-form">
                    <div class="form-group">
                        <label for="weight-date">Дата</label>
                        <input type="date" id="weight-date" value="${new Date().toISOString().split('T')[0]}" required>
                    </div>
                    <div class="form-group">
                        <label for="weight-value">Вес (кг)</label>
                        <input type="number" id="weight-value" value="${pet.weight || 4.8}" step="0.1" min="0" max="100" required>
                    </div>
                    <div class="form-group">
                        <label for="weight-notes">Примечания</label>
                        <textarea id="weight-notes" rows="2"></textarea>
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
                        const weightHistory = pet.weightHistory || [];
                        weightHistory.push({
                            date: document.getElementById('weight-date').value,
                            weight: parseFloat(document.getElementById('weight-value').value),
                            notes: document.getElementById('weight-notes').value
                        });
                        
                        // Обновляем текущий вес питомца
                        this.dataManager.updatePet(pet.id, {
                            weight: parseFloat(document.getElementById('weight-value').value),
                            weightHistory: weightHistory
                        });
                        
                        this.app.saveData();
                        this.app.showNotification('Запись веса добавлена', 'success');
                        this.render();
                    }
                }
            ]
        });
    }
    
    showEditHealthMetricsModal() {
        this.modalManager.showModal({
            title: 'Редактировать показатели здоровья',
            content: `
                <form id="health-metrics-form">
                    <div class="form-group">
                        <label for="appetite-value">Аппетит (%)</label>
                        <input type="range" id="appetite-value" min="0" max="100" value="${this.healthMetrics.appetite}" class="metric-slider">
                        <span id="appetite-display">${this.healthMetrics.appetite}%</span>
                    </div>
                    <div class="form-group">
                        <label for="activity-value">Активность (%)</label>
                        <input type="range" id="activity-value" min="0" max="100" value="${this.healthMetrics.activity}" class="metric-slider">
                        <span id="activity-display">${this.healthMetrics.activity}%</span>
                    </div>
                    <div class="form-group">
                        <label for="sleep-value">Сон (%)</label>
                        <input type="range" id="sleep-value" min="0" max="100" value="${this.healthMetrics.sleep}" class="metric-slider">
                        <span id="sleep-display">${this.healthMetrics.sleep}%</span>
                    </div>
                    <div class="form-group">
                        <label for="mood-value">Настроение (%)</label>
                        <input type="range" id="mood-value" min="0" max="100" value="${this.healthMetrics.mood}" class="metric-slider">
                        <span id="mood-display">${this.healthMetrics.mood}%</span>
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
                        this.healthMetrics = {
                            appetite: parseInt(document.getElementById('appetite-value').value),
                            activity: parseInt(document.getElementById('activity-value').value),
                            sleep: parseInt(document.getElementById('sleep-value').value),
                            mood: parseInt(document.getElementById('mood-value').value)
                        };
                        
                        // Сохраняем в localStorage
                        const pet = this.getCurrentPet();
                        localStorage.setItem(`healthMetrics_${pet.id}`, JSON.stringify(this.healthMetrics));
                        
                        this.app.showNotification('Показатели здоровья обновлены', 'success');
                        this.render();
                    }
                }
            ]
        });
    }
    
    showEditMedicalModal(medicalId) {
        let title = '';
        let description = '';
        let date = '';
        
        switch(medicalId) {
            case '1':
                title = 'Комплексная вакцинация';
                description = 'Ежегодная прививка от основных заболеваний';
                date = '2025-11-22';
                break;
            case '2':
                title = 'Профилактический осмотр';
                description = 'Плановый осмотр у ветеринара';
                date = '2025-09-15';
                break;
        }
        
        this.modalManager.showModal({
            title: 'Редактировать медицинскую запись',
            content: `
                <form id="medical-form">
                    <div class="form-group">
                        <label for="medical-title">Название</label>
                        <input type="text" id="medical-title" value="${title}" required>
                    </div>
                    <div class="form-group">
                        <label for="medical-description">Описание</label>
                        <textarea id="medical-description" rows="3">${description}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="medical-date">Дата</label>
                        <input type="date" id="medical-date" value="${date}" required>
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
                            this.app.showNotification('Медицинская запись удалена', 'warning');
                        }
                    }
                },
                { 
                    text: 'Сохранить', 
                    type: 'primary', 
                    action: () => {
                        this.app.showNotification('Медицинская запись обновлена', 'success');
                    }
                }
            ]
        });
    }
    
    showAddMedicalEventModal() {
        this.modalManager.showModal({
            title: 'Добавить медицинскую запись',
            content: `
                <form id="medical-event-form">
                    <div class="form-group">
                        <label for="medical-type">Тип записи</label>
                        <select id="medical-type">
                            <option value="vaccination">Вакцинация</option>
                            <option value="checkup">Осмотр</option>
                            <option value="treatment">Лечение</option>
                            <option value="surgery">Операция</option>
                            <option value="test">Анализ</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="medical-title">Название</label>
                        <input type="text" id="medical-title" required>
                    </div>
                    <div class="form-group">
                        <label for="medical-description">Описание</label>
                        <textarea id="medical-description" rows="3"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="medical-date">Дата</label>
                        <input type="date" id="medical-date" required>
                    </div>
                    <div class="form-group">
                        <label for="medical-doctor">Врач/Клиника</label>
                        <input type="text" id="medical-doctor">
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
                        this.app.showNotification('Медицинская запись добавлена', 'success');
                    }
                }
            ]
        });
    }
    
    showChartTooltip(element, weight, date) {
        // Удаляем существующий тултип
        this.hideChartTooltip();
        
        // Создаем тултип
        const tooltip = document.createElement('div');
        tooltip.className = 'chart-tooltip';
        tooltip.innerHTML = `
            <div class="tooltip-content">
                <strong>${weight} кг</strong>
                <span>${this.formatDate(date)}</span>
            </div>
        `;
        
        // Позиционируем тултип
        const rect = element.getBoundingClientRect();
        const chartRect = document.getElementById('weight-chart').getBoundingClientRect();
        
        tooltip.style.position = 'absolute';
        tooltip.style.top = (rect.top - chartRect.top - 40) + 'px';
        tooltip.style.left = (rect.left - chartRect.left - 25) + 'px';
        
        document.getElementById('weight-chart').appendChild(tooltip);
    }
    
    hideChartTooltip() {
        const tooltip = document.querySelector('.chart-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }
}