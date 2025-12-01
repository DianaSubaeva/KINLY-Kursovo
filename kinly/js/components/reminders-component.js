import { createElement } from '../framework/render.js';
import { AbstractComponent } from '../framework/view/abstract-component.js';

function createRemindersTemplate(reminders) {
  return `
    <section class="full-width-section">
      <div class="section-header">
        <h2>Напоминания</h2>
        <p>Предстоящие события и важные даты</p>
      </div>
      <div class="reminders-section">
        <div class="reminders-grid">
          ${reminders.map(reminder => `
            <div class="reminder-card">
              <div class="reminder-icon"><i class="fas fa-${getReminderIcon(reminder.type)}"></i></div>
              <div class="reminder-content">
                <h4>${reminder.title}</h4>
                <p>${reminder.description}</p>
                <div class="reminder-meta">
                  <span class="date">${formatReminderDate(reminder.date)}</span>
                  <span class="days-left">Осталось ${reminder.daysLeft} дней</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function getReminderIcon(type) {
  const icons = {
    'vaccination': 'shield-alt',
    'shopping': 'shopping-cart',
    'grooming': 'cut'
  };
  return icons[type] || 'bell';
}

function formatReminderDate(date) {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

export default class RemindersComponent extends AbstractComponent {
  #reminders = [];

  constructor(reminders) {
    super();
    this.#reminders = reminders;
  }

  get template() {
    return createRemindersTemplate(this.#reminders);
  }
}