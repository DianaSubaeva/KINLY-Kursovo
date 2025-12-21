
class GalleryPresenter extends Presenter {
    constructor(app) {
        super(app);
        this.photos = [];
        this._galleryModal = null;
    }
    
    get galleryModal() {
        if (!this._galleryModal) {
            try {
                if (typeof GalleryModal === 'undefined' && typeof window.GalleryModal === 'undefined') {
                    console.error('GalleryModal не найден в глобальной области!');
                    return null;
                }
                
                const ModalClass = window.GalleryModal || GalleryModal;
                
                // Создаем экземпляр
                this._galleryModal = new ModalClass(this.app, this);
                
            } catch (error) {
                console.error('Ошибка создания GalleryModal:', error);
                this._galleryModal = null;
            }
        }
        return this._galleryModal;
    }
    
    getContent() {
        const pet = this.getCurrentPet();
        if (!pet) return '';
        
        if (this.photos.length === 0) {
            this.loadPhotos();
        }
        
        return `
            <section class="full-width-section">
                <div class="section-header">
                    <h2>Галерея ${pet.name}</h2>
                    <p>Фотографии вашего питомца</p>
                    <button class="add-photo-btn" id="add-photo-btn">
                        <i class="fas fa-plus"></i> Добавить фото
                    </button>
                </div>
                <div class="gallery-section">
                    <div class="gallery-grid">
                        ${this.photos.length > 0 ? this.photos.map(photo => `
                            <div class="photo-card" data-photo-id="${photo.id}">
                                <div class="photo-placeholder">
                                    ${photo.imageData ? 
                                        `<img src="${photo.imageData}" alt="${photo.title}" style="width: 100%; height: 100%; object-fit: cover;">` :
                                        `<i class="fas fa-image"></i>`
                                    }
                                </div>
                                <div class="photo-info">
                                    <strong>${photo.title}</strong>
                                    <span>${photo.description}</span>
                                </div>
                                <div class="photo-actions">
                                    <button class="btn-edit photo-edit-btn" data-photo-id="${photo.id}">
                                        <i class="fas fa-edit"></i> Редактировать
                                    </button>
                                    <button class="btn-delete photo-delete-btn" data-photo-id="${photo.id}">
                                        <i class="fas fa-trash"></i> Удалить
                                    </button>
                                </div>
                            </div>
                        `).join('') : `
                            <div class="empty-gallery">
                                <i class="fas fa-images" style="font-size: 48px; color: #ccc; margin-bottom: 16px;"></i>
                                <p style="text-align: center; color: var(--text-tertiary); margin: 0;">
                                    Нет фотографий<br>
                                    <small>Добавьте первую фотографию вашего питомца</small>
                                </p>
                            </div>
                        `}
                    </div>
                </div>
            </section>
        `;
    }
    
    loadPhotos() {
        const pet = this.getCurrentPet();
        if (!pet) return [];
        
        const savedData = localStorage.getItem(`photos_${pet.id}`);
        
        if (savedData) {
            try {
                this.photos = JSON.parse(savedData);
            } catch (error) {
                console.log('Ошибка загрузки фото, начнем с пустого списка');
                this.photos = [];
            }
        } else {
            this.photos = [];
        }
        
        return this.photos;
    }
    
    savePhotos() {
        const pet = this.getCurrentPet();
        if (!pet) return;
        
        try {
            const toSave = this.photos.slice(0, 10);
            localStorage.setItem(`photos_${pet.id}`, JSON.stringify(toSave));
        } catch (error) {
            console.log('Ошибка сохранения фото:', error);
        }
    }
    
    deletePhoto(photoId) {
        const index = this.photos.findIndex(p => p.id === photoId);
        if (index !== -1) {
            const photo = this.photos[index];
            this.photos.splice(index, 1);
            this.savePhotos();
            this.app.showNotification(`Фото "${photo.title}" удалено`, 'warning');
            this.render();
        }
    }
    
    setupEventListeners() {
        super.setupEventListeners();
        
        // Кнопка добавления фото
        const addPhotoBtn = document.getElementById('add-photo-btn');
        if (addPhotoBtn) {
            addPhotoBtn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Получаем galleryModal через геттер
                const modal = this.galleryModal;
                if (modal && modal.showAddPhotoModal) {
                    modal.showAddPhotoModal();
                } else {
                    console.error('GalleryModal не доступен');
                    alert('Окно добавления фото временно недоступно');
                }
            });
        }
        
        // Кнопки редактирования
        document.querySelectorAll('.photo-edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const photoId = parseInt(e.target.closest('button').dataset.photoId);
                
                const modal = this.galleryModal;
                if (modal && modal.showEditPhotoModal) {
                    modal.showEditPhotoModal(photoId);
                } else {
                    console.error('GalleryModal не доступен');
                    alert('Окно редактирования фото временно недоступно');
                }
            });
        });
        
        // Кнопки удаления
        document.querySelectorAll('.photo-delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const photoId = parseInt(e.target.closest('button').dataset.photoId);
                const photo = this.photos.find(p => p.id === photoId);
                
                if (photo && confirm(`Удалить фото "${photo.title}"?`)) {
                    this.deletePhoto(photoId);
                }
            });
        });
        
        // Клик по карточке фото (для просмотра)
        document.querySelectorAll('.photo-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.photo-actions')) {
                    const photoId = parseInt(card.dataset.photoId);
                    const photo = this.photos.find(p => p.id === photoId);
                    if (photo) {
                        this.showPhotoPreview(photo);
                    }
                }
            });
        });
    }
    
    showPhotoPreview(photo) {
        // Простой просмотр фото
        const modalId = 'photo-preview-' + Date.now();
        const modalHtml = `
            <div id="${modalId}" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.9);
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
            ">
                <div style="max-width: 90%; max-height: 90%; position: relative;">
                    <button onclick="document.getElementById('${modalId}').remove()" 
                            style="
                                position: absolute;
                                top: -40px;
                                right: 0;
                                background: none;
                                border: none;
                                color: white;
                                font-size: 24px;
                                cursor: pointer;
                                z-index: 1001;
                            ">
                        ✕
                    </button>
                    ${photo.imageData ? 
                        `<img src="${photo.imageData}" alt="${photo.title}" 
                              style="max-width: 100%; max-height: 80vh; display: block; border-radius: 8px;">` :
                        `<div style="width: 300px; height: 300px; background: #333; color: white; 
                              display: flex; align-items: center; justify-content: center; border-radius: 8px;">
                            <i class="fas fa-image" style="font-size: 48px;"></i>
                         </div>`
                    }
                    ${photo.title || photo.description ? `
                        <div style="color: white; text-align: center; margin-top: 20px; padding: 0 20px;">
                            ${photo.title ? `<h4 style="margin: 0 0 10px 0; font-size: 18px;">${photo.title}</h4>` : ''}
                            ${photo.description ? `<p style="margin: 0 0 10px 0; opacity: 0.8;">${photo.description}</p>` : ''}
                            ${photo.date ? `<small style="opacity: 0.6;">${photo.date}</small>` : ''}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Закрытие по клику на фон
        document.getElementById(modalId).addEventListener('click', function(e) {
            if (e.target === this) {
                this.remove();
            }
        });
        
        // Закрытие по клавише Escape
        const closeOnEscape = (e) => {
            if (e.key === 'Escape') {
                const modal = document.getElementById(modalId);
                if (modal) modal.remove();
                document.removeEventListener('keydown', closeOnEscape);
            }
        };
        document.addEventListener('keydown', closeOnEscape);
    }
    
    // Очистка при уничтожении
    destroy() {
        this._galleryModal = null;
        super.destroy();
    }
}