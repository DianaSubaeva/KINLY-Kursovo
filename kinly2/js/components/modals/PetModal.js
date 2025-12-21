class PetModal extends BaseModal {
    constructor(options) {
        super(options);
    }
    static createAddModal(onSubmit) {
        const content = `
            <form id="pet-form">
                <div class="form-group">
                    <label for="pet-name">Имя питомца</label>
                    <input type="text" id="pet-name" required>
                </div>
                <div class="form-group">
                    <label for="pet-type">Тип животного</label>
                    <select id="pet-type" required>
                        <option value="cat">Кошка</option>
                        <option value="dog">Собака</option>
                        <option value="other">Другое</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="pet-breed">Порода</label>
                    <input type="text" id="pet-breed">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="pet-age">Возраст (лет)</label>
                        <input type="number" id="pet-age" min="0" max="50">
                    </div>
                    <div class="form-group">
                        <label for="pet-weight">Вес (кг)</label>
                        <input type="number" id="pet-weight" min="0" step="0.1">
                    </div>
                </div>
                <div class="form-group">
                    <label for="pet-health">Состояние здоровья</label>
                    <select id="pet-health">
                        <option value="Отличное">Отличное</option>
                        <option value="Хорошее">Хорошее</option>
                        <option value="Удовлетворительное">Удовлетворительное</option>
                        <option value="Требуется внимание">Требуется внимание</option>
                    </select>
                </div>
            </form>
        `;
        
        return new PetModal({
            title: 'Добавить питомца',
            content: content,
            buttons: [
                { 
                    text: 'Отменить', 
                    type: 'secondary', 
                    action: () => {} 
                },
                { 
                    text: 'Добавить', 
                    type: 'primary', 
                    action: () => {
                        const petData = {
                            name: document.getElementById('pet-name').value,
                            type: document.getElementById('pet-type').value,
                            breed: document.getElementById('pet-breed').value,
                            age: parseInt(document.getElementById('pet-age').value) || 0,
                            weight: parseFloat(document.getElementById('pet-weight').value) || 0,
                            healthStatus: document.getElementById('pet-health').value,
                            avatar: document.getElementById('pet-type').value
                        };
                        
                        if (onSubmit) {
                            onSubmit(petData);
                        }
                        return true;
                    }
                }
            ]
        });
    }
    
    static createEditModal(pet, onSubmit, onDelete) {
        const content = `
            <form id="pet-form">
                <div class="form-group">
                    <label for="pet-name">Имя питомца</label>
                    <input type="text" id="pet-name" value="${pet.name}" required>
                </div>
                <div class="form-group">
                    <label for="pet-type">Тип животного</label>
                    <select id="pet-type" required>
                        <option value="cat" ${pet.type === 'cat' ? 'selected' : ''}>Кошка</option>
                        <option value="dog" ${pet.type === 'dog' ? 'selected' : ''}>Собака</option>
                        <option value="other" ${pet.type === 'other' ? 'selected' : ''}>Другое</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="pet-breed">Порода</label>
                    <input type="text" id="pet-breed" value="${pet.breed || ''}">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="pet-age">Возраст (лет)</label>
                        <input type="number" id="pet-age" value="${pet.age || ''}" min="0" max="50">
                    </div>
                    <div class="form-group">
                        <label for="pet-weight">Вес (кг)</label>
                        <input type="number" id="pet-weight" value="${pet.weight || ''}" min="0" step="0.1">
                    </div>
                </div>
                <div class="form-group">
                    <label for="pet-health">Состояние здоровья</label>
                    <select id="pet-health">
                        <option value="Отличное" ${pet.healthStatus === 'Отличное' ? 'selected' : ''}>Отличное</option>
                        <option value="Хорошее" ${pet.healthStatus === 'Хорошее' ? 'selected' : ''}>Хорошее</option>
                        <option value="Удовлетворительное" ${pet.healthStatus === 'Удовлетворительное' ? 'selected' : ''}>Удовлетворительное</option>
                        <option value="Требуется внимание" ${pet.healthStatus === 'Требуется внимание' ? 'selected' : ''}>Требуется внимание</option>
                    </select>
                </div>
            </form>
        `;
        
        return new PetModal({
            title: 'Редактировать питомца',
            content: content,
            buttons: [
                { 
                    text: 'Отменить', 
                    type: 'secondary', 
                    action: () => {} 
                },
                { 
                    text: 'Удалить', 
                    type: 'secondary', 
                    action: () => {
                        if (confirm('Вы уверены, что хотите удалить этого питомца?')) {
                            if (onDelete) {
                                onDelete(pet.id);
                            }
                        }
                        return false; // Не закрываем модальное окно после подтверждения удаления
                    }
                },
                { 
                    text: 'Сохранить', 
                    type: 'primary', 
                    action: () => {
                        const petData = {
                            name: document.getElementById('pet-name').value,
                            type: document.getElementById('pet-type').value,
                            breed: document.getElementById('pet-breed').value,
                            age: parseInt(document.getElementById('pet-age').value) || 0,
                            weight: parseFloat(document.getElementById('pet-weight').value) || 0,
                            healthStatus: document.getElementById('pet-health').value,
                            avatar: document.getElementById('pet-type').value
                        };
                        
                        if (onSubmit) {
                            onSubmit(pet.id, petData);
                        }
                        return true;
                    }
                }
            ]
        });
    }
}