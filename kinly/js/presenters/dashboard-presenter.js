import { EditPetModal } from '../components/edit-pet-modal.js';
import { EditEventModal } from '../components/edit-event-modal.js';
import { EditMealModal } from '../components/edit-meal-modal.js';
import { EditCareModal } from '../components/edit-care-modal.js';
import { EditPhotoModal } from '../components/edit-photo-modal.js';
import { EditWeightModal } from '../components/edit-weight-modal.js';
import { EditProfileModal } from '../components/edit-profile-modal.js';
import { ManagePetsModal } from '../components/manage-pets-modal.js';
import { SettingsModal } from '../components/settings-modal.js';

export class DashboardPresenter {
  constructor(view, model, sidebar, header) {
    console.log('=== DashboardPresenter constructor ===');
    console.log('view:', view);
    console.log('model:', model);
    console.log('model type:', typeof model);
    console.log('model.getPets exists?', model && typeof model.getPets);
    
    this.view = view;
    this.model = model;
    this.sidebar = sidebar;
    this.header = header;
    this.currentModal = null;
    this.activePetId = null;
    
    console.log('=== End DashboardPresenter constructor ===');
  }

  init() {
    console.log('=== DashboardPresenter.init() DEBUG START ===');
    
    // Проверяем данные в localStorage
    const storedEvents = JSON.parse(localStorage.getItem('events') || '[]');
    const storedPets = JSON.parse(localStorage.getItem('pets') || '[]');
    
    console.log('LocalStorage проверка:');
    console.log('- Событий в хранилище:', storedEvents.length);
    console.log('- Питомцев в хранилище:', storedPets.length);
    console.log('- Активный питомец в localStorage:', localStorage.getItem('activePetId'));
    
    if (storedEvents.length > 0) {
      console.log('Последнее событие в хранилище:', storedEvents[storedEvents.length - 1]);
    }
    
    console.log('=== DashboardPresenter.init() DEBUG END ===');
    
    console.log('DashboardPresenter.init() called');

    // Устанавливаем активного питомца из модели ДО инициализации обработчиков
    const activePet = this.model.getActivePet();
    if (activePet) {
      this.activePetId = activePet.id;
      console.log('Active pet set from model:', activePet.name, 'ID:', this.activePetId);
    } else {
      console.warn('No active pet found in model');
    }
    
    this._initEventHandlers();
    this._loadData();
    console.log('DashboardPresenter инициализирован');
  }

