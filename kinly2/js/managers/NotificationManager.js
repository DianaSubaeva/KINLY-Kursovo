class NotificationManager {
    constructor(app) {
        this.app = app;
        this.notificationContainer = document.getElementById('notification-container');
        this.notifications = [];
        
        // Инициализация тестовых уведомлений
        this.showInitialNotifications();
    }
    
    showInitialNotifications() {
        // Показать начальные уведомления
        setTimeout(() => {
            this.showNotification('Добро пожаловать в KINLY!', 'info');
        }, 1000);
        
        setTimeout(() => {
            this.showNotification('Не забудьте проверить здоровье питомца', 'warning');
        }, 3000);
    }
    
    showNotification(message, type = 'info') {
        const notificationId = 'notification-' + Date.now();
        const icon = this.getNotificationIcon(type);
        
        const notificationHTML = `
            <div class="notification-item ${type}" id="${notificationId}">
                <div class="notification-icon ${type}">
                    <i class="fas fa-${icon}"></i>
                </div>
                <div class="notification-content">
                    <h4>${this.getNotificationTitle(type)}</h4>
                    <p>${message}</p>
                </div>
                <button class="notification-close" data-notification-id="${notificationId}">&times;</button>
            </div>
        `;
        
        this.notificationContainer.insertAdjacentHTML('beforeend', notificationHTML);
        
        const notification = document.getElementById(notificationId);
        const closeBtn = notification.querySelector('.notification-close');
        
        closeBtn.addEventListener('click', () => {
            this.removeNotification(notificationId);
        });
        
        // Автоматическое удаление через 5 секунд
        setTimeout(() => {
            this.removeNotification(notificationId);
        }, 5000);
        
        this.notifications.push(notificationId);
        
        // Обновляем бейдж
        this.updateNotificationBadge();
    }
    
    removeNotification(notificationId) {
        const notification = document.getElementById(notificationId);
        if (notification) {
            // Добавляем анимацию закрытия
            notification.classList.add('hiding');
            
            setTimeout(() => {
                notification.remove();
                this.notifications = this.notifications.filter(id => id !== notificationId);
                this.updateNotificationBadge();
            }, 300);
        }
    }
    
    updateNotificationBadge() {
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            // Здесь можно обновить количество уведомлений
            // Пока просто скроем, если уведомлений нет
            if (this.notifications.length === 0) {
                badge.style.display = 'none';
            } else {
                badge.style.display = 'flex';
                badge.textContent = this.notifications.length > 9 ? '9+' : this.notifications.length;
            }
        }
    }
    
    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            warning: 'exclamation-triangle',
            error: 'times-circle',
            info: 'info-circle'
        };
        
        return icons[type] || 'info-circle';
    }
    
    getNotificationTitle(type) {
        const titles = {
            success: 'Успешно',
            warning: 'Внимание',
            error: 'Ошибка',
            info: 'Информация'
        };
        
        return titles[type] || 'Уведомление';
    }
    
    showNotifications() {
        // Показ списка всех уведомлений
        this.showNotification('У вас 2 непрочитанных напоминания', 'info');
    }
}