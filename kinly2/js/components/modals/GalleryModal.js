// modals/GalleryModal.js
class GalleryModal {
    constructor(app, galleryPresenter) {  // ← Параметр должен быть galleryPresenter
        this.app = app;
        this.currentGalleryPresenter = galleryPresenter; // ← Используем параметр
        
        console.log('GalleryModal создан с presenter:', galleryPresenter);
        
        this.addPhotoModal = null;
        this.editPhotoModal = null;
        
        this.tryInitSubModals();
    }
    
    tryInitSubModals() {
        console.log('Попытка инициализации подмодальных окон...');
        
        // Проверяем, определены ли классы
        if (typeof window.AddPhotoModal !== 'undefined' && !this.addPhotoModal) {
            try {
                console.log('Создаю AddPhotoModal...');
                this.addPhotoModal = new window.AddPhotoModal(this.app, this.currentGalleryPresenter);
                console.log('✅ AddPhotoModal создан');
            } catch (error) {
                console.error('❌ Ошибка создания AddPhotoModal:', error);
            }
        } else if (typeof window.AddPhotoModal === 'undefined') {
            console.warn('⚠️ AddPhotoModal не найден в window');
        }
        
        if (typeof window.EditPhotoModal !== 'undefined' && !this.editPhotoModal) {
            try {
                console.log('Создаю EditPhotoModal...');
                this.editPhotoModal = new window.EditPhotoModal(this.app, this.currentGalleryPresenter);
                console.log('✅ EditPhotoModal создан');
            } catch (error) {
                console.error('❌ Ошибка создания EditPhotoModal:', error);
            }
        } else if (typeof window.EditPhotoModal === 'undefined') {
            console.warn('⚠️ EditPhotoModal не найден в window');
        }
    }
    
    showAddPhotoModal() {
        console.log('showAddPhotoModal вызван');
        console.log('currentGalleryPresenter:', this.currentGalleryPresenter);
        console.log('addPhotoModal:', this.addPhotoModal);
        
        // Проверяем presenter
        if (!this.currentGalleryPresenter) {
            console.error('❌ galleryPresenter не определен!');
            this.showErrorModal('Ошибка', 'Не удалось получить данные питомца');
            return;
        }
        
        // Проверяем, создан ли addPhotoModal
        if (!this.addPhotoModal) {
            if (typeof window.AddPhotoModal !== 'undefined') {
                try {
                    console.log('Создаю AddPhotoModal (отложенная инициализация)...');
                    this.addPhotoModal = new window.AddPhotoModal(this.app, this.currentGalleryPresenter);
                } catch (error) {
                    console.error('❌ Ошибка создания AddPhotoModal:', error);
                    this.showErrorModal('Ошибка', 'Не удалось создать окно добавления фото');
                    return;
                }
            } else {
                console.error('❌ AddPhotoModal класс не найден');
                this.showErrorModal('Ошибка', 'Класс AddPhotoModal не загружен');
                return;
            }
        }
        
        // Проверяем метод show
        if (this.addPhotoModal && typeof this.addPhotoModal.show === 'function') {
            this.addPhotoModal.show();
        } else {
            console.error('❌ addPhotoModal не имеет метода show');
            this.showErrorModal('Ошибка', 'Метод show не найден в AddPhotoModal');
        }
    }
    
    showEditPhotoModal(photoId) {
        console.log(`showEditPhotoModal вызван для фото ${photoId}`);
        
        if (!this.currentGalleryPresenter) {
            console.error('❌ galleryPresenter не определен!');
            return;
        }
        
        if (!this.editPhotoModal) {
            if (typeof window.EditPhotoModal !== 'undefined') {
                try {
                    this.editPhotoModal = new window.EditPhotoModal(this.app, this.currentGalleryPresenter);
                } catch (error) {
                    console.error('❌ Ошибка создания EditPhotoModal:', error);
                    return;
                }
            } else {
                console.error('❌ EditPhotoModal класс не найден');
                return;
            }
        }
        
        if (this.editPhotoModal && typeof this.editPhotoModal.show === 'function') {
            this.editPhotoModal.show(photoId);
        } else {
            console.error('❌ editPhotoModal не имеет метода show');
        }
    }
    
    showErrorModal(title, message) {
        const modalId = 'error-modal-' + Date.now();
        const modalHtml = `
            <div id="${modalId}" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.7);
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
            ">
                <div style="
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    max-width: 400px;
                ">
                    <h3 style="color: #d32f2f; margin-top: 0;">${title}</h3>
                    <p>${message}</p>
                    <button onclick="document.getElementById('${modalId}').remove()" 
                            style="
                                padding: 8px 16px;
                                background: #2196f3;
                                color: white;
                                border: none;
                                border-radius: 4px;
                                cursor: pointer;
                            ">
                        Закрыть
                    </button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }
}

// Экспорт в глобальную область
window.GalleryModal = GalleryModal;