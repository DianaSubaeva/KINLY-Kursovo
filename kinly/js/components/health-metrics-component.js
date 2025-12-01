import { createElement } from '../framework/render.js';
import { AbstractComponent } from '../framework/view/abstract-component.js';

function createHealthMetricsTemplate(metrics) {
  return `
    <div class="chart-card">
      <div class="chart-header">
        <h3>Показатели здоровья</h3>
      </div>
      <div class="health-metrics">
        ${metrics.map(metric => `
          <div class="metric-item">
            <span class="metric-label">${metric.label}</span>
            <div class="metric-bar">
              <div class="metric-fill" style="width: ${metric.value}%"></div>
            </div>
            <span class="metric-value">${metric.value}%</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export default class HealthMetricsComponent extends AbstractComponent {
  #metrics = [];

  constructor(metrics) {
    super();
    this.#metrics = metrics;
  }

  get template() {
    return createHealthMetricsTemplate(this.#metrics);
  }

  updateMetrics(newMetrics) {
    this.#metrics = newMetrics;
    this.rerender();
  }
}