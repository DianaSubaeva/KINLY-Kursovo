import { ModalManager } from './modal-manager.js';

export class SettingsModal extends ModalManager {
  constructor() {
    super('settings', 'manage');
  }

  _getTitle() {
    return 'Настройки приложения';
  }

  _getBody() {
    return `
      <form id="settingsForm">
        <div class="settings-section">
          <h4><i class="fas fa-bell"></i> Уведомления</h4>
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" name="emailNotifications" checked>
              <span>Email уведомления</span>
            </label>
          </div>
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" name="pushNotifications" checked>
              <span>Push уведомления</span>
            </label>
          </div>
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" name="reminderNotifications" checked>
              <span>Напоминания о событиях</span>
            </label>
          </div>
        </div>

        <div class="settings-section">
          <h4><i class="fas fa-eye"></i> Внешний вид</h4>
          <div class="form-group">
            <label class="form-label">Тема оформления</label>
            <select class="form-select" name="theme">
              <option value="light">Светлая</option>
              <option value="dark">Темная</option>
              <option value="auto">Авто</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Язык интерфейса</label>
            <select class="form-select" name="language">
              <option value="ru" selected>Русский</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        <div class="settings-section">
          <h4><i class="fas fa-database"></i> Данные</h4>
          <div class="form-group">
            <button type="button" class="btn btn-outline" id="exportData">
              <i class="fas fa-download"></i> Экспорт данных
            </button>
          </div>
          <div class="form-group">
            <button type="button" class="btn btn-outline" id="importData">
              <i class="fas fa-upload"></i> Импорт данных
            </button>
          </div>
          <div class="form-group">
            <button type="button" class="btn btn-danger" id="clearData">
              <i class="fas fa-trash"></i> Очистить все данные
            </button>
          </div>
        </div>

        <div class="settings-section">
          <h4><i class="fas fa-info-circle"></i> О приложении</h4>
          <div class="about-info">
            <p><strong>KINLY - Трекер домашних животных</strong></p>
            <p>Версия: 1.0.0</p>
            <p>© 2024 Все права защищены</p>
            <p><a href="#" id="privacyPolicy">Политика конфиденциальности</a></p>
            <p><a href="#" id="termsOfService">Условия использования</a></p>
          </div>
        </div>
      </form>
    `;
  }

  _getFooter() {
    return `
      <button class="btn btn-secondary" type="button" data-action="cancel">Закрыть</button>
      <button class="btn btn-primary" type="button" data-action="save">Сохранить настройки</button>
    `;
  }

  afterRender() {
    super.afterRender();
    this._setupSettingsButtons();
    this._loadCurrentSettings();
  }

  _setupSettingsButtons() {
    // Экспорт данных
    const exportBtn = this.getElement().querySelector('#exportData');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        if (this._callbacks.exportData) {
          this._callbacks.exportData();
        }
      });
    }

    // Импорт данных
    const importBtn = this.getElement().querySelector('#importData');
    if (importBtn) {
      importBtn.addEventListener('click', () => {
        if (this._callbacks.importData) {
          this._callbacks.importData();
        }
      });
    }

    // Очистка данных
    const clearBtn = this.getElement().querySelector('#clearData');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('ВНИМАНИЕ: Это действие удалит ВСЕ ваши данные без возможности восстановления. Продолжить?')) {
          if (this._callbacks.clearData) {
            this._callbacks.clearData();
            this.close();
          }
        }
      });
    }

    // Ссылки
    const privacyLink = this.getElement().querySelector('#privacyPolicy');
    const termsLink = this.getElement().querySelector('#termsOfService');
    
    if (privacyLink) {
      privacyLink.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Политика конфиденциальности будет доступна в следующем обновлении.');
      });
    }
    
    if (termsLink) {
      termsLink.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Условия использования будут доступны в следующем обновлении.');
      });
    }
  }

  _loadCurrentSettings() {
    const settings = JSON.parse(localStorage.getItem('appSettings')) || {};
    const form = this.getElement().querySelector('#settingsForm');
    
    if (!form) return;
    
    // Заполняем чекбоксы
    Object.keys(settings).forEach(key => {
      const input = form.querySelector(`[name="${key}"]`);
      if (input) {
        if (input.type === 'checkbox') {
          input.checked = settings[key];
        } else {
          input.value = settings[key];
        }
      }
    });
  }

  _handleSave() {
    const form = this.getElement().querySelector('#settingsForm');
    if (!form) return;

    const formData = new FormData(form);
    const settings = Object.fromEntries(formData);
    
    // Сохраняем настройки
    localStorage.setItem('appSettings', JSON.stringify(settings));
    
    if (this._callbacks.saveSettings) {
      this._callbacks.saveSettings(settings);
    }
    
    alert('Настройки сохранены!');
    this.close();
  }

  // Методы для установки обработчиков
  setOnExportDataHandler(callback) {
    this._callbacks.exportData = callback;
  }

  setOnImportDataHandler(callback) {
    this._callbacks.importData = callback;
  }

  setOnClearDataHandler(callback) {
    this._callbacks.clearData = callback;
  }

  setOnSaveSettingsHandler(callback) {
    this._callbacks.saveSettings = callback;
  }
}