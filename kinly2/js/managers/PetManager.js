class PetManager {
    constructor(app) {
        this.app = app;
        this.dataManager = app.dataManager;
    }
    
    renderPetsList() {
        const petsList = document.getElementById('pets-list');
        const pets = this.dataManager.getPets();
        const currentPetId = this.dataManager.getCurrentPetId();
        
        petsList.innerHTML = pets.map(pet => `
            <div class="pet-item ${pet.id === currentPetId ? 'active' : ''}" data-pet-id="${pet.id}">
                <div class="pet-avatar">
                    <i class="fas fa-${pet.avatar || 'paw'}"></i>
                </div>
                <div class="pet-info">
                    <strong>${pet.name}</strong>
                    <span>${pet.breed || 'Порода не указана'}</span>
                </div>
                <button class="pet-edit-btn" style="
                    background: transparent;
                    border: none;
                    color: var(--text-tertiary);
                    cursor: pointer;
                    font-size: 14px;
                    margin-left: auto;
                    padding: 4px 8px;
                " data-pet-id="${pet.id}">
                    <i class="fas fa-ellipsis-v"></i>
                </button>
            </div>
        `).join('');
        document.querySelectorAll('.pet-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.pet-edit-btn')) {
                    const petId = parseInt(e.currentTarget.dataset.petId);
                    this.app.switchPet(petId);
                }
            });
        });
        
        // Добавляем обработчики для кнопок редактирования
        document.querySelectorAll('.pet-edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const petId = parseInt(e.currentTarget.dataset.petId);
                this.showEditPetModal(petId);
            });
        });
    }
    
    showAddPetModal() {
        const modal = PetModal.createAddModal((petData) => {
            const newPet = this.dataManager.addPet(petData);
            this.app.switchPet(newPet.id);
            this.app.showNotification('Питомец добавлен', 'success');
        });
        
        if (modal.open) {
            modal.open();
        } else if (modal.show) {
            modal.show();
        } else {
            console.error('Модальное окно не имеет методов open/show');
        }
    }
    
    showEditPetModal(petId) {
        const pet = this.dataManager.getPet(petId);
        if (!pet) return;
        
        const modal = PetModal.createEditModal(
            pet,
            (petId, petData) => {
                this.dataManager.updatePet(petId, petData);
                this.app.switchPet(petId);
                this.app.showNotification('Данные питомца обновлены', 'success');
            },
            (petId) => {
                this.dataManager.deletePet(petId);
                this.dataManager.saveData();
                
                const pets = this.dataManager.getPets();
                if (pets.length > 0) {
                    this.app.switchPet(pets[0].id);
                }
                
                this.app.showNotification('Питомец удален', 'warning');
                modal.close();
            }
        );
        
        if (modal.open) {
            modal.open();
        } else if (modal.show) {
            modal.show();
        } else {
            console.error('Модальное окно не имеет методов open/show');
        }
    }
}