import { ModalManager } from './modal-manager.js';

export class EditEventModal extends ModalManager {
  constructor(mode = 'add', data = null) {
    super('event', mode, data);
  }

  _getBody() {
    const currentDate = new Date();
    const tomorrow = new Date(currentDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Форматируем даты для input datetime-local
    const formatForInput = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const defaultDate = formatForInput(tomorrow);
    const minDate = formatForInput(currentDate);

    return `
      <form id="eventForm">
        <div class="form-group">
          <label class="form-label">Тип события *</label>
          <select class="form-select" name="type" required>
            <option value="">Выберите тип</option>
            <option value="vet" ${this.data?.type === 'vet' ? 'selected' : ''}>Визит к ветеринару</option>
            <option value="walk" ${this.data?.type === 'walk' ? 'selected' : ''}>Прогулка</option>
            <option value="vaccine" ${this.data?.type === 'vaccine' ? 'selected' : ''}>Вакцинация</option>
            <option value="grooming" ${this.data?.type === 'grooming' ? 'selected' : ''}>Груминг</option>
            <option value="other" ${this.data?.type === 'other' ? 'selected' : ''}>Другое</option>
          </select>
        </div>
        
        <div class="form-group">
          <label class="form-label">Название *</label>
          <input type="text" class="form-control" name="title" 
                 placeholder="Введите название события" 
                 value="${this.data?.title || ''}" required>
        </div>
        
        <div class="form-group">
          <label class="form-label">Дата и время *</label>
          <input type="datetime-local" class="form-control" name="startDate" 
                 value="${this.data?.startDate ? this._formatDateForInput(this.data.startDate) : defaultDate}" 
                 min="${minDate}" required>
          <small class="form-text">Выберите дату и время в будущем</small>
        </div>
        
        <div class="form-group">
          <label class="form-label">Место</label>
          <input type="text" class="form-control" name="location" 
                 placeholder="Введите место"
                 value="${this.data?.location || ''}">
        </div>
        
        <div class="form-group">
          <label class="form-label">Описание</label>
          <textarea class="form-control form-textarea" name="description" 
                    placeholder="Детали события">${this.data?.description || ''}</textarea>
        </div>
      </form>
    `;
  }

  _formatDateForInput(dateString) {
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  }

  _validateForm(data) {
    if (!data.type || !data.title || !data.startDate) {
      alert('Пожалуйста, заполните обязательные поля (отмечены *)');
      return false;
    }
    
    // Проверяем, что дата в будущем
    const eventDate = new Date(data.startDate);
    const now = new Date();
    if (eventDate <= now) {
      alert('Пожалуйста, выберите дату и время в будущем');
      return false;
    }
    
    return true;
  }

  afterRender() {
    super.afterRender();
    
    // Автофокус на первом поле
    const firstInput = this.getElement().querySelector('input, select, textarea');
    if (firstInput) {
      firstInput.focus();
    }
  }
}