import { AbstractComponent } from '../framework/view/abstract-component.js';

export class NutritionComponent extends AbstractComponent {
  constructor(meals = [], onEdit, onDelete) {
    super();
    this.meals = meals;
    this.onEdit = onEdit;
    this.onDelete = onDelete;
  }

  getTemplate() {
    if (this.meals.length === 0) {
      return `
        <div class="no-data">
          <i class="fas fa-utensils"></i>
          <p>Нет записей о кормлении</p>
          <small>Добавьте рацион питания для вашего питомца</small>
        </div>
      `;
    }

    return `
      <div class="nutrition-list">
        ${this.meals.map(meal => this._createMealItem(meal)).join('')}
      </div>
    `;
  }

  _createMealItem(meal) {
    const foodTypes = {
      dry: 'Сухой корм',
      wet: 'Влажный корм',
      natural: 'Натуральный корм',
      treat: 'Лакомство'
    };

    const foodTypeText = foodTypes[meal.foodType] || meal.foodType;

    return `
      <div class="meal-item" data-id="${meal.id}">
        <div class="meal-time">${meal.feedingTime}</div>
        <div class="meal-info">
          <strong>${meal.foodName}</strong>
          <span>${foodTypeText} • ${meal.amount}</span>
        </div>
        <div class="meal-status completed" title="Отметить как выполненное">
          <i class="fas fa-check"></i>
        </div>
        <div class="meal-actions">
          <button class="btn-icon btn-edit" data-action="edit" title="Редактировать">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn-icon btn-delete" data-action="delete" title="Удалить">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  }

  afterRender() {
    // Обработчики для отметки как выполненного
    this.getElement().querySelectorAll('.meal-status').forEach(status => {
      status.addEventListener('click', (e) => {
        e.stopPropagation();
        const mealItem = e.target.closest('.meal-item');
        if (mealItem) {
          status.classList.toggle('completed');
          status.classList.toggle('pending');
        }
      });
    });

    // Обработчики для редактирования
    this.getElement().querySelectorAll('[data-action="edit"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const mealItem = e.target.closest('.meal-item');
        if (mealItem && this.onEdit) {
          this.onEdit(mealItem.dataset.id);
        }
      });
    });

    // Обработчики для удаления
    this.getElement().querySelectorAll('[data-action="delete"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const mealItem = e.target.closest('.meal-item');
        if (mealItem && this.onDelete) {
          this.onDelete(mealItem.dataset.id);
        }
      });
    });
  }
}