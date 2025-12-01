import { createElement } from '../framework/render.js';
import { AbstractComponent } from '../framework/view/abstract-component.js';

function createChartTemplate(stats, period) {
  const months = ['Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт'];
  
  return `
    <div class="chart-card">
      <div class="chart-header">
        <h3>Вес по месяцам</h3>
        <div class="chart-controls">
          <button class="control-btn ${period === 'month' ? 'active' : ''}" data-period="month">Месяц</button>
          <button class="control-btn ${period === '3 months' ? 'active' : ''}" data-period="3 months">3 месяца</button>
          <button class="control-btn ${period === 'year' ? 'active' : ''}" data-period="year">Год</button>
          <button class="add-weight-btn" title="Добавить запись веса">
            <i class="fas fa-plus"></i>
          </button>
        </div>
      </div>
      <div class="chart-container">
        <div class="weight-chart">
          ${stats.map((stat, index) => {
            const percentage = ((stat.weight - 4.0) / 1.0) * 100;
            return `
              <div class="chart-point" style="left: ${(index / (stats.length - 1)) * 100}%; bottom: ${percentage}%">
                <span class="chart-value">${stat.weight}кг</span>
              </div>
            `;
          }).join('')}
          <div class="chart-line"></div>
        </div>
        <div class="chart-labels">
          ${months.slice(-stats.length).map(month => `<span>${month}</span>`).join('')}
        </div>
      </div>
      <div class="chart-actions">
        <button class="btn-edit" data-action="edit-chart">Изменить данные</button>
      </div>
    </div>
  `;
}

class ChartComponent extends AbstractComponent {
  #stats = [];
  #period = 'month';
  #onPeriodChange = null;
  #onAddWeight = null;
  #onEditItem = null;

  constructor({ stats, period, onPeriodChange, onAddWeight, onEditItem }) {
    super();
    this.#stats = stats;
    this.#period = period;
    this.#onPeriodChange = onPeriodChange;
    this.#onAddWeight = onAddWeight;
    this.#onEditItem = onEditItem;
  }

  get template() {
    return createChartTemplate(this.#stats, this.#period);
  }

  _setEventListeners() {
    // Периоды графика
    this.element.querySelectorAll('.control-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const period = e.target.getAttribute('data-period');
        this.#onPeriodChange(period);
      });
    });

    // Добавление веса
    this.element.querySelector('.add-weight-btn').addEventListener('click', () => {
      this.#onAddWeight();
    });

    // Редактирование
    this.element.querySelector('.btn-edit').addEventListener('click', () => {
      this.#onEditItem('chart', 'weight-data');
    });
  }

  updateStats(newStats, newPeriod) {
    this.#stats = newStats;
    this.#period = newPeriod;
    this.rerender();
  }

  rerender() {
    const oldElement = this.element;
    const parent = oldElement.parentElement;
    this.removeElement();
    
    const newElement = this.element;
    parent.replaceChild(newElement, oldElement);
    
    this._setEventListeners();
  }
}

export default ChartComponent;