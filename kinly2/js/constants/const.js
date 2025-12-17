// Цветовая палитра
const COLORS = {
    PEACH_50: '#fff5f5',
    PEACH_100: '#ffe8e8',
    PEACH_200: '#ffd1d1',
    PEACH_300: '#ffb8b8',
    PEACH_400: '#ff9a9a',
    PEACH_500: '#ff7b7b',
    PEACH_600: '#f56565',
    
    APRICOT_50: '#fffaf0',
    APRICOT_100: '#fff4e6',
    APRICOT_200: '#ffe8cc',
    APRICOT_300: '#ffd8b3',
    APRICOT_400: '#ffc299',
    APRICOT_500: '#ffad80',
    
    TEXT_PRIMARY: '#5a4a42',
    TEXT_SECONDARY: '#8b7d76',
    TEXT_TERTIARY: '#b8aca6',
    
    BACKGROUND: '#fff5f5',
    SURFACE: '#ffffff',
    SURFACE_HOVER: '#ffe8e8',
    BORDER: '#ffd1d1',
    BORDER_LIGHT: '#ffe8e8'
};

// Типы животных
const PET_TYPES = {
    CAT: 'cat',
    DOG: 'dog',
    OTHER: 'other'
};

// Состояния здоровья
const HEALTH_STATUSES = [
    'Отличное',
    'Хорошее',
    'Удовлетворительное',
    'Требуется внимание'
];

// Типы событий
const EVENT_TYPES = {
    MEDICAL: 'medical',
    MEDICATION: 'medication',
    GROOMING: 'grooming',
    BATH: 'bath',
    WALK: 'walk',
    PLAY: 'play'
};

// Типы процедур ухода
const CARE_TYPES = {
    FEEDING: 'feeding',
    WALK: 'walk',
    GROOMING: 'grooming',
    BATH: 'bath',
    NAILS: 'nails',
    TEETH: 'teeth',
    MEDICATION: 'medication',
    PLAY: 'play',
    TRAINING: 'training'
};

// Ключи для localStorage
const STORAGE_KEYS = {
    PET_TRACKER: 'kinly-pet-tracker',
    USER_PROFILE: 'kinly-user-profile',
    CARE_LOG: 'careLog_',
    PHOTOS: 'photos_',
    HEALTH_METRICS: 'healthMetrics_',
    CARE_STATS: 'careStats_'
};

// Названия страниц
const PAGE_NAMES = {
    OVERVIEW: 'overview',
    HEALTH: 'health',
    CARE: 'care',
    NUTRITION: 'nutrition',
    GALLERY: 'gallery',
    REMINDERS: 'reminders'
};

// Типы уведомлений
const NOTIFICATION_TYPES = {
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error',
    INFO: 'info'
};

// Иконки для навигации
const NAV_ICONS = {
    OVERVIEW: 'chart-bar',
    HEALTH: 'heartbeat',
    CARE: 'shield-alt',
    NUTRITION: 'utensils',
    GALLERY: 'images',
    REMINDERS: 'bell'
};

// Рекомендации по питанию
const NUTRITION_RECOMMENDATIONS = {
    CAT: {
        dailyFood: '60-80 г',
        frequency: '2-3 раза в день',
        water: 'Свежая вода всегда в доступе',
        specialNotes: 'Кошки нуждаются в таурине в рационе'
    },
    DOG: {
        dailyFood: '2-3% от веса тела',
        frequency: '1-2 раза в день',
        water: '40-60 мл на кг веса в день',
        specialNotes: 'Собакам нельзя шоколад, виноград, лук'
    },
    OTHER: {
        dailyFood: 'Зависит от вида',
        frequency: 'По рекомендации ветеринара',
        water: 'По потребности',
        specialNotes: 'Проконсультируйтесь с ветеринаром'
    }
};

// Экспортируем все константы
window.KINLY_CONST = {
    COLORS,
    PET_TYPES,
    HEALTH_STATUSES,
    EVENT_TYPES,
    CARE_TYPES,
    STORAGE_KEYS,
    PAGE_NAMES,
    NOTIFICATION_TYPES,
    NAV_ICONS,
    NUTRITION_RECOMMENDATIONS
};