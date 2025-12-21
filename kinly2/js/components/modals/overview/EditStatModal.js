// modals/overview/EditStatModal.js
class EditStatModal {
    constructor(app, overviewPresenter) {
        this.app = app;
        this.overviewPresenter = overviewPresenter;
    }
    
    show(stat) {
        const pet = this.overviewPresenter.getCurrentPet();
        
        const { title, content } = this.getContent(pet, stat);
        
        const modal = new BaseModal({
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
                    action: () => this.handleSubmit(pet, stat)
                }
            ]
        });
        modal.show();
    }
    
    getContent(pet, stat) {
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
        
        return { title, content };
    }
    
    handleSubmit(pet, stat) {
        const newValue = document.getElementById('stat-value').value;
        const updateData = {};
        
        switch(stat) {
            case 'healthStatus':
                updateData.healthStatus = newValue;
                break;
            case 'weight':
                updateData.weight = parseFloat(newValue);
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
        
        this.overviewPresenter.dataManager.updatePet(pet.id, updateData);
        this.app.saveData();
        this.app.updateCurrentPetData();
        this.app.showNotification('Данные обновлены', 'success');
        this.overviewPresenter.render();
        return true;
    }
}