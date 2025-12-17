import { ModalComponent } from './modal-component.js';

export class AddWeightModalComponent extends ModalComponent {
  constructor() {
    super();
    this._callbacks = {
      save: null
    };
  }

  getTitle() {
    return 'Добавить измерение веса';
  }

  getBody() {
    return `
      <form id="addWeightForm">
        <div class="form-group">
          <label class="form-label">Вес</label>
          <div class="input-with-unit">
            <input type="number" class="form-control" name="weight" placeholder="0.0" step="0.1" min="0" required>
            <span class="input-unit">кг</span>
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">Дата измерения</label>
          <input type="datetime-local" class="form-control" name="measurementDate" required>
        </div>
        
        <div class="form-group">
          <label class="form-label">Примечания</label>
          <textarea class="form-control form-textarea" name="notes" placeholder="Особые условия измерения"></textarea>
        </div>
      </form>
    `;
  }

  _handleSave() {
    const formData = this.getFormData('addWeightForm');
    
    if (!formData.weight || !formData.measurementDate) {
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