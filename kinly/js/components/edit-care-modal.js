import { ModalManager } from './modal-manager.js';

export class EditCareModal extends ModalManager {
  constructor(mode = 'add', data = null) {
    super('care', mode, data);
  }

  _getBody() {
    return `
      <form id="careForm">
        <div class="form-group">
          <label class="form-label">Тип ухода *</label>
          <select class="form-select" name="careType" required>
            <option value="">Выберите тип</option>
            <option value="grooming">Груминг</option>
            <option value="bath">Купание</option>
            <option value="trim">Стрижка когтей</option>
            <option value="brush">Расчесывание</option>
            <option value="checkup">Осмотр</option>
            <option value="other">Другое</option>
          </select>
        </div>
        
        <div class="form-group">
          <label class="form-label">Дата и время *</label>
          <input type="datetime-local" class="form-control" name="careDate" required>
        </div>
        
        <div class="form-group">
          <label class="form-label">Описание *</label>
          <textarea class="form-control form-textarea" name="description" placeholder="Опишите процедуру" required></textarea>
        </div>
        
        <div class="form-group">
          <label class="form-label">Статус</label>
          <select class="form-select" name="status">
            <option value="completed">Выполнено</option>
            <option value="pending">Запланировано</option>
            <option value="cancelled">Отменено</option>
          </select>
        </div>
      </form>
    `;
  }

  _validateForm(data) {
    if (!data.careType || !data.careDate || !data.description) {
      alert('Пожалуйста, заполните обязательные поля (отмечены *)');
      return false;
    }
    return true;
  }
}