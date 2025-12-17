class RemindersPresenter extends Presenter {
    getContent() {
        const pet = this.getCurrentPet();
        const reminders = this.dataManager.getReminders(pet.id);
        
        return `
            <section class="full-width-section">
                <div class="section-header">
                    <h2>Напоминания для ${pet.name}</h2>
                    <p>Предстоящие события и важные даты</p>
                    <button class="add-event-btn" id="add-reminder-btn">
                        <i class="fas fa-plus"></i> Добавить напоминание
                    </button>
                </div>
                <div class="reminders-section">
                    <div class="reminders-grid">
                        ${reminders.map(reminder => `
                            <div class="reminder-card">
                                <div class="reminder-icon"><i class="fas fa-bell"></i></div>
                                <div class="reminder-content">
                                    <h4>${reminder.title}</h4>
                                    <p>${reminder.description}</p>
                                    <div class="reminder-meta">
                                        <span class="date">${this.formatDate(reminder.date)}</span>
                                        <span class="days-left">Осталось ${reminder.daysLeft || this.calculateDaysLeft(reminder.date)} дней</span>
                                    </div>
                                </div>
                                <button class="btn-edit" data-reminder-id="${reminder.id}">Редактировать</button>
                            </div>
                        `).join('')}
                        
                        <div class="reminder-card">
                            <div class="reminder-icon"><i class="fas fa-shopping-cart"></i></div>
                            <div class="reminder-content">
                                <h4>Покупка корма</h4>
                                <p>Запас корма заканчивается через 7 дней</p>
                                <div class="reminder-meta">
                                    <span class="date">1 ноября 2025</span>
                                    <span class="days-left">Осталось 7 дней</span>
                                </div>
                            </div>
                            <button class="btn-edit">Редактировать</button>
                        </div>
                        
                        <div class="reminder-card">
                            <div class="reminder-icon"><i class="fas fa-cut"></i></div>
                            <div class="reminder-content">
                                <h4>Стрижка</h4>
                                <p>Плановый уход за шерстью</p>
                                <div class="reminder-meta">
                                    <span class="date">15 ноября 2025</span>
                                    <span class="days-left">Осталось 21 день</span>
                                </div>
                            </div>
                            <button class="btn-edit">Редактировать</button>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
    
    setupEventListeners() {
        document.getElementById('add-reminder-btn')?.addEventListener('click', () => {
            this.showAddReminderModal();
        });
        
        document.querySelectorAll('.btn-edit[data-reminder-id]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const reminderId = parseInt(e.target.dataset.reminderId);
                this.showEditReminderModal(reminderId);
            });
        });
        
        document.querySelectorAll('.btn-edit:not([data-reminder-id])').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const reminderCard = e.target.closest('.reminder-card');
                const title = reminderCard.querySelector('h4').textContent;
                this.showEditReminderModal(null, title);
            });
        });
    }
    
    showAddReminderModal() {
        const pet = this.getCurrentPet();
        
        this.modalManager.showModal({
            title: 'Добавить напоминание',
            content: `
                <form id="reminder-form">
                    <div class="form-group">
                        <label for="reminder-title">Название</label>
                        <input type="text" id="reminder-title" required>
                    </div>
                    <div class="form-group">
                        <label for="reminder-description">Описание</label>
                        <textarea id="reminder-description" rows="3"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="reminder-date">Дата</label>
                        <input type="date" id="reminder-date" required>
                    </div>
                    <div class="form-group">
                        <label for="reminder-type">Тип напоминания</label>
                        <select id="reminder-type">
                            <option value="medical">Медицинское</option>
                            <option value="food">Питание</option>
                            <option value="care">Уход</option>
                            <option value="other">Другое</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="reminder-repeat">Повтор</label>
                        <select id="reminder-repeat">
                            <option value="none">Не повторять</option>
                            <option value="daily">Ежедневно</option>
                            <option value="weekly">Еженедельно</option>
                            <option value="monthly">Ежемесячно</option>
                            <option value="yearly">Ежегодно</option>
                        </select>
                    </div>
                </form>
            `,
            buttons: [
                { text: 'Отменить', type: 'secondary', action: 'close' },
                { text: 'Добавить', type: 'primary', action: () => {
                    const reminderData = {
                        petId: pet.id,
                        title: document.getElementById('reminder-title').value,
                        description: document.getElementById('reminder-description').value,
                        date: document.getElementById('reminder-date').value,
                        daysLeft: this.calculateDaysLeft(document.getElementById('reminder-date').value)
                    };
                    
                    this.dataManager.addReminder(reminderData);
                    this.app.saveData();
                    this.app.showNotification('Напоминание добавлено', 'success');
                    this.render();
                }}
            ]
        });
    }
    
    showEditReminderModal(reminderId, title = '') {
        if (reminderId) {
            const pet = this.getCurrentPet();
            const reminders = this.dataManager.getReminders(pet.id);
            const reminder = reminders.find(r => r.id === reminderId);
            
            if (!reminder) return;
            
            title = reminder.title;
        }
        
        this.modalManager.showModal({
            title: 'Редактировать напоминание',
            content: `
                <form id="reminder-form">
                    <div class="form-group">
                        <label for="reminder-title">Название</label>
                        <input type="text" id="reminder-title" value="${title}" required>
                    </div>
                    <div class="form-group">
                        <label for="reminder-date">Дата</label>
                        <input type="date" id="reminder-date" required>
                    </div>
                </form>
            `,
            buttons: [
                { text: 'Отменить', type: 'secondary', action: 'close' },
                { text: 'Удалить', type: 'secondary', action: () => {
                    if (confirm('Удалить это напоминание?')) {
                        if (reminderId) {
                            this.dataManager.deleteReminder(reminderId);
                            this.app.saveData();
                        }
                        this.app.showNotification('Напоминание удалено', 'warning');
                        this.render();
                    }
                }},
                { text: 'Сохранить', type: 'primary', action: () => {
                    if (reminderId) {
                        const reminderData = {
                            title: document.getElementById('reminder-title').value,
                            date: document.getElementById('reminder-date').value,
                            daysLeft: this.calculateDaysLeft(document.getElementById('reminder-date').value)
                        };
                        
                        this.dataManager.updateReminder(reminderId, reminderData);
                        this.app.saveData();
                    }
                    this.app.showNotification('Напоминание обновлено', 'success');
                    this.render();
                }}
            ]
        });
    }
}