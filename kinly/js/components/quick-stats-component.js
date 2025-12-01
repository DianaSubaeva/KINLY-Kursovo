import { AbstractComponent } from '../framework/view/abstract-component.js';

export class QuickStatsComponent extends AbstractComponent {
  constructor(pet, latestWeight) {
    super();
    this.pet = pet;
    this.latestWeight = latestWeight;
  }

  getTemplate() {
    const age = this.pet ? this._calculateAge(this.pet.birthDate) : 'Не указан';
    const weight = this.latestWeight ? `${this.latestWeight.weight} кг` : 'Не измерен';

    return `
      <div class="quick-stats">
        <div class="stat-card">
          <div class="stat-icon"><i class="fas fa-heartbeat"></i></div>
          <div class="stat-info">
            <span class="value">Отличное</span>
            <span class="label">Состояние здоровья</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"><i class="fas fa-weight"></i></div>
          <div class="stat-info">
            <span class="value">${weight}</span>
            <span class="label">Текущий вес</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"><i class="fas fa-birthday-cake"></i></div>
          <div class="stat-info">
            <span class="value">${age}</span>
            <span class="label">Возраст</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"><i class="fas fa-syringe"></i></div>
          <div class="stat-info">
            <span class="value">28 дней</span>
            <span class="label">До вакцинации</span>
          </div>
        </div>
      </div>
    `;
  }

  _calculateAge(birthDate) {
    if (!birthDate) return 'Не указан';
    
    const birth = new Date(birthDate);
    const now = new Date();
    const years = now.getFullYear() - birth.getFullYear();
    const months = now.getMonth() - birth.getMonth();
    
    if (years > 0) {
      return `${years} ${this._getYearText(years)}`;
    } else {
      return `${Math.max(months, 1)} ${this._getMonthText(months)}`;
    }
  }

  _getYearText(years) {
    if (years === 1) return 'год';
    if (years >= 2 && years <= 4) return 'года';
    return 'лет';
  }

  _getMonthText(months) {
    if (months === 1) return 'месяц';
    if (months >= 2 && months <= 4) return 'месяца';
    return 'месяцев';
  }
}