  _loadData() {
    try {
      console.log('=== _loadData DEBUG START ===');
      console.log('Model available:', !!this.model);
      console.log('Model.getPets:', this.model ? this.model.getPets : 'no model');
      console.log('Active pet ID in presenter:', this.activePetId);
      
      // Загружаем профиль пользователя
      const userProfile = this.model.getUserProfile();
      console.log('User profile:', userProfile);
      
      if (this.sidebar.updateUserProfile) {
        this.sidebar.updateUserProfile(userProfile);
      }
      
      // Загружаем питомцев
      const pets = this.model.getPets();
      console.log('Loaded pets:', pets);
      console.log('Pets count:', pets.length);
      
      if (this.sidebar.updatePetsList) {
        this.sidebar.updatePetsList(pets);
      }
      
      // Устанавливаем активного питомца
      if (pets.length > 0) {
        // Получаем активного питомца из модели (она сама управляет activePetId)
        const activePet = this.model.getActivePet();
        console.log('Model.getActivePet():', activePet);
        
        if (activePet) {
          this.activePetId = activePet.id;
          console.log('Active pet from model:', activePet);
          console.log('Active pet ID updated to:', this.activePetId);
          
          // Теперь получаем все данные для активного питомца
          console.log('=== Loading data for active pet ===');
          
          const latestWeight = this.model.getLatestWeight();
          console.log('Latest weight:', latestWeight);
          
          const events = this.model.getUpcomingEvents();
          console.log('Upcoming events:', events);
          console.log('Events count:', events.length);
          
          const meals = this.model.getTodayMeals();
          console.log('Today meals:', meals);
          console.log('Meals count:', meals.length);
          
          const careActivities = this.model.getRecentCareActivities();
          console.log('Recent care activities:', careActivities);
          
          const photos = this.model.getRecentPhotos();
          console.log('Recent photos:', photos);

          console.log('Data loaded:', {
            pet: activePet.name,
            weight: latestWeight,
            eventsCount: events.length,
            mealsCount: meals.length,
            careCount: careActivities.length,
            photosCount: photos.length
          });

          // Рендерим данные для активного питомца
          this.view.renderQuickStats(activePet, latestWeight);
          this.view.renderEvents(
            events, 
            (id) => this._handleEditEvent(id),
            (id) => this._handleDeleteEvent(id)
          );
          this.view.renderNutrition(
            meals,
            (id) => this._handleEditMeal(id),
            (id) => this._handleDeleteMeal(id)
          );
          this.view.renderCareJournal(
            careActivities,
            (id) => this._handleEditCare(id),
            (id) => this._handleDeleteCare(id)
          );
          this.view.renderGallery(
            photos,
            (id) => this._handleEditPhoto(id),
            (id) => this._handleDeletePhoto(id)
          );
          
          console.log(`Загружены данные для питомца: ${activePet.name}`);
          
          // ДОПОЛНИТЕЛЬНО: Принудительно проверяем DOM
          setTimeout(() => {
            console.log('=== Проверка DOM после рендера ===');
            const eventsGrid = document.querySelector('.events-grid');
            if (eventsGrid) {
              console.log('Events grid found, children:', eventsGrid.children.length);
              console.log('Events grid HTML:', eventsGrid.innerHTML);
            } else {
              console.log('Events grid NOT found!');
            }
          }, 100);
          
        } else {
          console.error('Model.getActivePet() returned null/undefined');
          this._showNoDataState();
        }
      } else {
        // Если нет питомцев, показываем пустые состояния
        console.log('No pets found, showing empty states');
        this._showNoDataState();
      }
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
      console.error('Error stack:', error.stack);
    } finally {
      console.log('=== _loadData DEBUG END ===');
    }
  }

  _showNoDataState() {
    this.view.renderQuickStats(null, null);
    this.view.renderEvents([], null, null);
    this.view.renderNutrition([], null, null);
    this.view.renderCareJournal([], null, null);
    this.view.renderGallery([], null, null);
  }

  _initEventHandlers() {
  console.log('DashboardPresenter._initEventHandlers called');
  console.log('Checking if sidebar exists:', !!this.sidebar);
  console.log('Checking if sidebar methods exist:', {
    setOnAddPetHandler: typeof this.sidebar.setOnAddPetHandler,
    setOnEditPetHandler: typeof this.sidebar.setOnEditPetHandler,
    setOnSelectPetHandler: typeof this.sidebar.setOnSelectPetHandler,
    setOnProfileHandler: typeof this.sidebar.setOnProfileHandler,
    setOnPageChangeHandler: typeof this.sidebar.setOnPageChangeHandler
     });

    console.log('DashboardPresenter._initEventHandlers called');
    
    // Обработчики сайдбара
    console.log('Setting sidebar handlers...');
    this.sidebar.setOnAddPetHandler(() => {
      console.log('Add pet handler executed!');
      this._openModal('pet', 'add');
    });

    this.sidebar.setOnEditPetHandler((id) => {
      console.log('Редактирование питомца с ID:', id);
      this._openModal('pet', 'edit', id);
    });

    this.sidebar.setOnSelectPetHandler((id) => {
      console.log('Выбор питомца с ID:', id);
      this.activePetId = id;
      this.model.setActivePet(id);
      console.log('Active pet changed to:', id);
      this._loadData();
    });

    this.sidebar.setOnProfileHandler(() => {
      console.log('Открытие профиля');
      this._openModal('profile', 'edit');
    });

    // Обработчики header
    if (this.header.setOnNotificationHandler) {
      this.header.setOnNotificationHandler(() => {
        alert('Открытие уведомлений');
      });
    }

    // Обработчики view
    if (this.view.setOnAddEventHandler) {
      this.view.setOnAddEventHandler(() => {
        console.log('Add event button clicked');
        console.log('Current active pet ID:', this.activePetId);
        if (!this.activePetId) {
          alert('Сначала добавьте питомца!');
          return;
        }
        this._openModal('event', 'add');
      });
    }

    if (this.view.setOnAddMealHandler) {
      this.view.setOnAddMealHandler(() => {
        console.log('Add meal button clicked');
        console.log('Current active pet ID:', this.activePetId);
        if (!this.activePetId) {
          alert('Сначала добавьте питомца!');
          return;
        }
        this._openModal('meal', 'add');
      });
    }

    if (this.view.setOnAddCareHandler) {
      this.view.setOnAddCareHandler(() => {
        console.log('Add care button clicked');
        console.log('Current active pet ID:', this.activePetId);
        if (!this.activePetId) {
          alert('Сначала добавьте питомца!');
          return;
        }
        this._openModal('care', 'add');
      });
    }

    if (this.view.setOnAddPhotoHandler) {
      this.view.setOnAddPhotoHandler(() => {
        console.log('Add photo button clicked');
        console.log('Current active pet ID:', this.activePetId);
        if (!this.activePetId) {
          alert('Сначала добавьте питомца!');
          return;
        }
        this._openModal('photo', 'add');
      });
    }

    if (this.view.setOnAddWeightHandler) {
      this.view.setOnAddWeightHandler(() => {
        console.log('Add weight button clicked');
        console.log('Current active pet ID:', this.activePetId);
        if (!this.activePetId) {
          alert('Сначала добавьте питомца!');
          return;
        }
        this._openModal('weight', 'add');
      });
    }

    // Добавляем обработчик для напоминаний
    if (this.view.setOnAddReminderHandler) {
      this.view.setOnAddReminderHandler(() => {
        console.log('Add reminder button clicked');
        alert('Функция добавления напоминаний в разработке. Скоро будет доступна!');
      });
    }

    console.log('Все обработчики установлены');
  }

