import { ModalManager } from './modal-manager.js';

export class EditWeightModal extends ModalManager {
  constructor(mode = 'add', data = null) {
    super('weight', mode, data);
  }

  _getBody() {
    return `
      <form id="weightForm">
        <div class="form-group">
          <label class="form-label">Вес *</label>
          <div class="input-with-unit">
            <input type="number" class="form-control" name="weight" step="0.1" placeholder="Введите вес" required>
            <span class="unit">кг</span>
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">Дата и время измерения *</label>
          <input type="datetime-local" class="form-control" name="measurementDate" required>
        </div>
        
        <div class="form-group">
          <label class="form-label">Примечания</label>
          <textarea class="form-control form-textarea" name="notes" placeholder="Утреннее измерение, после еды и т.д."></textarea>
        </div>
      </form>
    `;
  }

  _validateForm(data) {
    if (!data.weight || !data.measurementDate) {
      alert('Пожалуйста, заполните обязательные поля (отмечены *)');
      return false;
    }
    return true;
  }
}