// Framework render utilities
export function render(template, data) {
    return template.replace(/{{\s*(\w+)\s*}}/g, (match, key) => {
        return data[key] !== undefined ? data[key] : '';
    });
}

export function renderList(template, items, dataCallback) {
    return items.map((item, index) => {
        const data = dataCallback ? dataCallback(item, index) : item;
        return render(template, data);
    }).join('');
}

export function createElement(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstChild;
}

export function mountComponent(component, container) {
    if (container && component.render) {
        const element = createElement(component.render());
        container.appendChild(element);
        return element;
    }
    return null;
}

export function updateComponent(component, element) {
    if (element && component.render) {
        const newElement = createElement(component.render());
        element.parentNode.replaceChild(newElement, element);
        return newElement;
    }
    return element;
}