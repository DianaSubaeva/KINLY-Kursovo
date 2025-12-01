import { AbstractComponent } from '../framework/view/abstract-component.js';

export class CareJournalComponent extends AbstractComponent {
  constructor(careActivities) {
    super();
    this.careActivities = careActivities;
  }

  getTemplate() {
    if (this.careActivities.length === 0) {
      return `
        <div class="care-journal">
          <div class="no-data">
            <i class="fas fa-hands-helping"></i>
            <p>Нет записей об уходе</p>
            <small>Добавьте первую процедуру</small>
          </div>
        </div>
      `;
    }

    // Группируем по датам
    const groupedByDate = this._groupByDate(this.careActivities);

    return `
      <div class="care-journal">
        <div class="care-timeline">
          ${Object.entries(groupedByDate).map(([date, activities]) => 
            this._createCareEntry(date, activities)
          ).join('')}
        </div>
      </div>
    `;
  }

  _groupByDate(activities) {
    return activities.reduce((groups, activity) => {
      const date = new Date(activity.careDate).toLocaleDateString('ru-RU');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(activity);
      return groups;
    }, {});
  }

  _createCareEntry(date, activities) {
    const isToday = new Date(date).toDateString() === new Date().toDateString();
    const displayDate = isToday ? 'Сегодня' : date;

    return `
      <div class="care-entry">
        <div class="care-date">${displayDate}</div>
        <div class="care-items">
          ${activities.map(activity => this._createCareItem(activity)).join('')}
        </div>
      </div>
    `;
  }

  _createCareItem(activity) {
    const iconMap = {
      'grooming': 'fas fa-cut',
      'bath': 'fas fa-bath',
      'nail_trim': 'fas fa-paw',
      'teeth_cleaning': 'fas fa-tooth',
      'other': 'fas fa-hands-helping'
    };

    const time = new Date(activity.careDate).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });

    return `
      <div class="care-item">
        <div class="care-icon"><i class="${iconMap[activity.careType] || 'fas fa-hands-helping'}"></i></div>
        <div class="care-details">
          <strong>${this._getCareTypeName(activity.careType)}</strong>
          <span>${time}</span>
          <p>${activity.description || 'Без описания'}</p>
        </div>
      </div>
    `;
  }

  _getCareTypeName(type) {
    const names = {
      'grooming': 'Груминг',
      'bath': 'Купание',
      'nail_trim': 'Стрижка когтей',
      'teeth_cleaning': 'Чистка зубов',
      'other': 'Процедура ухода'
    };
    return names[type] || type;
  }
}