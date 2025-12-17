class ModalManager {
    constructor(app) {
        this.app = app;
        this.modalContainer = document.getElementById('modal-container');
        this.currentModal = null;
    }
    
    showModal(options) {
        // Закрываем предыдущее модальное окно, если есть
        if (this.currentModal) {
            this.closeCurrentModal();
        }
        
        this.currentModal = new BaseModal(options);
        return this.currentModal;
    }
    
    showPetModal(type, pet, onSubmit, onDelete) {
        if (type === 'add') {
            return PetModal.createAddModal(onSubmit);
        } else if (type === 'edit') {
            return PetModal.createEditModal(pet, onSubmit, onDelete);
        }
    }
    
    showProfileModal(type, userData, onSubmit, stats) {
        if (type === 'edit') {
            const content = ProfileForm.createEditForm(userData);
            return this.showModal({
                title: 'Редактировать профиль',
                content: content,
                buttons: [
                    { 
                        text: 'Отменить', 
                        type: 'secondary', 
                        action: () => {} 
                    },
                    { 
                        text: 'Сохранить', 
                        type: 'primary', 
                        action: () => {
                            const updatedData = ProfileForm.getFormData();
                            if (onSubmit) {
                                onSubmit(updatedData);
                            }
                            return true;
                        }
                    }
                ]
            });
        } else if (type === 'view') {
            const content = ProfileForm.createQuickView(userData, stats);
            return this.showModal({
                title: 'Мой профиль',
                content: content,
                buttons: [
                    { 
                        text: 'Закрыть', 
                        type: 'secondary', 
                        action: () => {} 
                    },
                    { 
                        text: 'Редактировать', 
                        type: 'primary', 
                        action: () => {
                            if (onSubmit) {
                                onSubmit('edit');
                            }
                            return false;
                        }
                    }
                ]
            });
        }
    }
    
    closeCurrentModal() {
        if (this.currentModal) {
            this.currentModal.close();
            this.currentModal = null;
        }
    }
    
    closeModal(modal) {
        if (modal && modal.close) {
            modal.close();
            if (this.currentModal === modal) {
                this.currentModal = null;
            }
        }
    }
}