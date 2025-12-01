import { ModalComponent } from './modal-component.js';

export class AddEventModalComponent extends ModalComponent {
  constructor() {
    super();
    this._callbacks = {
      save: null
    };
  }

  getTitle() {
    return 'Добавить событие';
  }

  getBody() {
    return `
      <form id="addEventForm">
        <div class="form-group">
          <label class="form-label">Тип события</label>
          <select class="form-select" name="type" required>
            <option value="">Выберите тип</option>
            <option value="vet">Визит к ветеринару</option>
            <option value="vaccination">Вакцинация</option>
            <option value="training">Тренировка</option>
            <option value="walk">Прогулка</option>
            <option value="grooming">Груминг</option>
            <option value="other">Другое</option>
          </select>
        </div>
        
        <div class="form-group">
          <label class="form-label">Название</label>
          <input type="text" class="form-control" name="title" placeholder="Введите название события" required>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Дата начала</label>
            <input type="datetime-local" class="form-control" name="startDate" required>
          </div>
          <div class="form-group">
            <label class="form-label">Дата окончания</label>
            <input type="datetime-local" class="form-control" name="endDate">
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">Место</label>
          <input type="text" class="form-control" name="location" placeholder="Введите место проведения">
        </div>
        
        <div class="form-group">
          <label class="form-label">Описание</label>
          <textarea class="form-control form-textarea" name="description" placeholder="Опишите событие"></textarea>
        </div>
      </form>
    `;
  }

  _handleSave() {
    const formData = this.getFormData('addEventForm');
    
    if (!formData.type || !formData.title || !formData.startDate) {
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