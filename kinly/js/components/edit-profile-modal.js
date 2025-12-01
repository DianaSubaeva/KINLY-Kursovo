import { ModalManager } from './modal-manager.js';

export class EditProfileModal extends ModalManager {
  constructor(mode = 'edit', data = null) {
    super('profile', mode, data);
  }

  _getTitle() {
    return 'Редактировать профиль';
  }

  _getBody() {
    return `
      <form id="profileForm">
        <div class="form-group">
          <label class="form-label">Аватар</label>
          <div class="avatar-upload">
            <div class="avatar-preview" id="avatarPreview">
              <div class="user-avatar-large">Д</div>
            </div>
            <button type="button" class="btn btn-outline btn-sm" id="changeAvatar">
              <i class="fas fa-camera"></i> Изменить фото
            </button>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Имя *</label>
            <input type="text" class="form-control" name="firstName" required>
          </div>
          <div class="form-group">
            <label class="form-label">Фамилия *</label>
            <input type="text" class="form-control" name="lastName" required>
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">Email *</label>
          <input type="email" class="form-control" name="email" required>
        </div>
        
        <div class="form-group">
          <label class="form-label">Телефон</label>
          <input type="tel" class="form-control" name="phone" placeholder="+7 (xxx) xxx-xx-xx">
        </div>
        
        <div class="form-group">
          <label class="form-label">Роль/Должность</label>
          <input type="text" class="form-control" name="role" placeholder="Владелец питомцев">
        </div>
        
        <div class="form-group">
          <label class="form-label">О себе</label>
          <textarea class="form-control form-textarea" name="bio" placeholder="Расскажите о себе" rows="4"></textarea>
        </div>
      </form>
    `;
  }

  _getFooter() {
    return `
      <button class="btn btn-secondary" type="button" data-action="cancel">Отмена</button>
      <button class="btn btn-primary" type="button" data-action="save">Сохранить изменения</button>
    `;
  }

  afterRender() {
    super.afterRender();
    this._setupAvatarChange();
  }

  _setupAvatarChange() {
    const changeBtn = this.getElement().querySelector('#changeAvatar');
    const avatarPreview = this.getElement().querySelector('#avatarPreview');
    
    if (changeBtn) {
      changeBtn.addEventListener('click', () => {
        const initials = prompt('Введите инициалы для аватара (1-2 буквы):', 'ДС');
        if (initials && initials.trim()) {
          const avatarText = initials.trim().substring(0, 2).toUpperCase();
          avatarPreview.querySelector('.user-avatar-large').textContent = avatarText;
        }
      });
    }
  }

  _fillFormWithData() {
    if (this.data) {
      const form = this.getElement().querySelector('form');
      if (!form) return;

      Object.keys(this.data).forEach(key => {
        const input = form.querySelector(`[name="${key}"]`);
        if (input) {
          input.value = this.data[key] || '';
        }
      });

      // Устанавливаем аватар
      const avatarPreview = this.getElement().querySelector('#avatarPreview .user-avatar-large');
      if (avatarPreview && this.data.avatar) {
        avatarPreview.textContent = this.data.avatar;
      }
    }
  }

  _validateForm(data) {
    if (!data.firstName || !data.lastName || !data.email) {
      alert('Пожалуйста, заполните обязательные поля (отмечены *)');
      return false;
    }
    
    if (!this._validateEmail(data.email)) {
      alert('Пожалуйста, введите корректный email');
      return false;
    }
    
    return true;
  }

  _validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
}