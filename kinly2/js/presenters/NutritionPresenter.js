class NutritionPresenter extends Presenter {
    constructor(app) {
        super(app);
        this.nutritionRecommendations = {
            cat: {
                dailyFood: '60-80 г',
                frequency: '2-3 раза в день',
                water: 'Свежая вода всегда в доступе',
                specialNotes: 'Кошки нуждаются в таурине в рационе'
            },
            dog: {
                dailyFood: '2-3% от веса тела',
                frequency: '1-2 раза в день',
                water: '40-60 мл на кг веса в день',
                specialNotes: 'Собакам нельзя шоколад, виноград, лук'
            },
            other: {
                dailyFood: 'Зависит от вида',
                frequency: 'По рекомендации ветеринара',
                water: 'По потребности',
                specialNotes: 'Проконсультируйтесь с ветеринаром'
            }
        };
    }
    
    getContent() {
        const pet = this.getCurrentPet();
        if (!pet) return '';
        
        const meals = this.dataManager.getMeals(pet.id);
        const petType = pet.type || 'cat';
        const recommendations = this.nutritionRecommendations[petType];
        const allergies = pet.allergies || ['Курица', 'Зерновые', 'Молочные продукты'];
        
        return `
            <section class="full-width-section">
                <div class="section-header">
                    <h2>Питание ${pet.name}</h2>
                    <p>Рацион и график кормления</p>
                    <button class="add-meal-btn" id="add-meal-btn">
                        <i class="fas fa-plus"></i> Добавить кормление
                    </button>
                </div>
                <div class="nutrition-section">
                    <div class="nutrition-card">
                        <h3>Сегодняшний рацион</h3>
                        <div class="nutrition-list">
                            ${meals.length > 0 ? meals.map(meal => `
                                <div class="meal-item" data-meal-id="${meal.id}">
                                    <div class="meal-time">${meal.time}</div>
                                    <div class="meal-info">
                                        <strong>${meal.food}</strong>
                                        <span>${meal.amount}</span>
                                    </div>
                                    <div class="meal-status ${meal.completed ? 'completed' : 'pending'}" data-meal-id="${meal.id}">
                                        <i class="fas fa-${meal.completed ? 'check' : 'circle'}"></i>
                                    </div>
                                    <button class="btn-edit meal-edit-btn" data-meal-id="${meal.id}">Редактировать</button>
                                </div>
                            `).join('') : '<p style="color: var(--text-tertiary); text-align: center;">Нет записей о кормлении</p>'}
                        </div>
                    </div>
                    
                    <div class="nutrition-card">
                        <h3>Рекомендации по питанию</h3>
                        <div class="nutrition-list">
                            <div class="meal-item">
                                <div class="meal-info">
                                    <strong>Суточная норма корма</strong>
                                    <span>${recommendations.dailyFood}</span>
                                </div>
                            </div>
                            <div class="meal-item">
                                <div class="meal-info">
                                    <strong>Частота кормления</strong>
                                    <span>${recommendations.frequency}</span>
                                </div>
                            </div>
                            <div class="meal-item">
                                <div class="meal-info">
                                    <strong>Вода</strong>
                                    <span>${recommendations.water}</span>
                                </div>
                            </div>
                            <div class="meal-item">
                                <div class="meal-info">
                                    <strong>Особенности</strong>
                                    <span>${recommendations.specialNotes}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="full-width-section">
                <div class="section-header">
                    <h2>Пищевые ограничения</h2>
                    <p>Аллергии и запрещенные продукты</p>
                    <button class="btn-edit" id="edit-allergies-btn">
                        <i class="fas fa-edit"></i> Редактировать список
                    </button>
                </div>
                <div class="nutrition-card">
                    <div class="allergies-list" id="allergies-list">
                        ${allergies.map(allergy => `
                            <span class="allergy-tag" data-allergy="${allergy}">
                                ${allergy}
                                <button class="remove-allergy" data-allergy="${allergy}" style="
                                    background: none;
                                    border: none;
                                    color: inherit;
                                    margin-left: 4px;
                                    cursor: pointer;
                                    font-size: 12px;
                                ">&times;</button>
                            </span>
                        `).join('')}
                    </div>
                    <div class="form-actions" style="margin-top: 20px;">
                        <button class="btn btn-primary" id="add-allergy-btn">
                            <i class="fas fa-plus"></i> Добавить аллергию
                        </button>
                    </div>
                </div>
            </section>
        `;
    }
    
    setupEventListeners() {
        // Добавление кормления
        document.getElementById('add-meal-btn')?.addEventListener('click', () => {
            this.showAddMealModal();
        });
        
        // Редактирование кормления
        document.querySelectorAll('.meal-edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mealId = parseInt(e.target.dataset.mealId);
                this.showEditMealModal(mealId);
            });
        });
        
        // Переключение статуса кормления
        document.querySelectorAll('.meal-status').forEach(status => {
            status.addEventListener('click', (e) => {
                const mealId = parseInt(e.target.closest('.meal-status').dataset.mealId);
                this.toggleMealStatus(mealId);
            });
        });
        
        // Редактирование аллергий
        document.getElementById('edit-allergies-btn')?.addEventListener('click', () => {
            this.showEditAllergiesModal();
        });
        
        // Добавление аллергии
        document.getElementById('add-allergy-btn')?.addEventListener('click', () => {
            this.showAddAllergyModal();
        });
        
        // Удаление аллергии
        document.querySelectorAll('.remove-allergy').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const allergy = e.target.dataset.allergy;
                this.removeAllergy(allergy);
            });
        });
    }
    
    toggleMealStatus(mealId) {
        const pet = this.getCurrentPet();
        const meals = this.dataManager.getMeals(pet.id);
        const meal = meals.find(m => m.id === mealId);
        
        if (meal) {
            const newStatus = !meal.completed;
            this.dataManager.updateMeal(mealId, { completed: newStatus });
            this.app.saveData();
            
            const statusText = newStatus ? 'выполнено' : 'ожидает';
            this.app.showNotification(`Кормление отмечено как ${statusText}`, 'success');
            this.render();
        }
    }
    
    showAddMealModal() {
        const pet = this.getCurrentPet();
        
        this.modalManager.showModal({
            title: 'Добавить кормление',
            content: `
                <form id="meal-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="meal-time">Время</label>
                            <input type="time" id="meal-time" required>
                        </div>
                        <div class="form-group">
                            <label for="meal-type">Тип кормления</label>
                            <select id="meal-type">
                                <option value="breakfast">Завтрак</option>
                                <option value="lunch">Обед</option>
                                <option value="dinner">Ужин</option>
                                <option value="snack">Перекус</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="meal-food">Корм</label>
                        <input type="text" id="meal-food" required>
                    </div>
                    <div class="form-group">
                        <label for="meal-amount">Количество</label>
                        <input type="text" id="meal-amount" placeholder="например, 60 г или 1 пауч" required>
                    </div>
                    <div class="form-group">
                        <label for="meal-notes">Примечания</label>
                        <textarea id="meal-notes" rows="2"></textarea>
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
                        const mealData = {
                            petId: pet.id,
                            time: document.getElementById('meal-time').value,
                            food: document.getElementById('meal-food').value,
                            amount: document.getElementById('meal-amount').value,
                            completed: false
                        };
                        
                        this.dataManager.addMeal(mealData);
                        this.app.saveData();
                        this.app.showNotification('Кормление добавлено', 'success');
                        this.render();
                    }
                }
            ]
        });
    }
    
    showEditMealModal(mealId) {
        const pet = this.getCurrentPet();
        const meals = this.dataManager.getMeals(pet.id);
        const meal = meals.find(m => m.id === mealId);
        
        if (!meal) return;
        
        this.modalManager.showModal({
            title: 'Редактировать кормление',
            content: `
                <form id="meal-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="meal-time">Время</label>
                            <input type="time" id="meal-time" value="${meal.time}" required>
                        </div>
                        <div class="form-group">
                            <label for="meal-type">Тип кормления</label>
                            <select id="meal-type">
                                <option value="breakfast" ${meal.type === 'breakfast' ? 'selected' : ''}>Завтрак</option>
                                <option value="lunch" ${meal.type === 'lunch' ? 'selected' : ''}>Обед</option>
                                <option value="dinner" ${meal.type === 'dinner' ? 'selected' : ''}>Ужин</option>
                                <option value="snack" ${meal.type === 'snack' ? 'selected' : ''}>Перекус</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="meal-food">Корм</label>
                        <input type="text" id="meal-food" value="${meal.food}" required>
                    </div>
                    <div class="form-group">
                        <label for="meal-amount">Количество</label>
                        <input type="text" id="meal-amount" value="${meal.amount}" required>
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
                        if (confirm('Удалить это кормление?')) {
                            this.dataManager.deleteMeal(mealId);
                            this.app.saveData();
                            this.app.showNotification('Кормление удалено', 'warning');
                            this.render();
                        }
                    }
                },
                { 
                    text: 'Сохранить', 
                    type: 'primary', 
                    action: () => {
                        const mealData = {
                            time: document.getElementById('meal-time').value,
                            food: document.getElementById('meal-food').value,
                            amount: document.getElementById('meal-amount').value
                        };
                        
                        this.dataManager.updateMeal(mealId, mealData);
                        this.app.saveData();
                        this.app.showNotification('Кормление обновлено', 'success');
                        this.render();
                    }
                }
            ]
        });
    }
    
    showEditAllergiesModal() {
        this.modalManager.showModal({
            title: 'Редактировать пищевые ограничения',
            content: `
                <div id="allergies-management">
                    <div class="current-allergies" style="margin-bottom: 20px;">
                        <h4 style="margin-bottom: 10px;">Текущие аллергии</h4>
                        <div id="allergies-list-edit">
                            ${this.allergies.map(allergy => `
                                <div class="allergy-item" style="
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                    padding: 8px 12px;
                                    background: var(--surface-hover);
                                    border-radius: var(--radius);
                                    margin-bottom: 8px;
                                ">
                                    <span>${allergy}</span>
                                    <button class="btn-edit remove-allergy-edit" data-allergy="${allergy}" style="
                                        background: var(--text-tertiary);
                                        color: white;
                                        border: none;
                                        padding: 4px 8px;
                                        border-radius: var(--radius-sm);
                                        font-size: 12px;
                                        cursor: pointer;
                                    ">Удалить</button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="add-allergy">
                        <h4 style="margin-bottom: 10px;">Добавить аллергию</h4>
                        <div class="form-row" style="display: flex; gap: 10px;">
                            <input type="text" id="new-allergy-input" placeholder="Название продукта" style="flex: 1;">
                            <button type="button" class="btn btn-primary" id="add-allergy-edit-btn">Добавить</button>
                        </div>
                    </div>
                </div>
            `,
            buttons: [
                { 
                    text: 'Закрыть', 
                    type: 'secondary', 
                    action: 'close' 
                }
            ]
        });
        
        // Обработчики для модального окна аллергий
        setTimeout(() => {
            // Удаление аллергии
            document.querySelectorAll('.remove-allergy-edit').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const allergy = e.target.dataset.allergy;
                    this.removeAllergy(allergy);
                    this.modalManager.closeCurrentModal();
                    this.showEditAllergiesModal();
                });
            });
            
            // Добавление аллергии
            document.getElementById('add-allergy-edit-btn')?.addEventListener('click', () => {
                this.addNewAllergy();
            });
            
            // Добавление по Enter
            document.getElementById('new-allergy-input')?.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.addNewAllergy();
                }
            });
        }, 100);
    }
    
    showAddAllergyModal() {
        this.modalManager.showModal({
            title: 'Добавить аллергию',
            content: `
                <form id="add-allergy-form">
                    <div class="form-group">
                        <label for="allergy-name">Название продукта</label>
                        <input type="text" id="allergy-name" required>
                    </div>
                    <div class="form-group">
                        <label for="allergy-severity">Степень тяжести</label>
                        <select id="allergy-severity">
                            <option value="mild">Легкая</option>
                            <option value="moderate">Средняя</option>
                            <option value="severe">Тяжелая</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="allergy-notes">Примечания</label>
                        <textarea id="allergy-notes" rows="2"></textarea>
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
                        const allergyName = document.getElementById('allergy-name').value;
                        if (allergyName && !this.allergies.includes(allergyName)) {
                            this.allergies.push(allergyName);
                            this.saveAllergies();
                            this.app.showNotification(`Аллергия "${allergyName}" добавлена`, 'success');
                            this.render();
                        }
                    }
                }
            ]
        });
    }
    
    addNewAllergy() {
        const input = document.getElementById('new-allergy-input');
        const allergyName = input.value.trim();
        
        if (allergyName && !this.allergies.includes(allergyName)) {
            this.allergies.push(allergyName);
            this.saveAllergies();
            input.value = '';
            this.app.showNotification(`Аллергия "${allergyName}" добавлена`, 'success');
            
            // Обновляем список в модальном окне
            const allergiesList = document.getElementById('allergies-list-edit');
            if (allergiesList) {
                const allergyItem = document.createElement('div');
                allergyItem.className = 'allergy-item';
                allergyItem.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: var(--surface-hover); border-radius: var(--radius); margin-bottom: 8px;';
                allergyItem.innerHTML = `
                    <span>${allergyName}</span>
                    <button class="btn-edit remove-allergy-edit" data-allergy="${allergyName}" style="
                        background: var(--text-tertiary);
                        color: white;
                        border: none;
                        padding: 4px 8px;
                        border-radius: var(--radius-sm);
                        font-size: 12px;
                        cursor: pointer;
                    ">Удалить</button>
                `;
                
                allergiesList.appendChild(allergyItem);
                
                // Добавляем обработчик для новой кнопки удаления
                const newBtn = allergyItem.querySelector('.remove-allergy-edit');
                newBtn.addEventListener('click', (e) => {
                    const allergy = e.target.dataset.allergy;
                    this.removeAllergy(allergy);
                    this.modalManager.closeCurrentModal();
                    this.showEditAllergiesModal();
                });
            }
        }
    }
    
    removeAllergy(allergy) {
        const index = this.allergies.indexOf(allergy);
        if (index > -1) {
            this.allergies.splice(index, 1);
            this.saveAllergies();
            this.app.showNotification(`Аллергия "${allergy}" удалена`, 'warning');
            this.render();
        }
    }
    
    saveAllergies() {
        const pet = this.getCurrentPet();
        this.dataManager.updatePet(pet.id, { allergies: this.allergies });
        this.app.saveData();
    }
}