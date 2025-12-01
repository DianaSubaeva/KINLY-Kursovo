import { AbstractComponent } from '../framework/view/abstract-component.js';
import { EventsComponent } from '../components/events-component.js';
import { NutritionComponent } from '../components/nutrition-component.js';
import { CareJournalComponent } from '../components/care-journal-component.js';
import { GalleryComponent } from '../components/gallery-component.js';
import { QuickStatsComponent } from '../components/quick-stats-component.js';

export class DashboardView extends AbstractComponent {
  constructor() {
    super();
    this._callbacks = {};
    this.components = {};
  }

  getTemplate() {
    return `
      <div class="page-content">
        <!-- Раздел 1: Быстрая статистика -->
        <section id="обзор" class="full-width-section dashboard-section">
          <div class="section-header">
            <h2>Общая статистика</h2>
            <p>Основные показатели здоровья вашего питомца</p>
            <button class="btn btn-primary btn-sm" data-action="addWeight">Добавить вес</button>
          </div>
          <div id="quickStatsContainer"></div>
        </section>

        <!-- Раздел 2: Ближайшие события -->
        <section id="здоровье" class="full-width-section dashboard-section">
          <div class="section-header">
            <h2>Ближайшие события</h2>
            <p>Предстоящие визиты и процедуры</p>
            <button class="btn btn-primary btn-sm" data-action="addEvent">Добавить событие</button>
          </div>
          <div id="eventsContainer"></div>
        </section>

        <!-- Раздел 3: Уход -->
        <section id="уход" class="full-width-section dashboard-section">
          <div class="section-header">
            <h2>Журнал ухода</h2>
            <p>История процедур и ухода за питомцем</p>
            <button class="btn btn-primary btn-sm" data-action="addCare">Добавить процедуру</button>
          </div>
          <div id="careJournalContainer"></div>
        </section>

        <!-- Раздел 4: Питание -->
        <section id="питание" class="full-width-section dashboard-section">
          <div class="section-header">
            <h2>Рацион питания</h2>
            <p>Ежедневное меню и график кормления</p>
            <button class="btn btn-primary btn-sm" data-action="addMeal">Добавить кормление</button>
          </div>
          <div id="nutritionContainer"></div>
        </section>

        <!-- Раздел 5: Галерея -->
        <section id="галерея" class="full-width-section dashboard-section">
          <div class="section-header">
            <h2>Галерея</h2>
            <p>Фотографии роста и развития вашего питомца</p>
            <button class="btn btn-primary btn-sm" data-action="addPhoto">Добавить фото</button>
          </div>
          <div id="galleryContainer"></div>
        </section>

        <!-- Раздел 6: Напоминания -->
        <section id="напоминания" class="full-width-section dashboard-section">
          <div class="section-header">
            <h2>Напоминания</h2>
            <p>Предстоящие задачи и напоминания</p>
            <button class="btn btn-primary btn-sm" data-action="addReminder">Добавить напоминание</button>
          </div>
          <div id="remindersContainer"></div>
        </section>
      </div>
    `;
  }

  renderQuickStats(pet, latestWeight) {
    const container = this.getElement().querySelector('#quickStatsContainer');
    if (!container) {
      console.error('Quick stats container not found!');
      return;
    }
    
    if (this.components.quickStats) {
      this.components.quickStats.removeElement();
    }
    
    this.components.quickStats = new QuickStatsComponent(pet, latestWeight);
    container.innerHTML = '';
    container.appendChild(this.components.quickStats.getElement());
    
    console.log('Quick stats rendered:', !!this.components.quickStats.getElement());
  }

  renderEvents(events, onEdit, onDelete) {
    const container = this.getElement().querySelector('#eventsContainer');
    if (!container) {
      console.error('Events container not found!');
      return;
    }
    
    console.log('Rendering events:', events.length);
    
    if (this.components.events) {
      this.components.events.removeElement();
    }
    
    this.components.events = new EventsComponent(events, onEdit, onDelete);
    container.innerHTML = '';
    container.appendChild(this.components.events.getElement());
    this.components.events.afterRender();
    
    console.log('Events grid exists:', container.querySelector('.events-grid') !== null);
    console.log('Events grid children:', container.querySelector('.events-grid')?.children?.length || 0);
  }

