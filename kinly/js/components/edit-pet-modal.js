import { ModalManager } from './modal-manager.js';

export class EditPetModal extends ModalManager {
  constructor(mode = 'add', data = null) {
    super('pet', mode, data);
  }

  _getBody() {
    return `
      <form id="petForm">
        <div class="form-group">
          <label class="form-label">Имя питомца *</label>
          <input type="text" class="form-control" name="name" placeholder="Введите имя" required>
        </div>
        
        <div class="form-group">
          <label class="form-label">Вид животного *</label>
          <select class="form-select" name="type" required>
            <option value="">Выберите вид</option>
            <option value="cat">Кошка</option>
            <option value="dog">Собака</option>
            <option value="bird">Птица</option>
            <option value="other">Другое</option>
          </select>
        </div>
        
        <div class="form-group">
          <label class="form-label">Порода</label>
          <input type="text" class="form-control" name="breed" placeholder="Введите породу">
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Дата рождения</label>
            <input type="date" class="form-control" name="birthDate">
          </div>
          <div class="form-group">
            <label class="form-label">Пол</label>
            <select class="form-select" name="gender">
              <option value="">Выберите пол</option>
              <option value="male">Мужской</option>
              <option value="female">Женский</option>
            </select>
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">Особенности</label>
          <textarea class="form-control form-textarea" name="notes" placeholder="Аллергии, особенности поведения и т.д."></textarea>
        </div>
      </form>
    `;
  }

  _validateForm(data) {
    if (!data.name || !data.type) {
      alert('Пожалуйста, заполните обязательные поля (отмечены *)');
      return false;
    }
    return true;
  }
}