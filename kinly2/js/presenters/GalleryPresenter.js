class GalleryPresenter extends Presenter {
    constructor(app) {
        super(app);
        this.photos = [];
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
                    <p>Фотографии роста и развития вашего питомца</p>
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
                                    <button class="btn-edit photo-edit-btn" data-photo-id="${photo.id}">Редактировать</button>
                                    <button class="btn-edit photo-delete-btn" data-photo-id="${photo.id}">Удалить</button>
                                </div>
                            </div>
                        `).join('') : '<p style="text-align: center; color: var(--text-tertiary); padding: 20px;">Нет фотографий</p>'}
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
            this.photos = JSON.parse(savedData);
        } else {
            this.photos = [];
            this.savePhotos();
        }
        
        return this.photos;
    }
    
    savePhotos() {
        const pet = this.getCurrentPet();
        if (pet) {
            localStorage.setItem(`photos_${pet.id}`, JSON.stringify(this.photos));
        }
    }
    
    setupEventListeners() {
        super.setupEventListeners();
        
        const addPhotoBtn = document.getElementById('add-photo-btn');
        if (addPhotoBtn) {
            addPhotoBtn.addEventListener('click', () => {
                this.showAddPhotoModal();
            });
        }
        
        document.querySelectorAll('.photo-edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const photoId = parseInt(e.target.dataset.photoId);
                this.showEditPhotoModal(photoId);
            });
        });
        
        document.querySelectorAll('.photo-delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const photoId = parseInt(e.target.dataset.photoId);
                this.deletePhoto(photoId);
            });
        });
    }
    
    showAddPhotoModal() {
        const pet = this.getCurrentPet();
        if (!pet) return;
        
        this.modalManager.showModal({
            title: 'Добавить фотографию',
            content: `
                <form id="photo-form">
                    <div class="form-group">
                        <label for="photo-title">Название фотографии</label>
                        <input type="text" id="photo-title" required>
                    </div>
                    <div class="form-group">
                        <label for="photo-description">Описание</label>
                        <textarea id="photo-description" rows="3" required></textarea>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="photo-date">Дата</label>
                            <input type="date" id="photo-date" value="${new Date().toISOString().split('T')[0]}" required>
                        </div>
                        <div class="form-group">
                            <label for="photo-weight">Вес питомца (кг)</label>
                            <input type="number" id="photo-weight" step="0.1" min="0" value="${pet.weight || ''}">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="photo-file">Выберите фото с устройства:</label>
                        <input type="file" id="photo-file" accept="image/*" required>
                        <small style="color: var(--text-tertiary); font-size: 12px;">
                            Поддерживаются форматы: JPG, PNG, GIF
                        </small>
                    </div>
                </form>
            `,
            buttons: [
                { 
                    text: 'Отменить', 
                    type: 'secondary', 
                    action: 'close' 
                },
                { 
                    text: 'Добавить', 
                    type: 'primary', 
                    action: async () => {
                        const title = document.getElementById('photo-title').value;
                        const description = document.getElementById('photo-description').value;
                        const date = document.getElementById('photo-date').value;
                        const weight = document.getElementById('photo-weight').value;
                        const fileInput = document.getElementById('photo-file');
                        const file = fileInput.files[0];
                        
                        if (!file) {
                            alert('Пожалуйста, выберите файл');
                            return false;
                        }
                        
                        if (!title || !description) {
                            alert('Пожалуйста, заполните все поля');
                            return false;
                        }
                        
                        // Читаем файл как Data URL
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            const newPhoto = {
                                id: Date.now(),
                                title: title,
                                description: description,
                                date: date,
                                weight: weight ? parseFloat(weight) : null,
                                imageData: e.target.result,
                                fileName: file.name
                            };
                            
                            this.photos.unshift(newPhoto);
                            this.savePhotos();
                            
                            // Обновляем вес питомца если указан
                            if (newPhoto.weight) {
                                this.dataManager.updatePet(pet.id, { weight: newPhoto.weight });
                                this.app.saveData();
                            }
                            
                            this.app.showNotification('Фотография добавлена', 'success');
                            this.render();
                        };
                        
                        reader.readAsDataURL(file);
                        return true;
                    }
                }
            ]
        });
    }
    
    showEditPhotoModal(photoId) {
        const photo = this.photos.find(p => p.id === photoId);
        if (!photo) return;
        
        const pet = this.getCurrentPet();
        if (!pet) return;
        
        this.modalManager.showModal({
            title: 'Редактировать фотографию',
            content: `
                <form id="photo-edit-form">
                    <div class="form-group">
                        <label for="edit-photo-title">Название фотографии</label>
                        <input type="text" id="edit-photo-title" value="${photo.title}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-photo-description">Описание</label>
                        <textarea id="edit-photo-description" rows="3" required>${photo.description}</textarea>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="edit-photo-date">Дата</label>
                            <input type="date" id="edit-photo-date" value="${photo.date}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-photo-weight">Вес питомца (кг)</label>
                            <input type="number" id="edit-photo-weight" step="0.1" min="0" value="${photo.weight || ''}">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="edit-photo-file">Заменить фото (оставьте пустым, чтобы сохранить текущее):</label>
                        <input type="file" id="edit-photo-file" accept="image/*">
                    </div>
                </form>
            `,
            buttons: [
                { 
                    text: 'Отменить', 
                    type: 'secondary', 
                    action: 'close' 
                },
                { 
                    text: 'Удалить', 
                    type: 'secondary', 
                    action: () => {
                        if (confirm('Вы уверены, что хотите удалить эту фотографию?')) {
                            this.deletePhoto(photoId);
                            return true;
                        }
                        return false;
                    }
                },
                { 
                    text: 'Сохранить', 
                    type: 'primary', 
                    action: async () => {
                        const title = document.getElementById('edit-photo-title').value;
                        const description = document.getElementById('edit-photo-description').value;
                        const date = document.getElementById('edit-photo-date').value;
                        const weight = document.getElementById('edit-photo-weight').value;
                        const fileInput = document.getElementById('edit-photo-file');
                        const file = fileInput.files[0];
                        
                        if (!title || !description) {
                            alert('Пожалуйста, заполните все обязательные поля');
                            return false;
                        }
                        
                        let imageData = photo.imageData;
                        let fileName = photo.fileName;
                        
                        // Если выбран новый файл
                        if (file) {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                                imageData = e.target.result;
                                fileName = file.name;
                                
                                const updatedPhoto = {
                                    ...photo,
                                    title: title,
                                    description: description,
                                    date: date,
                                    weight: weight ? parseFloat(weight) : null,
                                    imageData: imageData,
                                    fileName: fileName
                                };
                                
                                const index = this.photos.findIndex(p => p.id === photoId);
                                if (index !== -1) {
                                    this.photos[index] = updatedPhoto;
                                    this.savePhotos();
                                    
                                    if (updatedPhoto.weight) {
                                        this.dataManager.updatePet(pet.id, { weight: updatedPhoto.weight });
                                        this.app.saveData();
                                    }
                                    
                                    this.app.showNotification('Фотография обновлена', 'success');
                                    this.render();
                                }
                            };
                            reader.readAsDataURL(file);
                        } else {
                            // Если файл не меняли
                            const updatedPhoto = {
                                ...photo,
                                title: title,
                                description: description,
                                date: date,
                                weight: weight ? parseFloat(weight) : null
                            };
                            
                            const index = this.photos.findIndex(p => p.id === photoId);
                            if (index !== -1) {
                                this.photos[index] = updatedPhoto;
                                this.savePhotos();
                                
                                if (updatedPhoto.weight) {
                                    this.dataManager.updatePet(pet.id, { weight: updatedPhoto.weight });
                                    this.app.saveData();
                                }
                                
                                this.app.showNotification('Фотография обновлена', 'success');
                                this.render();
                            }
                        }
                        return true;
                    }
                }
            ]
        });
    }
    
    deletePhoto(photoId) {
        const index = this.photos.findIndex(p => p.id === photoId);
        if (index !== -1) {
            this.photos.splice(index, 1);
            this.savePhotos();
            this.app.showNotification('Фотография удалена', 'warning');
            this.render();
        }
    }
}