  renderNutrition(meals, onEdit, onDelete) {
    const container = this.getElement().querySelector('#nutritionContainer');
    if (!container) {
      console.error('Nutrition container not found!');
      return;
    }
    
    if (this.components.nutrition) {
      this.components.nutrition.removeElement();
    }
    
    this.components.nutrition = new NutritionComponent(meals, onEdit, onDelete);
    container.innerHTML = '';
    container.appendChild(this.components.nutrition.getElement());
    this.components.nutrition.afterRender();
  }

  renderCareJournal(careActivities, onEdit, onDelete) {
    const container = this.getElement().querySelector('#careJournalContainer');
    if (!container) {
      console.error('Care journal container not found!');
      return;
    }
    
    if (this.components.careJournal) {
      this.components.careJournal.removeElement();
    }
    
    this.components.careJournal = new CareJournalComponent(careActivities, onEdit, onDelete);
    container.innerHTML = '';
    container.appendChild(this.components.careJournal.getElement());
    this.components.careJournal.afterRender();
  }

  renderGallery(photos, onEdit, onDelete) {
    const container = this.getElement().querySelector('#galleryContainer');
    if (!container) {
      console.error('Gallery container not found!');
      return;
    }
    
    if (this.components.gallery) {
      this.components.gallery.removeElement();
    }
    
    this.components.gallery = new GalleryComponent(photos, onEdit, onDelete);
    container.innerHTML = '';
    container.appendChild(this.components.gallery.getElement());
    this.components.gallery.afterRender();
  }

  setOnAddEventHandler(callback) {
    this._callbacks.addEvent = callback;
    const element = this.getElement();
    if (!element) {
      console.error('DashboardView element not found');
      return;
    }
    
    const btn = element.querySelector('[data-action="addEvent"]');
    if (btn) {
      // Удаляем старый обработчик если есть
      btn.replaceWith(btn.cloneNode(true));
      const newBtn = element.querySelector('[data-action="addEvent"]');
      newBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Add event button clicked');
        callback();
      });
    } else {
      console.error('Add event button not found');
    }
  }

  setOnAddMealHandler(callback) {
    this._callbacks.addMeal = callback;
    const element = this.getElement();
    if (!element) return;
    
    const btn = element.querySelector('[data-action="addMeal"]');
    if (btn) {
      btn.replaceWith(btn.cloneNode(true));
      const newBtn = element.querySelector('[data-action="addMeal"]');
      newBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Add meal button clicked');
        callback();
      });
    }
  }

  setOnAddCareHandler(callback) {
    this._callbacks.addCare = callback;
    const element = this.getElement();
    if (!element) return;
    
    const btn = element.querySelector('[data-action="addCare"]');
    if (btn) {
      btn.replaceWith(btn.cloneNode(true));
      const newBtn = element.querySelector('[data-action="addCare"]');
      newBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Add care button clicked');
        callback();
      });
    }
  }

  setOnAddPhotoHandler(callback) {
    this._callbacks.addPhoto = callback;
    const element = this.getElement();
    if (!element) return;
    
    const btn = element.querySelector('[data-action="addPhoto"]');
    if (btn) {
      btn.replaceWith(btn.cloneNode(true));
      const newBtn = element.querySelector('[data-action="addPhoto"]');
      newBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Add photo button clicked');
        callback();
      });
    }
  }

  setOnAddWeightHandler(callback) {
    this._callbacks.addWeight = callback;
    const element = this.getElement();
    if (!element) return;
    
    const btn = element.querySelector('[data-action="addWeight"]');
    if (btn) {
      btn.replaceWith(btn.cloneNode(true));
      const newBtn = element.querySelector('[data-action="addWeight"]');
      newBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Add weight button clicked');
        callback();
      });
    }
  }

  setOnAddReminderHandler(callback) {
    this._callbacks.addReminder = callback;
    const element = this.getElement();
    if (!element) return;
    
    const btn = element.querySelector('[data-action="addReminder"]');
    if (btn) {
      btn.replaceWith(btn.cloneNode(true));
      const newBtn = element.querySelector('[data-action="addReminder"]');
      newBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Add reminder button clicked');
        callback();
      });
    }
  }

  afterRender() {
    // Добавляем плавную прокрутку для якорных ссылок
    this.getElement().querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  removeAllComponents() {
    Object.values(this.components).forEach(component => {
      if (component && typeof component.removeElement === 'function') {
        component.removeElement();
      }
    });
    this.components = {};
  }
}