// modals/overview/EventModal.js
class EventModal {
    constructor(app, overviewPresenter) {
        this.app = app;
        this.overviewPresenter = overviewPresenter;
    }
    
    showAdd() {
        const modal = new BaseModal({
            title: 'Добавить событие',
            content: this.getAddForm(),
            buttons: [
                { 
                    text: 'Отменить', 
                    type: 'secondary', 
                    action: 'close' 
                },
                { 
                    text: 'Добавить', 
                    type: 'primary', 
                    action: () => this.handleAddSubmit()
                }
            ]
        });
        modal.show();
    }
    
    showEdit(eventId) {
        const pet = this.overviewPresenter.getCurrentPet();
        const events = this.overviewPresenter.dataManager.getEvents(pet.id);
        const event = events.find(e => e.id === eventId);
        
        if (!event) return;
        
        const modal = new BaseModal({
            title: 'Редактировать событие',
            content: this.getEditForm(event),
            buttons: [
                { 
                    text: 'Отменить', 
                    type: 'secondary', 
                    action: 'close' 
                },
                { 
                    text: 'Удалить', 
                    type: 'secondary', 
                    action: () => this.handleDelete(eventId)
                },
                { 
                    text: 'Сохранить', 
                    type: 'primary', 
                    action: () => this.handleEditSubmit(eventId)
                }
            ]
        });
        modal.show();
    }
    
    getAddForm() {
        return `
            <form id="event-form">
                <div class="form-group">
                    <label for="event-title">Название события</label>
                    <input type="text" id="event-title" required>
                </div>
                <div class="form-group">
                    <label for="event-description">Описание</label>
                    <textarea id="event-description" rows="3"></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="event-date">Дата</label>
                        <input type="date" id="event-date" value="${new Date().toISOString().split('T')[0]}" required>
                    </div>
                    <div class="form-group">
                        <label for="event-time">Время</label>
                        <input type="time" id="event-time" value="10:00" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="event-type">Тип события</label>
                    <select id="event-type">
                        <option value="medical">Медицинское</option>
                        <option value="medication">Лекарства</option>
                        <option value="grooming">Уход</option>
                        <option value="bath">Купание</option>
                        <option value="walk">Прогулка</option>
                        <option value="play">Игры</option>
                    </select>
                    </div>
            </form>
        `;
    }
    
    getEditForm(event) {
        return `
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
        `;
    }
    
    handleAddSubmit() {
    const presenter = this.overviewPresenter;
    const pet = presenter.getCurrentPet();
    
    if (!pet) {
        alert('Питомец не выбран');
        return false;
    }
    
    const eventData = {
        title: document.getElementById('event-title').value,
        description: document.getElementById('event-description').value,
        date: document.getElementById('event-date').value,
        time: document.getElementById('event-time').value,
        type: document.getElementById('event-type').value,
        petId: pet.id  // ← ДОБАВЬТЕ ЭТО!
    };
    
    console.log('Добавляем событие для питомца', pet.id, ':', eventData);
    
    if (presenter.dataManager && typeof presenter.dataManager.addEvent === 'function') {
        try {
            // Используем существующий метод addEvent
            const result = presenter.dataManager.addEvent(eventData);
            console.log('Результат добавления:', result);
            
            this.app.saveData();
            this.app.showNotification('Событие добавлено', 'success');
            
            // Принудительно обновляем рендер
            if (presenter && typeof presenter.render === 'function') {
                console.log('Обновляем презентер...');
                presenter.render();
            }
            
            return true;
        } catch (error) {
            console.error('Ошибка при добавлении события:', error);
            alert('Ошибка при добавлении события: ' + error.message);
            return false;
        }
    } else {
        console.error('Метод addEvent не найден или dataManager не доступен');
        alert('Ошибка: не удалось добавить событие');
        return false;
    }
}
    
    handleEditSubmit(eventId) {
        const eventData = {
            title: document.getElementById('event-title').value,
            description: document.getElementById('event-description').value,
            date: document.getElementById('event-date').value,
            time: document.getElementById('event-time').value,
            type: document.getElementById('event-type').value
        };
        
        this.overviewPresenter.dataManager.updateEvent(eventId, eventData);
        this.app.saveData();
        this.app.showNotification('Событие обновлено', 'success');
        this.overviewPresenter.render();
        return true;
    }
    
    handleDelete(eventId) {
        if (confirm('Вы уверены, что хотите удалить это событие?')) {
            this.overviewPresenter.dataManager.deleteEvent(eventId);
            this.app.saveData();
            this.app.showNotification('Событие удалено', 'warning');
            this.overviewPresenter.render();
            return true;
        }
        return false;
    }
}