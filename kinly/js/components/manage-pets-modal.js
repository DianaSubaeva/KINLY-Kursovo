import { ModalManager } from './modal-manager.js';

export class ManagePetsModal extends ModalManager {
  constructor(pets = []) {
    super('managePets', 'manage', { pets });
    this.pets = pets;
  }

  _getTitle() {
    return 'Управление питомцами';
  }

  _getBody() {
    if (this.pets.length === 0) {
      return `
        <div class="no-data">
          <i class="fas fa-paw"></i>
          <p>У вас пока нет питомцев</p>
          <p>Добавьте первого питомца, используя кнопку ниже</p>
        </div>
      `;
    }

    return `
      <div class="pets-management">
        <div class="pets-list-container">
          ${this.pets.map(pet => this._createPetRow(pet)).join('')}
        </div>
      </div>
    `;
  }

  _createPetRow(pet) {
    const icon = pet.type === 'cat' ? 'fa-cat' : 
                 pet.type === 'dog' ? 'fa-dog' : 
                 pet.type === 'bird' ? 'fa-dove' : 'fa-paw';
    
    return `
      <div class="pet-management-row" data-id="${pet.id}">
        <div class="pet-info">
          <div class="pet-icon">
            <i class="fas ${icon}"></i>
          </div>
          <div class="pet-details">
            <strong>${pet.name}</strong>
            <span>${pet.breed || 'Без породы'} • ${this._getTypeName(pet.type)}</span>
          </div>
        </div>
        <div class="pet-actions">
          <button class="btn-icon btn-edit" title="Редактировать" data-action="edit" data-id="${pet.id}">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn-icon btn-delete" title="Удалить" data-action="delete" data-id="${pet.id}">
            <i class="fas fa-trash"></i>
          </button>
          <button class="btn-icon btn-make-active" title="Сделать активным" data-action="setActive" data-id="${pet.id}">
            <i class="fas fa-star"></i>
          </button>
        </div>
      </div>
    `;
  }

  _getFooter() {
    return `
      <button class="btn btn-secondary" type="button" data-action="cancel">Закрыть</button>
      <button class="btn btn-primary" type="button" data-action="addNew">
        <i class="fas fa-plus"></i> Добавить нового питомца
      </button>
    `;
  }

  afterRender() {
    super.afterRender();
    this._setupPetActions();
  }

  _setupPetActions() {
    const container = this.getElement().querySelector('.pets-management');
    if (!container) return;

    container.addEventListener('click', (e) => {
      const button = e.target.closest('button');
      if (!button) return;

      const action = button.dataset.action;
      const petId = button.dataset.id;

      if (action === 'edit' && petId) {
        if (this._callbacks.editPet) {
          this._callbacks.editPet(petId);
          this.close();
        }
      } else if (action === 'delete' && petId) {
        if (confirm('Вы уверены, что хотите удалить этого питомца? Все связанные данные будут удалены.')) {
          if (this._callbacks.deletePet) {
            this._callbacks.deletePet(petId);
            this.close();
          }
        }
      } else if (action === 'setActive' && petId) {
        if (this._callbacks.setActivePet) {
          this._callbacks.setActivePet(petId);
          this.close();
        }
      }
    });
  }

  _getTypeName(type) {
    const types = {
      'cat': 'Кошка',
      'dog': 'Собака',
      'bird': 'Птица',
      'other': 'Другое'
    };
    return types[type] || type;
  }

  // Методы для установки обработчиков
  setOnEditPetHandler(callback) {
    this._callbacks.editPet = callback;
  }

  setOnDeletePetHandler(callback) {
    this._callbacks.deletePet = callback;
  }

  setOnSetActivePetHandler(callback) {
    this._callbacks.setActivePet = callback;
  }

  setOnAddNewPetHandler(callback) {
    this._callbacks.addNewPet = callback;
  }
}