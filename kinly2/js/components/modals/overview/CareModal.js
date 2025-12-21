class CareModal {
    constructor(app, overviewPresenter) {
        this.app = app;
        this.overviewPresenter = overviewPresenter;
    }
    
    showAdd() {
        const modal = new BaseModal({
            title: 'Добавить запись ухода',
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
    
    showEdit(title) {
        const presenter = this.overviewPresenter;
        if (!presenter) return;
        
        const pet = presenter.getCurrentPet();
        if (!pet) return;
        
        const careItems = presenter.dataManager.getCareItems(pet.id);
        const careItem = careItems.find(item => item.title === title);
        
        if (careItem) {
            this.showEditById(careItem.id);
        } else {
            alert('Запись не найдена');
        }
    }
    
    showEditById(careItemId) {
        const presenter = this.overviewPresenter;
        if (!presenter) {
            alert('Ошибка: не удалось получить данные');
            return;
        }
        
        const pet = presenter.getCurrentPet();
        if (!pet) {
            alert('Питомец не выбран');
            return;
        }
        
        const careItems = presenter.dataManager.getCareItems(pet.id);
        const careItem = careItems.find(item => item.id === careItemId);
        
        if (!careItem) {
            alert('Запись не найдена');
            return;
        }
        
        const modal = new BaseModal({
            title: 'Редактировать запись ухода',
            content: this.getEditForm(careItem),
            buttons: [
                { 
                    text: 'Отменить', 
                    type: 'secondary', 
                    action: 'close' 
                },
                { 
                    text: 'Удалить', 
                    type: 'secondary', 
                    action: () => this.handleDelete(careItemId)
                },
                { 
                    text: 'Сохранить', 
                    type: 'primary', 
                    action: () => this.handleEditSubmit(careItemId)
                }
            ]
        });
        modal.show();
    }
    
    getAddForm() {
        const today = new Date().toISOString().split('T')[0];
        const nowTime = new Date().toLocaleTimeString('ru-RU', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        });
        
        return `
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
                        <option value="other">Другое</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="care-title">Название</label>
                    <input type="text" id="care-title" required placeholder="Например: Утреннее кормление">
                </div>
                <div class="form-group">
                    <label for="care-description">Описание</label>
                    <textarea id="care-description" rows="3" required placeholder="Подробное описание процедуры..."></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="care-date">Дата</label>
                        <input type="date" id="care-date" value="${today}" required>
                    </div>
                    <div class="form-group">
                        <label for="care-time">Время</label>
                        <input type="time" id="care-time" value="${nowTime}" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="care-notes">Примечания</label>
                    <textarea id="care-notes" rows="2" placeholder="Дополнительные заметки..."></textarea>
                </div>
            </form>
        `;
    }
    
    getEditForm(careItem) {
        return `
            <form id="care-edit-form">
                <div class="form-group">
                    <label for="edit-care-type">Тип ухода</label>
                    <select id="edit-care-type">
                        <option value="feeding" ${careItem.type === 'feeding' ? 'selected' : ''}>Кормление</option>
                        <option value="walk" ${careItem.type === 'walk' ? 'selected' : ''}>Прогулка</option>
                        <option value="grooming" ${careItem.type === 'grooming' ? 'selected' : ''}>Уход за шерстью</option>
                        <option value="bath" ${careItem.type === 'bath' ? 'selected' : ''}>Купание</option>
                        <option value="nails" ${careItem.type === 'nails' ? 'selected' : ''}>Стрижка когтей</option>
                        <option value="teeth" ${careItem.type === 'teeth' ? 'selected' : ''}>Чистка зубов</option>
                        <option value="medication" ${careItem.type === 'medication' ? 'selected' : ''}>Лекарства</option>
                        <option value="play" ${careItem.type === 'play' ? 'selected' : ''}>Игры</option>
                        <option value="training" ${careItem.type === 'training' ? 'selected' : ''}>Тренировка</option>
                        <option value="other" ${careItem.type === 'other' ? 'selected' : ''}>Другое</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="edit-care-title">Название</label>
                    <input type="text" id="edit-care-title" value="${careItem.title || ''}" required>
                </div>
                <div class="form-group">
                    <label for="edit-care-description">Описание</label>
                    <textarea id="edit-care-description" rows="3" required>${careItem.description || ''}</textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="edit-care-date">Дата</label>
                        <input type="date" id="edit-care-date" value="${careItem.date || new Date().toISOString().split('T')[0]}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-care-time">Время</label>
                        <input type="time" id="edit-care-time" value="${careItem.time || '10:00'}" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="edit-care-notes">Примечания</label>
                    <textarea id="edit-care-notes" rows="2">${careItem.notes || ''}</textarea>
                </div>
            </form>
        `;
    }
    
    handleAddSubmit() {
        const presenter = this.overviewPresenter;
        if (!presenter) {
            alert('Ошибка: не удалось получить данные');
            return false;
        }
        
        const pet = presenter.getCurrentPet();
        if (!pet) {
            alert('Питомец не выбран');
            return false;
        }
        
        const type = document.getElementById('care-type').value;
        const title = document.getElementById('care-title').value;
        const description = document.getElementById('care-description').value;
        const notes = document.getElementById('care-notes').value;
        
        if (!title || !description) {
            alert('Пожалуйста, заполните название и описание');
            return false;
        }
        
        const dateInput = document.getElementById('care-date');
        const timeInput = document.getElementById('care-time');
        
        const careItemData = {
            petId: pet.id,
            type: type,
            title: title,
            description: description,
            date: dateInput ? dateInput.value : new Date().toISOString().split('T')[0],
            time: timeInput ? timeInput.value : new Date().toLocaleTimeString('ru-RU', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
            }),
            notes: notes || ''
        };
        
        if (presenter.dataManager && typeof presenter.dataManager.addCareItem === 'function') {
            try {
                presenter.dataManager.addCareItem(careItemData);
                this.app.saveData();
                this.app.showNotification('Запись ухода добавлена', 'success');
                
                if (presenter.render) {
                    presenter.render();
                }
                
                return true;
            } catch (error) {
                alert('Ошибка при сохранении: ' + error.message);
                return false;
            }
        } else {
            alert('Ошибка: не удалось сохранить запись');
            return false;
        }
    }
    
    handleEditSubmit(careItemId) {
        const presenter = this.overviewPresenter;
        if (!presenter) {
            alert('Ошибка: не удалось получить данные');
            return false;
        }
        
        const type = document.getElementById('edit-care-type').value;
        const title = document.getElementById('edit-care-title').value;
        const description = document.getElementById('edit-care-description').value;
        const date = document.getElementById('edit-care-date').value;
        const time = document.getElementById('edit-care-time').value;
        const notes = document.getElementById('edit-care-notes').value;
        
        if (!title) {
            alert('Пожалуйста, введите название');
            return false;
        }
        
        const careItemData = {
            type: type,
            title: title,
            description: description,
            date: date,
            time: time,
            notes: notes || ''
        };
        
        if (presenter.dataManager && typeof presenter.dataManager.updateCareItem === 'function') {
            try {
                const success = presenter.dataManager.updateCareItem(careItemId, careItemData);
                if (success) {
                    this.app.saveData();
                    this.app.showNotification('Запись ухода обновлена', 'success');
                    presenter.render();
                    return true;
                } else {
                    alert('Не удалось найти запись для обновления');
                    return false;
                }
            } catch (error) {
                alert('Ошибка при обновлении записи: ' + error.message);
                return false;
            }
        } else {
            alert('Ошибка: не удалось обновить запись');
            return false;
        }
    }
    
    handleDelete(careItemId) {
        const presenter = this.overviewPresenter;
        
        if (!confirm('Вы уверены, что хотите удалить эту запись?')) {
            return false;
        }
        
        if (presenter.dataManager && typeof presenter.dataManager.deleteCareItem === 'function') {
            try {
                const success = presenter.dataManager.deleteCareItem(careItemId);
                if (success) {
                    this.app.saveData();
                    this.app.showNotification('Запись удалена', 'warning');
                    presenter.render();
                    return true;
                } else {
                    alert('Не удалось найти запись для удаления');
                    return false;
                }
            } catch (error) {
                alert('Ошибка при удалении записи: ' + error.message);
                return false;
            }
        } else {
            alert('Ошибка: не удалось удалить запись');
            return false;
        }
    }
}