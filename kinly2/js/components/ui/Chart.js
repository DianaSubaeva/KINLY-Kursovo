// constants/Chart.js
/**
 * Константы и настройки для графиков
 */
export const CHART_CONFIG = {
    // Настройки графика веса
    WEIGHT_CHART: {
        type: 'line',
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#1f2937',
                    titleColor: '#f9fafb',
                    bodyColor: '#f9fafb',
                    borderColor: '#374151',
                    borderWidth: 1,
                    cornerRadius: 6,
                    displayColors: false,
                    callbacks: {
                        // Форматирование значений в тултипе
                        label: function(context) {
                            let value = context.parsed.y;
                            // Ограничение до 3 знаков после запятой
                            return value.toFixed(3) + ' кг';
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        color: '#6b7280',
                        font: {
                            size: 12
                        }
                    }
                },
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#6b7280',
                        font: {
                            size: 12
                        },
                        // Ограничение до 3 знаков после запятой для меток оси Y
                        callback: function(value) {
                            // Используем toFixed(3) для максимум 3 знаков после запятой
                            return parseFloat(value).toFixed(3) + ' кг';
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            elements: {
                line: {
                    tension: 0.3
                },
                point: {
                    hoverRadius: 8
                }
            }
        }
    },
    
    // Настройки графика активности
    ACTIVITY_CHART: {
        type: 'bar',
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        // Форматирование значений в тултипе для графика активности
                        label: function(context) {
                            let value = context.parsed.y;
                            // Ограничение до 3 знаков после запятой
                            return value.toFixed(3) + '%';
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        // Ограничение до 3 знаков после запятой для меток оси Y
                        callback: function(value) {
                            // Используем toFixed(3) для максимум 3 знаков после запятой
                            return parseFloat(value).toFixed(3) + '%';
                        }
                    }
                }
            }
        }
    },
    
    // Цвета графиков
    COLORS: {
        primary: '#4f46e5',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#3b82f6',
        light: '#f3f4f6',
        dark: '#1f2937'
    },
    
    // Периоды для графиков
    PERIODS: {
        DAY: 'day',
        WEEK: 'week',
        MONTH: 'month',
        QUARTER: 'quarter',
        YEAR: 'year'
    },
    
    // Метки для графиков (по месяцам)
    MONTH_LABELS: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
};

/**
 * Генерация фиктивных данных для графика веса
 * @param {number} baseWeight - Базовый вес
 * @param {string} period - Период (month, quarter, year)
 * @returns {Array} Массив данных
 */
export function generateWeightData(baseWeight = 4.8, period = 'month') {
    const data = [];
    const now = new Date();
    let points = 7;
    
    switch(period) {
        case 'week':
            points = 7;
            break;
        case 'month':
            points = 30;
            break;
        case 'quarter':
            points = 90;
            break;
        case 'year':
            points = 12;
            break;
    }
    
    for (let i = points - 1; i >= 0; i--) {
        let date;
        let weight;
        
        switch(period) {
            case 'year':
                date = new Date(now.getFullYear(), now.getMonth() - i, 1);
                weight = baseWeight + (Math.random() * 0.4 - 0.2);
                break;
            case 'quarter':
            case 'month':
            case 'week':
            default:
                date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
                weight = baseWeight + (Math.random() * 0.2 - 0.1);
                break;
        }
        
        data.push({
            date: date.toISOString().split('T')[0],
            // Ограничиваем до 3 знаков после запятой при генерации данных
            weight: parseFloat(weight.toFixed(3))
        });
    }
    
    return data;
}

/**
 * Форматирование даты для отображения
 * @param {string} dateString - Строка с датой
 * @param {string} period - Период
 * @returns {string} Отформатированная дата
 */
export function formatChartDate(dateString, period = 'month') {
    const date = new Date(dateString);
    
    switch(period) {
        case 'year':
            return CHART_CONFIG.MONTH_LABELS[date.getMonth()];
        case 'quarter':
        case 'month':
            return `${date.getDate()} ${CHART_CONFIG.MONTH_LABELS[date.getMonth()]}`;
        case 'week':
            return ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'][date.getDay()];
        default:
            return date.toLocaleDateString('ru-RU');
    }
}

/**
 * Утилитарная функция для форматирования чисел с максимум 3 знаками после запятой
 * @param {number} value - Число для форматирования
 * @param {string} suffix - Суффикс (например, ' кг', '%')
 * @returns {string} Отформатированная строка
 */
export function formatChartValue(value, suffix = '') {
    // Ограничиваем до 3 знаков после запятой
    return parseFloat(value).toFixed(3) + suffix;
}