  // Универсальный метод для открытия модальных окон
  _openModal(type, mode = 'add', id = null) {
    console.log(`=== _openModal DEBUG START ===`);
    console.log(`Opening modal: ${type}, mode: ${mode}, id: ${id}`);
    console.log(`Active pet ID: ${this.activePetId}`);
    
    this._closeCurrentModal();

    let modal;
    let data = null;

    // Получаем данные если это редактирование
    if (mode === 'edit' && id) {
      console.log(`Getting data for ${type} with id: ${id}`);
      switch (type) {
        case 'pet': 
          data = this.model.getPetById ? this.model.getPetById(id) : null;
          break;
        case 'event': 
          data = this.model.getEventById ? this.model.getEventById(id) : null;
          break;
        case 'meal': 
          data = this.model.getMealById ? this.model.getMealById(id) : null;
          break;
        case 'care': 
          data = this.model.getCareActivityById ? this.model.getCareActivityById(id) : null;
          break;
        case 'photo': 
          data = this.model.getPhotoById ? this.model.getPhotoById(id) : null;
          break;
        case 'weight': 
          data = this.model.getWeightById ? this.model.getWeightById(id) : null;
          break;
        case 'profile': 
          data = this.model.getUserProfile ? this.model.getUserProfile() : null;
          break;
      }
      console.log(`Data for ${type}:`, data);
    }

    // Создаем модальное окно
    try {
      switch (type) {
        case 'pet': modal = new EditPetModal(mode, data); break;
        case 'event': modal = new EditEventModal(mode, data); break;
        case 'meal': modal = new EditMealModal(mode, data); break;
        case 'care': modal = new EditCareModal(mode, data); break;
        case 'photo': modal = new EditPhotoModal(mode, data); break;
        case 'weight': modal = new EditWeightModal(mode, data); break;
        case 'profile': modal = new EditProfileModal(mode, data); break;
        default: 
          console.error(`Unknown modal type: ${type}`);
          return;
      }
      console.log('Modal created successfully');
    } catch (error) {
      console.error(`Error creating ${type} modal:`, error);
      alert(`Ошибка при создании модального окна: ${error.message}`);
      return;
    }

    if (!modal) {
      console.error('Modal not created');
      return;
    }

    document.body.appendChild(modal.getElement());
    
    if (modal.afterRender) {
      modal.afterRender();
    }

    // Настраиваем обработчики
    if (modal.setOnSaveHandler) {
      modal.setOnSaveHandler((formData) => {
        console.log(`=== ${type} modal save handler ===`);
        console.log('Form data:', formData);
        console.log('Active pet ID:', this.activePetId);
        console.log('Mode:', mode);
        console.log('ID:', id);
        this._handleSave(type, mode, id, formData);
      });
    }

    if (modal.setOnDeleteHandler) {
      modal.setOnDeleteHandler(() => {
        if (confirm('Вы уверены, что хотите удалить эту запись?')) {
          console.log(`${type} modal delete handler called for id: ${id}`);
          this._handleDelete(type, id);
        }
      });
    }

    if (modal.setOnCancelHandler) {
      modal.setOnCancelHandler(() => {
        console.log(`${type} modal cancel handler called`);
        this._closeCurrentModal();
      });
    }

    this.currentModal = modal;
    
    if (modal.open) {
      modal.open();
    }
    
    console.log(`=== _openModal DEBUG END ===`);
  }

