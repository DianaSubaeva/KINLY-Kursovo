import { AbstractComponent } from '../framework/view/abstract-component.js';

export class HeaderComponent extends AbstractComponent {
  constructor() {
    super();
    this._callbacks = {};
  }

  getTemplate() {
    const currentDate = new Date().toLocaleDateString('ru-RU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
      <header class="top-bar">
        <div class="breadcrumb">
          <a href="#">Главная</a>
          <span class="breadcrumb-divider">/</span>
          <span class="current">Обзор</span>
        </div>
        <div class="header-actions">
          <div class="date-display">
            <span class="date-icon"><i class="far fa-calendar"></i></span>
            ${currentDate}
          </div>
          <div class="notification" data-action="notifications">
            <span class="notification-icon"><i class="far fa-bell"></i></span>
            <span class="notification-badge">2</span>
          </div>
        </div>
      </header>
    `;
  }

  setOnNotificationHandler(callback) {
    this._callbacks.notifications = callback;
    this.getElement().querySelector('[data-action="notifications"]').addEventListener('click', callback);
  }
}