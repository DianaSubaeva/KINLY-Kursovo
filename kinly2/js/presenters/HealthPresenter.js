// presenters/HealthPresenter.js
class HealthPresenter extends Presenter {
    constructor(app) {
        super(app);
        this.chartPeriod = 'month';
        this.chart = null;
        this.metrics = { appetite: 92, activity: 88, sleep: 95, mood: 90 };
    }
    
    getContent() {
        const pet = this.getCurrentPet();
        if (!pet) return '';
        
        if (pet.healthMetrics) this.metrics = pet.healthMetrics;
        const weightData = pet.weightHistory || this.generateWeightData(pet.weight || 4.8);
        
        return `
            <section class="full-width-section">
                <div class="section-header">
                    <h2>Состояние здоровья</h2>
                    <p>Мониторинг здоровья ${pet.name}</p>
                </div>
                <div class="quick-stats">
                    ${this.renderStatCard('heartbeat', pet.healthStatus || 'Отличное', 'Общее состояние', 'healthStatus')}
                    ${this.renderStatCard('thermometer-half', '38.5°C', 'Температура', 'temperature')}
                    ${this.renderStatCard('tint', '60 уд/мин', 'Пульс', 'pulse')}
                    ${this.renderStatCard('lungs', '20 дых/мин', 'Дыхание', 'breathing')}
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
                                ${['month', 'quarter', 'year'].map(p => `
                                    <span class="control-btn ${this.chartPeriod === p ? 'active' : ''}" data-period="${p}">
                                        ${p === 'month' ? 'Месяц' : p === 'quarter' ? '3 месяца' : 'Год'}
                                    </span>
                                `).join('')}
                            </div>
                        </div>
                        <div class="chart-container">
                            <canvas id="weight-chart"></canvas>
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
                            ${Object.entries(this.metrics).map(([key, value]) => `
                                <div class="metric-item">
                                    <span class="metric-label">${this.getMetricLabel(key)}</span>
                                    <div class="metric-bar">
                                        <div class="metric-fill" style="width: ${value}%"></div>
                                    </div>
                                    <span class="metric-value">${value}%</span>
                                </div>
                            `).join('')}
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
                <div class="events-grid" id="medical-history-grid"></div>
            </section>
        `;
    }
    
    renderStatCard(icon, value, label, stat) {
        return `
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-${icon}"></i></div>
                <div class="stat-info">
                    <span class="value">${value}</span>
                    <span class="label">${label}</span>
                </div>
                <button class="stat-edit-btn" data-stat="${stat}">
                    <i class="fas fa-edit"></i>
                </button>
            </div>
        `;
    }
    
    getMetricLabel(key) {
        const labels = {
            appetite: 'Аппетит',
            activity: 'Активность',
            sleep: 'Сон',
            mood: 'Настроение'
        };
        return labels[key] || key;
    }
    
