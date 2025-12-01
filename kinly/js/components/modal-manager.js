import { AbstractComponent } from '../framework/view/abstract-component.js';

export class ModalManager extends AbstractComponent {
  constructor(type, mode = 'add', data = null) {
    super();
    this.type = type;
    this.mode = mode;
    this.data = data;
    this._callbacks = {
      save: null,
      delete: null,
      cancel: null
    };
  }

  getTemplate() {
    const title = this._getTitle();
    const body = this._getBody();
    const footer = this._getFooter();

    return `
      <div class="modal-overlay">
        <div class="modal">
          <div class="modal-header">
            <h3 class="modal-title">${title}</h3>
            <button class="modal-close" type="button">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            ${body}
          </div>
          <div class="modal-footer">
            ${footer}
          </div>
        </div>
      </div>
    `;
  }

  _getTitle() {
    const titles = {
      'pet': { add: 'Добавить питомца', edit: 'Редактировать питомца' },
      'event': { add: 'Добавить событие', edit: 'Редактировать событие' },
      'meal': { add: 'Добавить кормление', edit: 'Редактировать кормление' },
      'care': { add: 'Добавить процедуру', edit: 'Редактировать процедуру' },
      'photo': { add: 'Добавить фото', edit: 'Редактировать фото' },
      'weight': { add: 'Добавить вес', edit: 'Редактировать измерение' }
    };
    return titles[this.type]?.[this.mode] || 'Модальное окно';
  }

  _getBody() {
    return '<p>Содержимое модального окна</p>';
  }

  _getFooter() {
    if (this.mode === 'edit') {
      return `
        <button class="btn btn-danger" type="button" data-action="delete">
          <i class="fas fa-trash"></i> Удалить
        </button>
        <div style="flex: 1"></div>
        <button class="btn btn-secondary" type="button" data-action="cancel">Отмена</button>
        <button class="btn btn-primary" type="button" data-action="save">Сохранить изменения</button>
      `;
    }

    return `
      <button class="btn btn-secondary" type="button" data-action="cancel">Отмена</button>
      <button class="btn btn-primary" type="button" data-action="save">Сохранить</button>
    `;
  }

  afterRender() {
    console.log(`${this.constructor.name}.afterRender() called, mode: ${this.mode}`);
    
    // Если есть данные (редактирование), заполните поля
    if (this.data && this.mode === 'edit') {
      console.log('Filling form with data:', this.data);
      this._fillFormWithData();
    }
    
    this._setupEventListeners();
  }

  _setupEventListeners() {
    const closeBtn = this.getElement().querySelector('.modal-close');
    const overlay = this.getElement().querySelector('.modal-overlay');
    const cancelBtn = this.getElement().querySelector('[data-action="cancel"]');
    const saveBtn = this.getElement().querySelector('[data-action="save"]');
    const deleteBtn = this.getElement().querySelector('[data-action="delete"]');

    if (closeBtn) closeBtn.addEventListener('click', () => this.close());
    if (overlay) overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this.close();
    });
    if (cancelBtn) cancelBtn.addEventListener('click', () => {
      this.close();
      if (this._callbacks.cancel) this._callbacks.cancel();
    });
    if (saveBtn) saveBtn.addEventListener('click', () => this._handleSave());
    if (deleteBtn) deleteBtn.addEventListener('click', () => this._handleDelete());
  }

  open() {
    console.log(`${this.constructor.name}.open() called`);
    this.getElement().classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  close() {
    console.log(`${this.constructor.name}.close() called`);
    this.getElement().classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  _fillFormWithData() {
    if (this.data) {
      const form = this.getElement().querySelector('form');
      if (!form) {
        console.error('Form not found in modal');
        return;
      }

      console.log('Filling form with data:', this.data);
      
      Object.keys(this.data).forEach(key => {
        const input = form.querySelector(`[name="${key}"]`);
        if (input) {
          if (input.type === 'checkbox') {
            input.checked = this.data[key];
          } else if (input.type === 'radio') {
            const radio = form.querySelector(`[name="${key}"][value="${this.data[key]}"]`);
            if (radio) radio.checked = true;
          } else {
            input.value = this.data[key] || '';
          }
          console.log(`Set ${key} = ${this.data[key]}`);
        }
      });
    }
  }

  _handleSave() {
    console.log(`${this.constructor.name}._handleSave() called`);
    
    const formData = this.getFormData();
    console.log('Form data collected:', formData);
    
    // Базовая валидация
    if (this._validateForm(formData)) {
      console.log('Form validation passed');
      if (this._callbacks.save) {
        this._callbacks.save(formData);
      } else {
        console.error('No save callback set!');
      }
    } else {
      console.log('Form validation failed');
    }
  }

  _handleDelete() {
    console.log(`${this.constructor.name}._handleDelete() called for id: ${this.data?.id}`);
    if (confirm('Вы уверены, что хотите удалить эту запись?')) {
      if (this._callbacks.delete) {
        this._callbacks.delete(this.data.id);
      }
    }
  }

  getFormData() {
    console.log(`${this.constructor.name}.getFormData() called`);
    
    const form = this.getElement().querySelector('form');
    if (!form) {
      console.error('Form not found in modal!');
      return {};
    }

    // Ручной сбор данных из формы (надежнее чем FormData)
    const formData = {};
    const elements = form.elements;
    
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const name = element.name;
      
      if (!name) continue;
      
      if (element.type === 'checkbox' || element.type === 'radio') {
        if (element.checked) {
          formData[name] = element.value;
        }
      } else if (element.type === 'select-multiple') {
        const selectedOptions = Array.from(element.selectedOptions).map(option => option.value);
        formData[name] = selectedOptions;
      } else {
        formData[name] = element.value;
      }
    }
    
    console.log('Collected form data:', formData);
    return formData;
  }

  _validateForm(data) {
    // Должен быть переопределен в дочерних классах
    console.log('Base validation for data:', data);
    return true;
  }

  setOnSaveHandler(callback) {
    console.log(`${this.constructor.name}.setOnSaveHandler() called with:`, callback);
    this._callbacks.save = callback;
  }

  setOnDeleteHandler(callback) {
    this._callbacks.delete = callback;
  }

  setOnCancelHandler(callback) {
    this._callbacks.cancel = callback;
  }
}