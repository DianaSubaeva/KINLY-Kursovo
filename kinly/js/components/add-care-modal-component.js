import { ModalComponent } from './modal-component.js';

export class AddCareModalComponent extends ModalComponent {
  constructor() {
    super();
    this._callbacks = {
      save: null
    };
  }

  getTitle() {
    return 'Добавить процедуру ухода';
  }

  getBody() {
    return `
      <form id="addCareForm">
        <div class="form-group">
          <label class="form-label">Тип процедуры</label>
          <select class="form-select" name="careType" required>
            <option value="">Выберите тип</option>
            <option value="grooming">Груминг</option>
            <option value="bath">Купание</option>
            <option value="nail_trim">Стрижка когтей</option>
            <option value="teeth_cleaning">Чистка зубов</option>
            <option value="other">Другое</option>
          </select>
        </div>
        
        <div class="form-group">
          <label class="form-label">Дата и время</label>
          <input type="datetime-local" class="form-control" name="careDate" required>
        </div>
        
        <div class="form-group">
          <label class="form-label">Описание</label>
          <textarea class="form-control form-textarea" name="description" placeholder="Опишите процедуру"></textarea>
        </div>
        
        <div class="form-group">
          <label class="form-label">Статус</label>
          <select class="form-select" name="status">
            <option value="planned">Запланировано</option>
            <option value="completed">Выполнено</option>
            <option value="cancelled">Отменено</option>
          </select>
        </div>
      </form>
    `;
  }

  _handleSave() {
    const formData = this.getFormData('addCareForm');
    
    if (!formData.careType || !formData.careDate) {
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