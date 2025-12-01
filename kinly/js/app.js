import { AppModel } from './models/app-model.js';
import { SidebarComponent } from './components/sidebar-component.js';
import { HeaderComponent } from './components/header-component.js';
import { DashboardView } from './views/dashboard-view.js';
import { DashboardPresenter } from './presenters/dashboard-presenter.js';

export class App {
  constructor() {
    this.model = null;
    this.sidebar = null;
    this.header = null;
    this.dashboardView = null;
    this.dashboardPresenter = null;
  }

  init() {
    console.log('Инициализация приложения...');
    
    try {
      // 1. Инициализация модели
      this.model = new AppModel();
      console.log('Модель инициализирована');
      
      // 2. Инициализация компонентов
      this.sidebar = new SidebarComponent();
      this.header = new HeaderComponent();
      this.dashboardView = new DashboardView();
      
      console.log('Компоненты созданы');
      
      // 3. Добавление компонентов в DOM
      const sidebarContainer = document.querySelector('.sidebar-container');
      const headerContainer = document.querySelector('.header-container');
      const pageContent = document.querySelector('.page-content');
      
      if (!sidebarContainer || !headerContainer || !pageContent) {
        console.error('Один или несколько контейнеров не найдены!');
        console.error('sidebar-container:', !!sidebarContainer);
        console.error('header-container:', !!headerContainer);
        console.error('page-content:', !!pageContent);
        return;
      }
      
      // Очищаем контейнеры
      sidebarContainer.innerHTML = '';
      headerContainer.innerHTML = '';
      pageContent.innerHTML = '';
      
      // Добавляем компоненты в DOM
      sidebarContainer.appendChild(this.sidebar.getElement());
      headerContainer.appendChild(this.header.getElement());
      pageContent.appendChild(this.dashboardView.getElement());
      
      console.log('Компоненты добавлены в DOM');
      
      // 4. Инициализация презентера
      this.dashboardPresenter = new DashboardPresenter(
        this.dashboardView,
        this.model,
        this.sidebar,
        this.header
      );
      
      console.log('Презентер создан');
      
      // 5. Запуск презентера
      console.log('Запуск презентера...');
      this.dashboardPresenter.init();
      
      console.log('Приложение успешно инициализировано');
      
      // 6. Добавляем начальные данные если они отсутствуют
      this._initializeSampleData();
      
      // 7. Настраиваем плавную прокрутку для навигации
      this._setupSmoothScrolling();
      
    } catch (error) {
      console.error('Ошибка при инициализации приложения:', error);
      alert('Произошла ошибка при загрузке приложения. Проверьте консоль для деталей.');
    }
  }

  _setupSmoothScrolling() {
    console.log('Настройка плавной прокрутки...');
    
    // Ждем пока компоненты отрендерятся
    setTimeout(() => {
      // Обработка кликов по ссылкам в сайдбаре
      document.addEventListener('click', (e) => {
        // Проверяем, кликнули ли на ссылку с якорем в навигации
        const link = e.target.closest('.nav-link');
        
        if (link && link.dataset.section) {
          e.preventDefault();
          e.stopPropagation();
          
          const sectionId = link.dataset.section;
          console.log('Плавная прокрутка к разделу:', sectionId);
          
          const targetElement = document.getElementById(sectionId);
          
          if (targetElement) {
            // Плавная прокрутка с отступом для шапки
            window.scrollTo({
              top: targetElement.offsetTop - 100,
              behavior: 'smooth'
            });
            
            // Убираем активный класс у всех ссылок
            document.querySelectorAll('.nav-link').forEach(item => {
              item.classList.remove('active');
            });
            
            // Добавляем активный класс к текущей ссылке
            link.classList.add('active');
          } else {
            console.warn(`Раздел с id="${sectionId}" не найден`);
          }
        }
      });
    }, 500);
  }

  _initializeSampleData() {
    console.log('_initializeSampleData called');
    
    // Проверяем, есть ли уже данные
    const hasData = this.model.getPets().length > 0 || 
                    this.model.getEvents().length > 0 || 
                    this.model.getMeals().length > 0;
    
    if (!hasData) {
      console.log('Добавляем демо-данные...');
      
      // Добавляем демо-питомца
      const demoPet = {
        name: 'Джаспер',
        type: 'cat',
        breed: 'Абиссинский',
        birthDate: '2022-05-15',
        gender: 'male',
        notes: 'Любит играть с мячиком'
      };
      
      this.model.addPet(demoPet);
      
      // Добавляем демо-событие
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0);
      
      const demoEvent = {
        type: 'vet',
        title: 'Визит к ветеринару',
        startDate: tomorrow.toISOString().slice(0, 16),
        location: 'Ветеринарная клиника "Друг"',
        description: 'Ежегодный осмотр и консультация'
      };
      
      this.model.addEvent(demoEvent);
      
      // Добавляем демо-кормление
      const demoMeal = {
        foodType: 'dry',
        foodName: 'Сухой корм Premium',
        feedingTime: '08:00',
        amount: '60 г'
      };
      
      this.model.addMeal(demoMeal);
      
      console.log('Демо-данные добавлены');
      
      // Обновляем представление
      if (this.dashboardPresenter && this.dashboardPresenter._loadData) {
        console.log('Обновляем данные через презентер');
        this.dashboardPresenter._loadData();
      }
    } else {
      console.log('Данные уже существуют, пропускаем добавление демо-данных');
    }
  }

  reload() {
    this.destroy();
    this.init();
  }

  destroy() {
    if (this.dashboardView) {
      this.dashboardView.removeAllComponents();
    }
    
    if (this.sidebar) {
      this.sidebar.removeElement();
    }
    
    if (this.header) {
      this.header.removeElement();
    }
    
    if (this.dashboardView) {
      this.dashboardView.removeElement();
    }
    
    // Очищаем все модальные окна
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => modal.remove());
    
    this.model = null;
    this.sidebar = null;
    this.header = null;
    this.dashboardView = null;
    this.dashboardPresenter = null;
    
    console.log('Приложение уничтожено');
  }
}

// Глобальный доступ к приложению для отладки
window.app = null;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM готов, запускаем приложение...');
  window.app = new App();
  window.app.init();
  
  // Для отладки в консоли
  console.log('=== Глобальные команды для отладки ===');
  console.log('app.reload() - перезагрузить приложение');
  console.log('app.destroy() - уничтожить приложение');
  console.log('app.model - доступ к модели данных');
  console.log('app.dashboardPresenter - доступ к презентеру');
  console.log('app.sidebar - доступ к сайдбару');
});