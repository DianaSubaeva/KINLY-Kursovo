import { AbstractComponent } from '../framework/view/abstract-component.js';

export class ModalComponent extends AbstractComponent {
  constructor() {
    super();
    this._isOpen = false;
  }

  getTemplate() {
    return `
      <div class="modal-overlay">
        <div class="modal">
          <div class="modal-header">
            <h3 class="modal-title">${this.getTitle()}</h3>
            <button class="modal-close" type="button">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            ${this.getBody()}
          </div>
          <div class="modal-footer">
            ${this.getFooter()}
          </div>
        </div>
      </div>
    `;
  }

  // Абстрактные методы, которые должны быть реализованы в дочерних классах
  getTitle() {
    return 'Модальное окно';
  }

  getBody() {
    return '<p>Содержимое модального окна</p>';
  }

  getFooter() {
    return `
      <button class="btn btn-secondary" type="button" data-action="cancel">Отмена</button>
      <button class="btn btn-primary" type="button" data-action="save">Сохранить</button>
    `;
  }

  afterRender() {
    this._setupEventListeners();
  }

  _setupEventListeners() {
    const closeBtn = this.getElement().querySelector('.modal-close');
    const overlay = this.getElement().querySelector('.modal-overlay');
    const cancelBtn = this.getElement().querySelector('[data-action="cancel"]');
    const saveBtn = this.getElement().querySelector('[data-action="save"]');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          this.close();
        }
      });
    }

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => this.close());
    }

    if (saveBtn) {
      saveBtn.addEventListener('click', () => this._handleSave());
    }
  }

  open() {
    this._isOpen = true;
    this.getElement().classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this._isOpen = false;
    this.getElement().classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  _handleSave() {
    // Должен быть переопределен в дочерних классах
    console.log('Save handler not implemented');
  }

  getFormData(formId) {
    const form = this.getElement().querySelector(`#${formId}`);
    if (form) {
      const formData = new FormData(form);
      return Object.fromEntries(formData);
    }
    return {};
  }
}