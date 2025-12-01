import { ModalComponent } from './modal-component.js';

export class AddPhotoModalComponent extends ModalComponent {
  constructor() {
    super();
    this._callbacks = {
      save: null
    };
  }

  getTitle() {
    return 'Добавить фотографию';
  }

  getBody() {
    return `
      <form id="addPhotoForm">
        <div class="form-group">
          <label class="form-label">Загрузить фото</label>
          <div class="file-upload-area">
            <input type="file" id="photoUpload" name="photo" accept="image/*" style="display: none;">
            <div class="file-upload-placeholder" id="uploadPlaceholder">
              <i class="fas fa-cloud-upload-alt"></i>
              <p>Нажмите для загрузки фото</p>
              <span>PNG, JPG до 5MB</span>
            </div>
            <div id="photoPreview" class="photo-preview" style="display: none;"></div>
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">Название</label>
          <input type="text" class="form-control" name="title" placeholder="Введите название фото">
        </div>
        
        <div class="form-group">
          <label class="form-label">Дата съемки</label>
          <input type="date" class="form-control" name="photoDate">
        </div>
        
        <div class="form-group">
          <label class="form-label">Описание</label>
          <textarea class="form-control form-textarea" name="description" placeholder="Опишите фотографию"></textarea>
        </div>
      </form>
    `;
  }

  afterRender() {
    super.afterRender();
    this._setupFileUpload();
  }

  _setupFileUpload() {
    const fileInput = this.getElement().querySelector('#photoUpload');
    const uploadPlaceholder = this.getElement().querySelector('#uploadPlaceholder');
    const photoPreview = this.getElement().querySelector('#photoPreview');

    if (uploadPlaceholder) {
      uploadPlaceholder.addEventListener('click', () => fileInput.click());
    }

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          if (file.size > 5 * 1024 * 1024) {
            alert('Файл слишком большой. Максимальный размер: 5MB');
            return;
          }

          const reader = new FileReader();
          reader.onload = (e) => {
            uploadPlaceholder.style.display = 'none';
            photoPreview.style.display = 'block';
            photoPreview.innerHTML = `
              <img src="${e.target.result}" alt="Preview">
              <button type="button" class="remove-photo">×</button>
            `;

            photoPreview.querySelector('.remove-photo').addEventListener('click', () => {
              fileInput.value = '';
              uploadPlaceholder.style.display = 'flex';
              photoPreview.style.display = 'none';
            });
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  _handleSave() {
    const formData = this.getFormData('addPhotoForm');
    const fileInput = this.getElement().querySelector('#photoUpload');
    
    if (fileInput && fileInput.files[0]) {
      // Здесь можно добавить логику для обработки файла
      console.log('Файл выбран:', fileInput.files[0].name);
    }

    if (this._callbacks.save) {
      this._callbacks.save(formData);
    }
  }

  setOnSaveHandler(callback) {
    this._callbacks.save = callback;
  }
}