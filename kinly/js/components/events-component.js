import { AbstractComponent } from '../framework/view/abstract-component.js';

export class EventsComponent extends AbstractComponent {
  constructor(events = [], onEdit, onDelete) {
    super();
    this.events = events;
    this.onEdit = onEdit;
    this.onDelete = onDelete;
  }

  getTemplate() {
    if (this.events.length === 0) {
      return `
        <div class="no-data">
          <i class="fas fa-calendar-plus"></i>
          <p>Нет предстоящих событий</p>
          <small>Добавьте визит к ветеринару или прогулку</small>
        </div>
      `;
    }

    return `
      <div class="events-grid">
        ${this.events.map(event => this._createEventCard(event)).join('')}
      </div>
    `;
  }

  _createEventCard(event) {
    const eventDate = new Date(event.startDate);
    const now = new Date();
    const isToday = eventDate.toDateString() === now.toDateString();
    
    let formattedDate;
    if (isToday) {
      // Для сегодняшних событий показываем только время
      formattedDate = eventDate.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
      });
      formattedDate = `Сегодня, ${formattedDate}`;
    } else {
      // Для будущих событий показываем дату и время
      formattedDate = eventDate.toLocaleDateString('ru-RU', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    const icons = {
      vet: 'fa-stethoscope',
      walk: 'fa-walking',
      vaccine: 'fa-syringe',
      grooming: 'fa-cut',
      other: 'fa-calendar-alt'
    };

    const icon = icons[event.type] || 'fa-calendar';

    return `
      <div class="event-card" data-id="${event.id}">
        <div class="event-icon ${event.type}">
          <i class="fas ${icon}"></i>
        </div>
        <div class="event-content">
          <h4>${event.title}</h4>
          <p class="event-description">${event.description || 'Без описания'}</p>
          <div class="event-details">
            <span class="event-date ${isToday ? 'today' : ''}">
              <i class="far fa-clock"></i> ${formattedDate}
            </span>
            ${event.location ? `<span class="event-location"><i class="fas fa-map-marker-alt"></i> ${event.location}</span>` : ''}
          </div>
        </div>
        <div class="event-card-actions">
          <button class="btn-icon btn-edit" data-action="edit" data-id="${event.id}" title="Редактировать">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn-icon btn-delete" data-action="delete" data-id="${event.id}" title="Удалить">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  }

  afterRender() {
    const element = this.getElement();
    
    // Обработчики для редактирования
    element.querySelectorAll('[data-action="edit"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const eventId = e.currentTarget.dataset.id;
        console.log('Edit button clicked for event:', eventId);
        if (eventId && this.onEdit) {
          this.onEdit(eventId);
        }
      });
    });

    // Обработчики для удаления
    element.querySelectorAll('[data-action="delete"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const eventId = e.currentTarget.dataset.id;
        console.log('Delete button clicked for event:', eventId);
        if (eventId && this.onDelete) {
          this.onDelete(eventId);
        }
      });
    });

    // Также можно кликать на всю карточку для редактирования
    element.querySelectorAll('.event-card').forEach(card => {
      card.addEventListener('click', (e) => {
        // Не срабатывает при клике на кнопки действий
        if (!e.target.closest('.event-card-actions')) {
          const eventId = card.dataset.id;
          console.log('Event card clicked:', eventId);
          if (eventId && this.onEdit) {
            this.onEdit(eventId);
          }
        }
      });
    });
  }
}