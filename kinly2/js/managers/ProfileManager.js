class ProfileManager {
    constructor(app) {
        this.app = app;
        this.userData = this.loadUserData();
        this.renderUserProfile();
        this.setupEventListeners();
    }
    
    loadUserData() {
        const savedData = localStorage.getItem(KINLY_CONST.STORAGE_KEYS.USER_PROFILE);
        
        if (savedData) {
            return JSON.parse(savedData);
        } else {
            return {
                name: 'Субаева Диана',
                role: 'Владелец питомцев',
                initials: 'Д',
                email: 'diana@example.com',
                phone: '+7 (999) 123-45-67',
                notifications: true,
                avatarColor: 'peach'
            };
        }
    }
    
    saveUserData() {
        localStorage.setItem(KINLY_CONST.STORAGE_KEYS.USER_PROFILE, JSON.stringify(this.userData));
    }
    
    renderUserProfile() {
        const avatar = document.getElementById('user-avatar');
        const name = document.getElementById('user-name');
        const role = document.getElementById('user-role');
        
        if (avatar) avatar.textContent = this.userData.initials;
        if (name) name.textContent = this.userData.name;
        if (role) role.textContent = this.userData.role;
        
        if (avatar) {
            const colors = {
                peach: 'linear-gradient(135deg, var(--peach-400), var(--apricot-400))',
                blue: 'linear-gradient(135deg, #4299e1, #63b3ed)',
                green: 'linear-gradient(135deg, #48bb78, #68d391)',
                purple: 'linear-gradient(135deg, #9f7aea, #b794f4)'
            };
            
            avatar.style.background = colors[this.userData.avatarColor] || colors.peach;
        }
    }
    
    setupEventListeners() {
        const userSection = document.getElementById('user-profile');
        const editBtn = userSection?.querySelector('.user-edit-btn');
        
        if (editBtn) {
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showEditProfileModal();
            });
        }
        
        if (userSection) {
            userSection.addEventListener('click', () => {
                this.showProfileQuickView();
            });
        }
    }
    
    showEditProfileModal() {
        this.app.modalManager.showProfileModal('edit', this.userData, (updatedData) => {
            this.userData = updatedData;
            this.saveUserData();
            this.renderUserProfile();
            this.app.showNotification('Профиль обновлен', 'success');
        });
    }
    
    showProfileQuickView() {
        const stats = {
            petsCount: this.app.dataManager.getPets().length,
            eventsCount: this.app.dataManager.getEvents(this.app.dataManager.getCurrentPetId()).length
        };
        
        this.app.modalManager.showProfileModal('view', this.userData, (action) => {
            if (action === 'edit') {
                this.showEditProfileModal();
            }
        }, stats);
    }
    
    getUserName() {
        return this.userData.name;
    }
    
    getUserInitials() {
        return this.userData.initials;
    }
    
    updateUserData(newData) {
        this.userData = { ...this.userData, ...newData };
        this.saveUserData();
        this.renderUserProfile();
    }
}