  // Метод для управления питомцами
  _openManagePetsModal() {
    this._closeCurrentModal();
    
    const pets = this.model.getPets();
    this.currentModal = new ManagePetsModal(pets);
    document.body.appendChild(this.currentModal.getElement());
    
    if (this.currentModal.afterRender) {
      this.currentModal.afterRender();
    }

    if (this.currentModal.setOnEditPetHandler) {
      this.currentModal.setOnEditPetHandler((id) => {
        this._openModal('pet', 'edit', id);
      });
    }

    if (this.currentModal.setOnDeletePetHandler) {
      this.currentModal.setOnDeletePetHandler((id) => {
        if (this.model.deletePet(id)) {
          alert('Питомец удален!');
          this._closeCurrentModal();
          this._loadData();
        }
      });
    }

    if (this.currentModal.setOnSetActivePetHandler) {
      this.currentModal.setOnSetActivePetHandler((id) => {
        this.activePetId = id;
        alert('Активный питомец изменен!');
        this._closeCurrentModal();
        this._loadData();
      });
    }

    if (this.currentModal.setOnAddNewPetHandler) {
      this.currentModal.setOnAddNewPetHandler(() => {
        this._openModal('pet', 'add');
      });
    }

    if (this.currentModal.setOnCancelHandler) {
      this.currentModal.setOnCancelHandler(() => this._closeCurrentModal());
    }
    
    if (this.currentModal.open) {
      this.currentModal.open();
    }
  }

  // Метод для настроек
  _openSettingsModal() {
    this._closeCurrentModal();
    
    this.currentModal = new SettingsModal();
    document.body.appendChild(this.currentModal.getElement());
    
    if (this.currentModal.afterRender) {
      this.currentModal.afterRender();
    }

    if (this.currentModal.setOnExportDataHandler) {
      this.currentModal.setOnExportDataHandler(() => {
        this._exportData();
      });
    }

    if (this.currentModal.setOnImportDataHandler) {
      this.currentModal.setOnImportDataHandler(() => {
        this._importData();
      });
    }

    if (this.currentModal.setOnClearDataHandler) {
      this.currentModal.setOnClearDataHandler(() => {
        this._clearAllData();
      });
    }

    if (this.currentModal.setOnSaveSettingsHandler) {
      this.currentModal.setOnSaveSettingsHandler((settings) => {
        console.log('Настройки сохранены:', settings);
        if (settings.theme === 'dark') {
          document.body.classList.add('dark-theme');
        } else {
          document.body.classList.remove('dark-theme');
        }
      });
    }

    if (this.currentModal.setOnCancelHandler) {
      this.currentModal.setOnCancelHandler(() => this._closeCurrentModal());
    }
    
    if (this.currentModal.open) {
      this.currentModal.open();
    }
  }

