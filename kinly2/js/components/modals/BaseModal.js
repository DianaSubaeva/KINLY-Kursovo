class BaseModal {
    constructor(options) {
        this.options = options;
        this.modalId = 'modal-' + Date.now();
        this.init();
    }
    
    init() {
        this.createModal();
        this.setupEvents();
    }
    
    createModal() {
        const modalHTML = `
            <div class="modal-overlay" id="${this.modalId}">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>${this.options.title}</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-form">
                        ${this.options.content || ''}
                        <div class="form-actions">
                            ${this.options.buttons ? this.options.buttons.map((btn, index) => `
                                <button class="btn btn-${btn.type}" data-btn-index="${index}">${btn.text}</button>
                            `).join('') : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.modalElement = document.createElement('div');
        this.modalElement.innerHTML = modalHTML;
        document.getElementById('modal-container').appendChild(this.modalElement.firstElementChild);
        
        this.modal = document.getElementById(this.modalId);
    }
    
    setupEvents() {
    if (!this.modal) return;
    
    // Закрытие по клику на оверлей
    this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) {
            this.close();
        }
    });
    
    // Закрытие по кнопке
    const closeBtn = this.modal.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            this.close();
        });
    }
    
    // Обработчики для кнопок действий
    if (this.options.buttons) {
        this.options.buttons.forEach((btn, index) => {
            const button = this.modal.querySelector(`[data-btn-index="${index}"]`);
            if (button) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    // Если action - строка 'close', просто закрываем
                    if (btn.action === 'close') {
                        this.close();
                    }
                    // Если action - функция, вызываем ее
                    else if (typeof btn.action === 'function') {
                        const result = btn.action();
                        if (result !== false) {
                            this.close();
                        }
                    }
                    // По умолчанию закрываем
                    else {
                        this.close();
                    }
                });
            }
        });
    }
    
    // Закрытие по Escape
    this.escapeHandler = (e) => {
        if (e.key === 'Escape') {
            this.close();
        }
    };
    document.addEventListener('keydown', this.escapeHandler);
    
    // Блокируем прокрутку страницы
    document.body.classList.add('modal-open');
}
    
    close() {
        if (this.modal) {
            // Анимация закрытия
            this.modal.style.animation = 'fadeOut 0.3s ease forwards';
            const modalContent = this.modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.style.animation = 'slideOut 0.3s ease forwards';
            }
            
            // Удаляем обработчик Escape
            if (this.escapeHandler) {
                document.removeEventListener('keydown', this.escapeHandler);
            }
            
            setTimeout(() => {
                this.modal.remove();
                document.body.classList.remove('modal-open');
            }, 300);
        }
    }
    
    show() {
        if (this.modal) {
            this.modal.style.display = 'flex';
        }
    }
    
    open() {
    this.show();
    return this;
}
    
    hide() {
        if (this.modal) {
            this.modal.style.display = 'none';
        }
    }
}