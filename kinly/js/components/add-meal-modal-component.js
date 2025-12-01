import { ModalComponent } from './modal-component.js';

export class AddMealModalComponent extends ModalComponent {
  constructor() {
    super();
    this._callbacks = {
      save: null
    };
  }

  getTitle() {
    return 'Добавить кормление';
  }

  getBody() {
    return `
      <form id="addMealForm">
        <div class="form-group">
          <label class="form-label">Тип корма</label>
          <select class="form-select" name="foodType" required>
            <option value="">Выберите тип</option>
            <option value="dry">Сухой корм</option>
            <option value="wet">Влажный корм</option>
            <option value="natural">Натуральный корм</option>
            <option value="treat">Лакомство</option>
          </select>
        </div>
        
        <div class="form-group">
          <label class="form-label">Название корма</label>
          <input type="text" class="form-control" name="foodName" placeholder="Введите название корма" required>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Время кормления</label>
            <input type="time" class="form-control" name="feedingTime" required>
          </div>
          <div class="form-group">
            <label class="form-label">Количество</label>
            <input type="text" class="form-control" name="amount" placeholder="г/мл/шт" required>
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">Примечания</label>
          <textarea class="form-control form-textarea" name="notes" placeholder="Особенности кормления"></textarea>
        </div>
      </form>
    `;
  }

  _handleSave() {
    const formData = this.getFormData('addMealForm');
    
    if (!formData.foodType || !formData.foodName || !formData.feedingTime || !formData.amount) {
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
