class ProfileForm {
    static createEditForm(userData) {
        return `
            <form id="profile-form">
                <div class="form-group">
                    <label for="profile-name">Имя и фамилия</label>
                    <input type="text" id="profile-name" value="${userData.name}" required>
                </div>
                <div class="form-group">
                    <label for="profile-role">Роль</label>
                    <input type="text" id="profile-role" value="${userData.role}" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="profile-email">Email</label>
                        <input type="email" id="profile-email" value="${userData.email}">
                    </div>
                    <div class="form-group">
                        <label for="profile-phone">Телефон</label>
                        <input type="tel" id="profile-phone" value="${userData.phone}">
                    </div>
                </div>
                <div class="form-group">
                    <label for="profile-initials">Инициалы (для аватара)</label>
                    <input type="text" id="profile-initials" maxlength="2" value="${userData.initials}" required>
                </div>
                <div class="form-group">
                    <label for="profile-avatar-color">Цвет аватара</label>
                    <select id="profile-avatar-color">
                        <option value="peach" ${userData.avatarColor === 'peach' ? 'selected' : ''}>Персиковый</option>
                        <option value="blue" ${userData.avatarColor === 'blue' ? 'selected' : ''}>Синий</option>
                        <option value="green" ${userData.avatarColor === 'green' ? 'selected' : ''}>Зеленый</option>
                        <option value="purple" ${userData.avatarColor === 'purple' ? 'selected' : ''}>Фиолетовый</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="profile-notifications" ${userData.notifications ? 'checked' : ''}>
                        <span>Получать уведомления</span>
                    </label>
                </div>
            </form>
        `;
    }
    
    static createQuickView(userData, stats) {
        return `
            <div class="profile-quickview">
                <div class="user-avatar-large" style="
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    background: ${userData.avatarColor === 'peach' ? 'linear-gradient(135deg, var(--peach-400), var(--apricot-400))' : 
                               userData.avatarColor === 'blue' ? 'linear-gradient(135deg, #4299e1, #63b3ed)' :
                               userData.avatarColor === 'green' ? 'linear-gradient(135deg, #48bb78, #68d391)' :
                               'linear-gradient(135deg, #9f7aea, #b794f4)'};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: 600;
                    font-size: 24px;
                    margin: 0 auto 20px auto;
                ">
                    ${userData.initials}
                </div>
                
                <div class="profile-info" style="text-align: center; margin-bottom: 24px;">
                    <h3 style="margin-bottom: 8px;">${userData.name}</h3>
                    <p style="color: var(--text-secondary); margin-bottom: 4px;">${userData.role}</p>
                    <p style="color: var(--text-tertiary); font-size: 14px;">
                        <i class="fas fa-envelope" style="margin-right: 8px;"></i>${userData.email}
                    </p>
                    <p style="color: var(--text-tertiary); font-size: 14px;">
                        <i class="fas fa-phone" style="margin-right: 8px;"></i>${userData.phone}
                    </p>
                </div>
                
                <div class="profile-stats" style="
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                    margin-top: 24px;
                ">
                    <div class="stat-item" style="text-align: center;">
                        <div style="font-size: 24px; font-weight: 600; color: var(--peach-500);">${stats.petsCount || 0}</div>
                        <div style="font-size: 12px; color: var(--text-tertiary);">Питомцев</div>
                    </div>
                    <div class="stat-item" style="text-align: center;">
                        <div style="font-size: 24px; font-weight: 600; color: var(--peach-500);">${stats.eventsCount || 0}</div>
                        <div style="font-size: 12px; color: var(--text-tertiary);">Событий</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    static getFormData() {
        return {
            name: document.getElementById('profile-name')?.value || '',
            role: document.getElementById('profile-role')?.value || '',
            email: document.getElementById('profile-email')?.value || '',
            phone: document.getElementById('profile-phone')?.value || '',
            initials: document.getElementById('profile-initials')?.value || '',
            avatarColor: document.getElementById('profile-avatar-color')?.value || 'peach',
            notifications: document.getElementById('profile-notifications')?.checked || false
        };
    }
}