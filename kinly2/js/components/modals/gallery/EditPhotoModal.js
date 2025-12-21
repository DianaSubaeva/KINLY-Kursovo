// modals/gallery/EditPhotoModal.js
class EditPhotoModal {
    constructor(app, galleryPresenter) {
        this.app = app;
        this.galleryPresenter = galleryPresenter;
    }
    
    show(photoId) {
        const photo = this.galleryPresenter.photos.find(p => p.id === photoId);
        if (!photo) return;
        
        const pet = this.galleryPresenter.getCurrentPet();
        if (!pet) return;
        
        const modal = new BaseModal({
            title: 'Редактировать фото',
            content: this.getForm(photo),
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
                        if (confirm('Удалить фото?')) {
                            this.galleryPresenter.deletePhoto(photoId);
                            return true;
                        }
                        return false;
                    }
                },
                { 
                    text: 'Сохранить', 
                    type: 'primary', 
                    action: () => this.handleSubmit(photoId, photo, pet)
                }
            ]
        });
        modal.show();
    }
    
    getForm(photo) {
        return `
            <form id="photo-edit-form">
                <div class="form-group">
                    <label for="edit-photo-title">Название</label>
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
                        <label for="edit-photo-weight">Вес (кг)</label>
                        <input type="number" id="edit-photo-weight" step="0.1" min="0" value="${photo.weight || ''}">
                    </div>
                </div>
                <div class="form-group">
                    <label for="edit-photo-file">Заменить фото:</label>
                    <input type="file" id="edit-photo-file" accept="image/*">
                </div>
            </form>
        `;
    }
    
    handleSubmit(photoId, photo, pet) {
        const title = document.getElementById('edit-photo-title').value;
        const description = document.getElementById('edit-photo-description').value;
        const date = document.getElementById('edit-photo-date').value;
        const weight = document.getElementById('edit-photo-weight').value;
        const fileInput = document.getElementById('edit-photo-file');
        const file = fileInput.files[0];
        
        if (!title || !description) {
            alert('Заполните все поля');
            return false;
        }
        
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.updatePhoto(photoId, {
                    title, description, date,
                    weight: weight ? parseFloat(weight) : null,
                    imageData: e.target.result,
                    fileName: file.name
                }, pet);
            };
            reader.readAsDataURL(file);
        } else {
            this.updatePhoto(photoId, {
                title, description, date,
                weight: weight ? parseFloat(weight) : null
            }, pet);
        }
        return true;
    }
    
    updatePhoto(photoId, updatedData, pet) {
        const index = this.galleryPresenter.photos.findIndex(p => p.id === photoId);
        if (index !== -1) {
            this.galleryPresenter.photos[index] = {
                ...this.galleryPresenter.photos[index],
                ...updatedData
            };
            
            this.galleryPresenter.savePhotos();
            
            if (updatedData.weight) {
                this.galleryPresenter.dataManager.updatePet(pet.id, { weight: updatedData.weight });
                this.app.saveData();
            }
            
            this.app.showNotification('Фото обновлено', 'success');
            this.galleryPresenter.render();
        }
    }
}
window.EditPhotoModal = EditPhotoModal;