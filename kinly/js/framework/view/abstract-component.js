export class AbstractComponent {
  constructor() {
    if (new.target === AbstractComponent) {
      throw new Error('Can\'t instantiate AbstractComponent, only concrete one.');
    }
    this._element = null;
  }

  getTemplate() {
    throw new Error('Abstract method not implemented: getTemplate');
  }

  getElement() {
    if (!this._element) {
      this._element = this._createElement(this.getTemplate());
    }
    return this._element;
  }

  _createElement(template) {
    const newElement = document.createElement('div');
    newElement.innerHTML = template;
    return newElement.firstElementChild;
  }

  removeElement() {
    this._element = null;
  }

  // Метод для инициализации после рендера
  afterRender() {
    // Может быть переопределен в дочерних классах
  }
}