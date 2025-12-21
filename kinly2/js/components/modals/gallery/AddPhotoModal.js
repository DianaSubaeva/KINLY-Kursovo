// modals/gallery/AddPhotoModal.js
class AddPhotoModal {
    constructor(app, galleryPresenter) {
        this.app = app;
        this.galleryPresenter = galleryPresenter;
    }
    
    show() {
        const pet = this.galleryPresenter.getCurrentPet();
        if (!pet) return;
        
        const modal = new BaseModal({
            title: 'Добавить фотографию',
            content: this.getForm(),
            buttons: [
                { 
                    text: 'Отменить', 
                    type: 'secondary', 
                    action: 'close' 
                },
                { 
                    text: 'Добавить', 
                    type: 'primary', 
                    action: () => this.handleSubmit(pet)
                }
            ]
        });
        modal.show();
    }
    
    getForm() {
        const pet = this.galleryPresenter.getCurrentPet();
        return `
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
                        <input type="number" id="photo-weight" step="0.1" min="0" value="${pet?.weight || ''}">
                    </div>
                </div>
                <div class="form-group">
                    <label for="photo-file">Выберите фото:</label>
                    <input type="file" id="photo-file" accept="image/*" required>
                    <small style="color: var(--text-tertiary); font-size: 12px;">
                        JPG, PNG, GIF
                    </small>
                </div>
            </form>
        `;
    }
    
    handleSubmit(pet) {
        const title = document.getElementById('photo-title').value;
        const description = document.getElementById('photo-description').value;
        const date = document.getElementById('photo-date').value;
        const weight = document.getElementById('photo-weight').value;
        const fileInput = document.getElementById('photo-file');
        const file = fileInput.files[0];
        
        if (!file || !title || !description) {
            alert('Заполните все поля');
            return false;
        }
        
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
            
            this.galleryPresenter.photos.unshift(newPhoto);
            this.galleryPresenter.savePhotos();
            
            if (newPhoto.weight) {
                this.galleryPresenter.dataManager.updatePet(pet.id, { weight: newPhoto.weight });
                this.app.saveData();
            }
            
            this.app.showNotification('Фото добавлено', 'success');
            this.galleryPresenter.render();
        };
        
        reader.readAsDataURL(file);
        return true;
    }
}
window.AddPhotoModal = AddPhotoModal;