import { createElement } from '../framework/render.js';
import { AbstractComponent } from '../framework/view/abstract-component.js';

function createStatCardTemplate(stat) {
  const icons = {
    health: 'heartbeat',
    weight: 'weight',
    age: 'birthday-cake',
    vaccine: 'syringe'
  };

  return `
    <div class="stat-card">
      <div class="stat-icon"><i class="fas fa-${icons[stat.type]}"></i></div>
      <div class="stat-info">
        <span class="value">${stat.value}</span>
        <span class="label">${stat.label}</span>
      </div>
    </div>
  `;
}

export default class StatCardComponent extends AbstractComponent {
  #stat = null;

  constructor(stat) {
    super();
    this.#stat = stat;
  }

  get template() {
    return createStatCardTemplate(this.#stat);
  }
}