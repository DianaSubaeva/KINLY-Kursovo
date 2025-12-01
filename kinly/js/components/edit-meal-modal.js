import { ModalManager } from './modal-manager.js';

export class EditMealModal extends ModalManager {
  constructor(mode = 'add', data = null) {
    super('meal', mode, data);
  }

  _getBody() {
    return `
      <form id="mealForm">
        <div class="form-group">
          <label class="form-label">Тип корма *</label>
          <select class="form-select" name="foodType" required>
            <option value="">Выберите тип</option>
            <option value="dry">Сухой корм</option>
            <option value="wet">Влажный корм</option>
            <option value="natural">Натуральный корм</option>
            <option value="treat">Лакомство</option>
          </select>
        </div>
        
        <div class="form-group">
          <label class="form-label">Название корма *</label>
          <input type="text" class="form-control" name="foodName" placeholder="Введите название корма" required>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Время кормления *</label>
            <input type="time" class="form-control" name="feedingTime" required>
          </div>
          <div class="form-group">
            <label class="form-label">Количество *</label>
            <input type="text" class="form-control" name="amount" placeholder="например: 100 г" required>
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">Примечания</label>
          <textarea class="form-control form-textarea" name="notes" placeholder="Особенности кормления"></textarea>
        </div>
      </form>
    `;
  }

  _validateForm(data) {
    if (!data.foodType || !data.foodName || !data.feedingTime || !data.amount) {
      alert('Пожалуйста, заполните обязательные поля (отмечены *)');
      return false;
    }
    return true;
  }
}