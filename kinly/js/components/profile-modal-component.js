import { ModalComponent } from './modal-component.js';

export class ProfileModalComponent extends ModalComponent {
  constructor() {
    super();
    this._callbacks = {
      save: null
    };
  }

  getTitle() {
    return 'Профиль пользователя';
  }

  getBody() {
    return `
      <form id="profileForm">
        <div class="form-group">
          <label class="form-label">Аватар</label>
          <div class="avatar-upload">
            <div class="avatar-preview">
              <div class="user-avatar-large">Д</div>
            </div>
            <button type="button" class="btn btn-outline btn-sm">Изменить фото</button>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Имя</label>
            <input type="text" class="form-control" name="firstName" value="Диана" required>
          </div>
          <div class="form-group">
            <label class="form-label">Фамилия</label>
            <input type="text" class="form-control" name="lastName" value="Субаева" required>
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">Email</label>
          <input type="email" class="form-control" name="email" value="diana@example.com" required>
        </div>
        
        <div class="form-group">
          <label class="form-label">Телефон</label>
          <input type="tel" class="form-control" name="phone" placeholder="+7 (xxx) xxx-xx-xx">
        </div>
        
        <div class="form-group">
          <label class="form-label">О себе</label>
          <textarea class="form-control form-textarea" name="bio" placeholder="Расскажите о себе">Владелец двух замечательных питомцев - кота Джаспера и собаки Вупи</textarea>
        </div>
      </form>
    `;
  }

  _handleSave() {
    const formData = this.getFormData('profileForm');
    
    if (!formData.firstName || !formData.lastName || !formData.email) {
      alert('Пожалуйста, заполните обязательные поля');
      return;
    }

    if (this._callbacks.save) {
      this._callbacks.save(formData);
    }
  }

  setOnSaveHandler(callback) {
    this._callbacks.save = callback;
  }
}