  _handleSave(type, mode, id, data) {
    try {
      console.log(`=== _handleSave DEBUG START ===`);
      console.log(`Type: ${type}, Mode: ${mode}, ID: ${id}`);
      console.log(`Active pet ID before save: ${this.activePetId}`);
      console.log(`Data received:`, data);
      
      // Для событий и других сущностей, которые должны быть привязаны к питомцу
      if (mode === 'add' && type !== 'pet' && type !== 'profile') {
        console.log(`Adding ${type} for active pet: ${this.activePetId}`);
        if (!this.activePetId) {
          throw new Error('Нет активного питомца. Сначала добавьте питомца.');
        }
        
        // Убедимся, что данные содержат petId
        data.petId = this.activePetId;
        console.log(`Added petId to ${type} data: ${data.petId}`);
      }
      
      if (mode === 'edit') {
        console.log(`Updating ${type} with ID: ${id}`);
        switch (type) {
          case 'pet': 
            this.model.updatePet(id, data);
            break;
          case 'event': 
            this.model.updateEvent(id, data);
            break;
          case 'meal': 
            this.model.updateMeal(id, data);
            break;
          case 'care': 
            this.model.updateCareActivity(id, data);
            break;
          case 'photo': 
            this.model.updatePhoto(id, data);
            break;
          case 'weight': 
            this.model.updateWeight(id, data);
            break;
          case 'profile': 
            const updatedProfile = this.model.updateUserProfile(data);
            if (this.sidebar.updateUserProfile) {
              this.sidebar.updateUserProfile(updatedProfile);
            }
            break;
        }
        alert('Данные успешно обновлены!');
      } else {
        console.log(`Adding new ${type}`);
        let newItem;
        switch (type) {
          case 'pet': 
            newItem = this.model.addPet(data);
            this.activePetId = newItem.id;
            this.model.setActivePet(newItem.id);
            console.log(`New pet added, active pet set to: ${this.activePetId}`);
            break;
          case 'event': 
            newItem = this.model.addEvent(data); 
            console.log(`New event added:`, newItem);
            break;
          case 'meal': 
            newItem = this.model.addMeal(data); 
            console.log(`New meal added:`, newItem);
            break;
          case 'care': 
            newItem = this.model.addCareActivity(data); 
            console.log(`New care activity added:`, newItem);
            break;
          case 'photo': 
            newItem = this.model.addPhoto(data); 
            console.log(`New photo added:`, newItem);
            break;
          case 'weight': 
            newItem = this.model.addWeight(data); 
            console.log(`New weight added:`, newItem);
            break;
        }
        console.log(`New ${type} added:`, newItem);
        alert('Запись успешно добавлена!');
      }
      
      // Проверяем, что данные сохранились
      console.log('=== Checking storage after save ===');
      if (type === 'event') {
        const storedEvents = JSON.parse(localStorage.getItem('events') || '[]');
        console.log('Events in localStorage:', storedEvents.length);
        console.log('Last event in storage:', storedEvents[storedEvents.length - 1]);
        
        const upcomingEvents = this.model.getUpcomingEvents();
        console.log('Upcoming events after save:', upcomingEvents);
        
        // ПРОВЕРЯЕМ DOM СРАЗУ
        console.log('=== Immediate DOM check ===');
        const eventsGrid = document.querySelector('.events-grid');
        if (eventsGrid) {
          console.log('Events grid exists, children count:', eventsGrid.children.length);
        } else {
          console.log('Events grid NOT found!');
        }
      }
      
      // Закрываем модальное окно
      this._closeCurrentModal();
      
      // Перезагружаем данные
      console.log('Reloading data...');
      this._loadData();
      
      // Дополнительная проверка через 500ms
      if (type === 'event') {
        setTimeout(() => {
          console.log('=== Delayed check after 500ms ===');
          const eventsGrid = document.querySelector('.events-grid');
          if (eventsGrid) {
            console.log('Events grid children after delay:', eventsGrid.children.length);
            console.log('Events grid HTML:', eventsGrid.innerHTML);
          }
        }, 500);
      }
      
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
      console.error('Error stack:', error.stack);
      alert(`Произошла ошибка при сохранении: ${error.message}`);
    } finally {
      console.log(`=== _handleSave DEBUG END ===`);
    }
  }

