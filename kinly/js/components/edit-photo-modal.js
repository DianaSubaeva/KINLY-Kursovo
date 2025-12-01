import { ModalManager } from './modal-manager.js';

export class EditPhotoModal extends ModalManager {
  constructor(mode = 'add', data = null) {
    super('photo', mode, data);
  }

  _getBody() {
    return `
      <form id="photoForm">
        <div class="form-group">
          <label class="form-label">Название фото *</label>
          <input type="text" class="form-control" name="title" placeholder="Введите название" required>
        </div>
        
        <div class="form-group">
          <label class="form-label">Описание</label>
          <textarea class="form-control form-textarea" name="description" placeholder="Описание фото"></textarea>
        </div>
        
        <div class="form-group">
          <label class="form-label">Дата съемки</label>
          <input type="date" class="form-control" name="photoDate">
        </div>
        
        <div class="form-group">
          <label class="form-label">Загрузить фото</label>
          <input type="file" class="form-control" name="photoFile" accept="image/*">
          <small class="form-text">Для демо-версии можно оставить пустым</small>
        </div>
      </form>
    `;
  }

  _validateForm(data) {
    if (!data.title) {
      alert('Пожалуйста, укажите название фото');
      return false;
    }
    return true;
  }
}