    generateWeightData(baseWeight = 4.8) {
        const data = [];
        const now = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            data.push({
                date: date.toISOString().split('T')[0],
                weight: parseFloat((baseWeight + Math.random() * 0.4 - 0.2).toFixed(1))
            });
        }
        return data;
    }
    
    renderChart() {
        if (this.chart) this.chart.destroy();
        
        const pet = this.getCurrentPet();
        if (!pet) return;
        
        const ctx = document.getElementById('weight-chart').getContext('2d');
        const data = pet.weightHistory || this.generateWeightData(pet.weight || 4.8);
        
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(d => new Date(d.date).toLocaleDateString('ru-RU', { month: 'short' })),
                datasets: [{
                    label: 'Вес (кг)',
                    data: data.map(d => d.weight),
                    borderColor: '#4f46e5',
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: ctx => `Вес: ${ctx.raw} кг`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: value => `${value} кг`
                        }
                    }
                }
            }
        });
    }
    
    loadMedicalHistory() {
        const history = [
            {
                id: 1,
                title: 'Комплексная вакцинация',
                description: 'Ежегодная прививка от основных заболеваний',
                date: '2025-11-22',
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
            grid.innerHTML = history.map(event => `
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
        }
    }
    
    setupEventListeners() {
        super.setupEventListeners();
        
        // Делегирование событий для элементов
        document.addEventListener('click', (e) => {
            const target = e.target;
            
            // Переключение периода графика
            if (target.classList.contains('control-btn')) {
                this.chartPeriod = target.dataset.period;
                this.render();
            }
            
            // Кнопки редактирования
            if (target.closest('.stat-edit-btn')) {
                const stat = target.closest('.stat-edit-btn').dataset.stat;
                this.showEditStatModal(stat);
            }
            
            if (target.id === 'add-weight-btn') {
                this.showAddWeightModal();
            }
            
            if (target.id === 'edit-health-metrics-btn') {
                this.showEditMetricsModal();
            }
            
            if (target.id === 'add-medical-event') {
                this.showAddMedicalModal();
            }
            
            if (target.classList.contains('event-edit-btn')) {
                this.showEditMedicalModal(target.dataset.eventId);
            }
        });
        
        this.loadMedicalHistory();
        this.renderChart();
    }
    
    showEditStatModal(stat) {
        const pet = this.getCurrentPet();
        const config = {
            healthStatus: {
                title: 'Состояние здоровья',
                type: 'select',
                options: ['Отличное', 'Хорошее', 'Удовлетворительное', 'Требует внимания'],
                value: pet.healthStatus || 'Отличное'
            },
            temperature: {
                title: 'Температура',
                type: 'number',
                value: '38.5',
                min: 35, max: 42, step: 0.1
            },
            pulse: {
                title: 'Пульс',
                type: 'number',
                value: '60',
                min: 40, max: 200
            },
            breathing: {
                title: 'Дыхание',
                type: 'number',
                value: '20',
                min: 10, max: 60
            }
        };
        
        const conf = config[stat];
        if (!conf) return;
        
        let inputHTML = '';
        if (conf.type === 'select') {
            inputHTML = `
                <select id="stat-value">
                    ${conf.options.map(opt => `
                        <option value="${opt}" ${conf.value === opt ? 'selected' : ''}>${opt}</option>
                    `).join('')}
                </select>
            `;
        } else {
            inputHTML = `
                <input type="${conf.type}" id="stat-value" value="${conf.value}" 
                       ${conf.min ? `min="${conf.min}"` : ''} 
                       ${conf.max ? `max="${conf.max}"` : ''} 
                       ${conf.step ? `step="${conf.step}"` : ''} required>
            `;
        }
        
        this.modalManager.showModal({
            title: conf.title,
            content: `<form><div class="form-group">${inputHTML}</div></form>`,
            buttons: [
                { text: 'Отменить', type: 'secondary', action: 'close' },
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
                        <input type="number" id="weight-value" value="${pet.weight || 4.8}" step="0.1" required>
                    </div>
                    <div class="form-group">
                        <label for="weight-notes">Примечания</label>
                        <textarea id="weight-notes" rows="2"></textarea>
                    </div>
                </form>
            `,
            buttons: [
                { text: 'Отменить', type: 'secondary', action: 'close' },
                { 
                    text: 'Добавить', 
                    type: 'primary', 
                    action: () => {
                        const weightHistory = pet.weightHistory || this.generateWeightData(pet.weight || 4.8);
                        weightHistory.push({
                            date: document.getElementById('weight-date').value,
                            weight: parseFloat(document.getElementById('weight-value').value),
                            notes: document.getElementById('weight-notes').value
                        });
                        
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
    
    showEditMetricsModal() {
        const inputs = Object.entries(this.metrics).map(([key, value]) => `
            <div class="form-group">
                <label for="${key}-value">${this.getMetricLabel(key)} (%)</label>
                <input type="range" id="${key}-value" min="0" max="100" value="${value}" 
                       class="metric-slider" oninput="document.getElementById('${key}-display').innerText = this.value + '%'">
                <span id="${key}-display">${value}%</span>
            </div>
        `).join('');
        
        this.modalManager.showModal({
            title: 'Редактировать показатели',
            content: `<form id="metrics-form">${inputs}</form>`,
            buttons: [
                { text: 'Отменить', type: 'secondary', action: 'close' },
                { 
                    text: 'Сохранить', 
                    type: 'primary', 
                    action: () => {
                        Object.keys(this.metrics).forEach(key => {
                            this.metrics[key] = parseInt(document.getElementById(`${key}-value`).value);
                        });
                        
                        const pet = this.getCurrentPet();
                        localStorage.setItem(`healthMetrics_${pet.id}`, JSON.stringify(this.metrics));
                        this.app.showNotification('Показатели обновлены', 'success');
                        this.render();
                    }
                }
            ]
        });
    }
    
    showEditMedicalModal(id) {
        const events = {
            '1': { title: 'Комплексная вакцинация', description: 'Ежегодная прививка', date: '2025-11-22' },
            '2': { title: 'Профилактический осмотр', description: 'Плановый осмотр', date: '2025-09-15' }
        };
        
        const event = events[id] || {};
        
        this.modalManager.showModal({
            title: 'Редактировать запись',
            content: `
                <form>
                    <div class="form-group">
                        <label for="medical-title">Название</label>
                        <input type="text" id="medical-title" value="${event.title || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="medical-description">Описание</label>
                        <textarea id="medical-description" rows="3">${event.description || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="medical-date">Дата</label>
                        <input type="date" id="medical-date" value="${event.date || ''}" required>
                    </div>
                </form>
            `,
            buttons: [
                { text: 'Отменить', type: 'secondary', action: 'close' },
                { 
                    text: 'Удалить', 
                    type: 'secondary', 
                    action: () => {
                        if (confirm('Удалить запись?')) {
                            this.app.showNotification('Запись удалена', 'warning');
                        }
                    }
                },
                { 
                    text: 'Сохранить', 
                    type: 'primary', 
                    action: () => {
                        this.app.showNotification('Запись сохранена', 'success');
                    }
                }
            ]
        });
    }
    
    showAddMedicalModal() {
        this.modalManager.showModal({
            title: 'Добавить запись',
            content: `
                <form>
                    <div class="form-group">
                        <label for="medical-type">Тип записи</label>
                        <select id="medical-type">
                            <option value="vaccination">Вакцинация</option>
                            <option value="checkup">Осмотр</option>
                            <option value="treatment">Лечение</option>
                            <option value="surgery">Операция</option>
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
                </form>
            `,
            buttons: [
                { text: 'Отменить', type: 'secondary', action: 'close' },
                { 
                    text: 'Добавить', 
                    type: 'primary', 
                    action: () => {
                        this.app.showNotification('Запись добавлена', 'success');
                    }
                }
            ]
        });
    }
}