  _handleDelete(type, id) {
    try {
      console.log(`_handleDelete called: type=${type}, id=${id}`);
      
      let result = false;
      switch (type) {
        case 'pet': 
          result = this.model.deletePet ? this.model.deletePet(id) : false;
          break;
        case 'event': 
          result = this.model.deleteEvent ? this.model.deleteEvent(id) : false;
          break;
        case 'meal': 
          result = this.model.deleteMeal ? this.model.deleteMeal(id) : false;
          break;
        case 'care': 
          result = this.model.deleteCareActivity ? this.model.deleteCareActivity(id) : false;
          break;
        case 'photo': 
          result = this.model.deletePhoto ? this.model.deletePhoto(id) : false;
          break;
        case 'weight': 
          result = this.model.deleteWeight ? this.model.deleteWeight(id) : false;
          break;
      }

      if (result) {
        alert('Запись успешно удалена!');
        this._loadData();
      } else {
        alert('Не удалось удалить запись');
      }
    } catch (error) {
      console.error('Ошибка при удалении:', error);
      alert('Произошла ошибка при удалении');
    }
  }

  // Методы для работы с данными
  _exportData() {
    const data = {
      pets: this.model.pets,
      events: this.model.events,
      meals: this.model.meals,
      careActivities: this.model.careActivities,
      photos: this.model.photos,
      weights: this.model.weights,
      userProfile: this.model.getUserProfile(),
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `kinly-backup-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    alert('Данные успешно экспортированы!');
  }

  _importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          
          if (confirm('Импортировать данные? Существующие данные будут заменены.')) {
            localStorage.setItem('pets', JSON.stringify(data.pets || []));
            localStorage.setItem('events', JSON.stringify(data.events || []));
            localStorage.setItem('meals', JSON.stringify(data.meals || []));
            localStorage.setItem('careActivities', JSON.stringify(data.careActivities || []));
            localStorage.setItem('photos', JSON.stringify(data.photos || []));
            localStorage.setItem('weights', JSON.stringify(data.weights || []));
            
            if (data.userProfile) {
              localStorage.setItem('userProfile', JSON.stringify(data.userProfile));
            }
            
            alert('Данные успешно импортированы! Приложение будет перезагружено.');
            location.reload();
          }
        } catch (error) {
          alert('Ошибка при импорте данных: файл поврежден или имеет неверный формат');
        }
      };
      
      reader.readAsText(file);
    };
    
    input.click();
  }

  _clearAllData() {
    if (confirm('Вы уверены, что хотите удалить ВСЕ данные? Это действие нельзя отменить.')) {
      localStorage.clear();
      alert('Все данные очищены! Приложение будет перезагружено.');
      location.reload();
    }
  }

  // Обработчики редактирования
  _handleEditEvent(id) {
    this._openModal('event', 'edit', id);
  }

  _handleDeleteEvent(id) {
    if (confirm('Вы уверены, что хотите удалить это событие?')) {
      this._handleDelete('event', id);
    }
  }

  _handleEditMeal(id) {
    this._openModal('meal', 'edit', id);
  }

  _handleDeleteMeal(id) {
    if (confirm('Вы уверены, что хотите удалить это кормление?')) {
      this._handleDelete('meal', id);
    }
  }

  _handleEditCare(id) {
    this._openModal('care', 'edit', id);
  }

  _handleDeleteCare(id) {
    if (confirm('Вы уверены, что хотите удалить эту процедуру?')) {
      this._handleDelete('care', id);
    }
  }

  _handleEditPhoto(id) {
    this._openModal('photo', 'edit', id);
  }

  _handleDeletePhoto(id) {
    if (confirm('Вы уверены, что хотите удалить это фото?')) {
      this._handleDelete('photo', id);
    }
  }

  _handleEditWeight(id) {
    this._openModal('weight', 'edit', id);
  }

  _handleDeleteWeight(id) {
    if (confirm('Вы уверены, что хотите удалить это измерение веса?')) {
      this._handleDelete('weight', id);
    }
  }

  _closeCurrentModal() {
    if (this.currentModal) {
      console.log('Closing current modal');
      if (this.currentModal.close) {
        this.currentModal.close();
      }
      if (this.currentModal.removeElement) {
        this.currentModal.removeElement();
      }
      this.currentModal = null;
    }
  }
}