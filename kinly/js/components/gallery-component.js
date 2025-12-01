import { AbstractComponent } from '../framework/view/abstract-component.js';

export class GalleryComponent extends AbstractComponent {
  constructor(photos = [], onEdit, onDelete) {
    super();
    this.photos = photos;
    this.onEdit = onEdit;
    this.onDelete = onDelete;
  }

  getTemplate() {
    if (this.photos.length === 0) {
      return `
        <div class="no-data">
          <i class="fas fa-images"></i>
          <p>Нет фотографий</p>
          <small>Добавьте фото вашего питомца</small>
        </div>
      `;
    }

    return `
      <div class="gallery-grid">
        ${this.photos.map(photo => this._createPhotoCard(photo)).join('')}
      </div>
    `;
  }

  _createPhotoCard(photo) {
    const photoDate = photo.photoDate || photo.createdAt;
    const formattedDate = photoDate ? new Date(photoDate).toLocaleDateString('ru-RU') : 'Без даты';

    return `
      <div class="photo-card" data-id="${photo.id}">
        <div class="photo-placeholder">
          <i class="fas fa-camera"></i>
          <div class="photo-overlay">
            <button class="btn-view" data-action="view">
              <i class="fas fa-search-plus"></i>
            </button>
          </div>
        </div>
        <div class="photo-info">
          <strong>${photo.title || 'Фото'}</strong>
          <span>${formattedDate}</span>
          <div class="photo-actions">
            <button class="btn-icon btn-edit" data-action="edit" title="Редактировать">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn-icon btn-delete" data-action="delete" title="Удалить">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  afterRender() {
    // Обработчики для просмотра фото
    this.getElement().querySelectorAll('[data-action="view"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const photoCard = e.target.closest('.photo-card');
        if (photoCard) {
          this._viewPhoto(photoCard.dataset.id);
        }
      });
    });

    // Обработчики для редактирования
    this.getElement().querySelectorAll('[data-action="edit"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const photoCard = e.target.closest('.photo-card');
        if (photoCard && this.onEdit) {
          this.onEdit(photoCard.dataset.id);
        }
      });
    });

    // Обработчики для удаления
    this.getElement().querySelectorAll('[data-action="delete"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const photoCard = e.target.closest('.photo-card');
        if (photoCard && this.onDelete) {
          this.onDelete(photoCard.dataset.id);
        }
      });
    });
  }

  _viewPhoto(photoId) {
    const photo = this.photos.find(p => p.id === photoId);
    if (photo) {
      alert(`Просмотр фото: ${photo.title || 'Без названия'}\n\nВ полной версии здесь будет отображаться фотография.`);
    }
  }
}