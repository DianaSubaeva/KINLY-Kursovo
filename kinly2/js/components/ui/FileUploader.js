// utils/FileUploader.js
class FileUploader {
    constructor(options = {}) {
        this.options = {
            accept: options.accept || '*/*',
            multiple: options.multiple || false,
            maxSize: options.maxSize || 10 * 1024 * 1024, // 10MB по умолчанию
            allowedTypes: options.allowedTypes || [],
            maxFiles: options.maxFiles || 10,
            compression: options.compression || false,
            quality: options.quality || 0.8,
            onProgress: options.onProgress || null,
            onError: options.onError || null,
            ...options
        };
        
        this.files = [];
        this.uploadQueue = [];
        this.isUploading = false;
    }

    /**
     * Открытие диалога выбора файлов
     * @returns {Promise<Array>} Массив выбранных файлов
     */
    openFileDialog() {
        return new Promise((resolve, reject) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = this.options.accept;
            input.multiple = this.options.multiple;
            input.style.display = 'none';
            
            input.addEventListener('change', async (event) => {
                const files = Array.from(event.target.files);
                
                try {
                    const validatedFiles = await this.validateFiles(files);
                    const processedFiles = await this.processFiles(validatedFiles);
                    this.files = processedFiles;
                    
                    resolve(processedFiles);
                } catch (error) {
                    reject(error);
                }
                
                document.body.removeChild(input);
            });
            
            input.addEventListener('cancel', () => {
                document.body.removeChild(input);
                reject(new Error('Выбор файлов отменен'));
            });
            
            document.body.appendChild(input);
            input.click();
        });
    }

    /**
     * Валидация файлов
     * @param {Array<File>} files - Массив файлов для валидации
     * @returns {Promise<Array>} Валидированные файлы
     */
    async validateFiles(files) {
        if (files.length === 0) {
            throw new Error('Файлы не выбраны');
        }
        
        if (!this.options.multiple && files.length > 1) {
            throw new Error('Можно выбрать только один файл');
        }
        
        if (files.length > this.options.maxFiles) {
            throw new Error(`Максимальное количество файлов: ${this.options.maxFiles}`);
        }
        
        const validatedFiles = [];
        
        for (const file of files) {
            // Проверка размера
            if (file.size > this.options.maxSize) {
                const errorMsg = `Файл "${file.name}" слишком большой. Максимальный размер: ${this.formatFileSize(this.options.maxSize)}`;
                this.handleError(new Error(errorMsg), file);
                continue;
            }
            
            // Проверка типа файла
            if (this.options.allowedTypes.length > 0) {
                const fileExtension = file.name.split('.').pop().toLowerCase();
                const mimeType = file.type;
                
                const isTypeValid = this.options.allowedTypes.some(type => {
                    return type.startsWith('.') 
                        ? fileExtension === type.substring(1)
                        : mimeType.startsWith(type.split('/*')[0]);
                });
                
                if (!isTypeValid) {
                    const errorMsg = `Файл "${file.name}" имеет неподдерживаемый формат. Разрешены: ${this.options.allowedTypes.join(', ')}`;
                    this.handleError(new Error(errorMsg), file);
                    continue;
                }
            }
            
            validatedFiles.push(file);
        }
        
        if (validatedFiles.length === 0) {
            throw new Error('Нет валидных файлов для загрузки');
        }
        
        return validatedFiles;
    }

    /**
     * Обработка файлов
     * @param {Array<File>} files - Массив файлов для обработки
     * @returns {Promise<Array>} Обработанные файлы
     */
    async processFiles(files) {
        const processedFiles = [];
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            try {
                let processedFile = file;
                
                // Сжатие изображений, если включено
                if (this.options.compression && file.type.startsWith('image/')) {
                    processedFile = await this.compressImage(file);
                }
                
                // Чтение файла как Data URL
                const dataURL = await this.readFileAsDataURL(processedFile);
                
                processedFiles.push({
                    id: Date.now() + i,
                    file: processedFile,
                    name: processedFile.name,
                    size: processedFile.size,
                    type: processedFile.type,
                    dataURL: dataURL,
                    extension: processedFile.name.split('.').pop().toLowerCase(),
                    uploadDate: new Date().toISOString(),
                    status: 'ready'
                });
                
                // Отправка прогресса
                if (this.options.onProgress) {
                    const progress = Math.round(((i + 1) / files.length) * 100);
                    this.options.onProgress(progress, processedFile.name);
                }
                
            } catch (error) {
                this.handleError(error, file);
            }
        }
        
        return processedFiles;
    }

    /**
     * Чтение файла как Data URL
     * @param {File} file - Файл для чтения
     * @returns {Promise<string>} Data URL
     */
    readFileAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                resolve(event.target.result);
            };
            
            reader.onerror = () => {
                reject(new Error(`Ошибка чтения файла: ${file.name}`));
            };
            
            reader.readAsDataURL(file);
        });
    }

    /**
     * Сжатие изображения
     * @param {File} imageFile - Файл изображения
     * @returns {Promise<File>} Сжатое изображение
     */
    async compressImage(imageFile) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const reader = new FileReader();
            
            reader.onload = (event) => {
                img.src = event.target.result;
                
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // Максимальные размеры
                    const maxWidth = 1920;
                    const maxHeight = 1080;
                    
                    let width = img.width;
                    let height = img.height;
                    
                    // Изменение размера если нужно
                    if (width > maxWidth || height > maxHeight) {
                        const ratio = Math.min(maxWidth / width, maxHeight / height);
                        width = width * ratio;
                        height = height * ratio;
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    canvas.toBlob(
                        (blob) => {
                            if (!blob) {
                                reject(new Error('Ошибка сжатия изображения'));
                                return;
                            }
                            
                            const compressedFile = new File(
                                [blob], 
                                imageFile.name, 
                                { 
                                    type: 'image/jpeg',
                                    lastModified: Date.now()
                                }
                            );
                            
                            resolve(compressedFile);
                        },
                        'image/jpeg',
                        this.options.quality
                    );
                };
                
                img.onerror = () => {
                    reject(new Error('Ошибка загрузки изображения'));
                };
            };
            
            reader.readAsDataURL(imageFile);
        });
    }

    /**
     * Пакетная загрузка файлов
     * @param {Array<File>} files - Массив файлов для загрузки
     * @returns {Promise<Array>} Результаты загрузки
     */
    async uploadFiles(files) {
        this.isUploading = true;
        const results = [];
        
        for (const file of files) {
            try {
                // Здесь можно добавить логику загрузки на сервер
                // Например, через fetch или XMLHttpRequest
                const result = await this.uploadToServer(file);
                results.push({
                    ...file,
                    status: 'uploaded',
                    serverResponse: result
                });
            } catch (error) {
                results.push({
                    ...file,
                    status: 'error',
                    error: error.message
                });
                this.handleError(error, file);
            }
        }
        
        this.isUploading = false;
        return results;
    }

    /**
     * Загрузка файла на сервер (заглушка для расширения)
     * @param {Object} fileData - Данные файла
     * @returns {Promise<Object>} Ответ сервера
     */
    async uploadToServer(fileData) {
        // Это заглушка. В реальном проекте здесь будет fetch запрос
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    id: fileData.id,
                    url: `https://example.com/uploads/${fileData.name}`,
                    uploadedAt: new Date().toISOString()
                });
            }, 1000);
        });
    }

    /**
     * Обработка ошибок
     * @param {Error} error - Объект ошибки
     * @param {File} file - Файл, вызвавший ошибку
     */
    handleError(error, file = null) {
        console.error('FileUploader Error:', error);
        
        if (this.options.onError) {
            this.options.onError(error, file);
        } else {
            // Вывод пользовательского сообщения об ошибке
            this.showErrorMessage(error.message);
        }
    }

    /**
     * Показ сообщения об ошибке
     * @param {string} message - Текст сообщения
     */
    showErrorMessage(message) {
        // Можно заменить на свой UI компонент
        alert(`Ошибка загрузки файла: ${message}`);
    }

    /**
     * Форматирование размера файла
     * @param {number} bytes - Размер в байтах
     * @returns {string} Отформатированный размер
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Получение превью файла
     * @param {Object} fileData - Данные файла
     * @returns {string} HTML для превью
     */
    getFilePreview(fileData) {
        if (fileData.type.startsWith('image/')) {
            return `
                <div class="file-preview image-preview">
                    <img src="${fileData.dataURL}" alt="${fileData.name}" style="max-width: 100%; max-height: 200px;">
                    <div class="file-info">
                        <span class="file-name">${fileData.name}</span>
                        <span class="file-size">${this.formatFileSize(fileData.size)}</span>
                    </div>
                </div>
            `;
        } else if (fileData.type.startsWith('video/')) {
            return `
                <div class="file-preview video-preview">
                    <video controls style="max-width: 100%; max-height: 200px;">
                        <source src="${fileData.dataURL}" type="${fileData.type}">
                    </video>
                    <div class="file-info">
                        <span class="file-name">${fileData.name}</span>
                        <span class="file-size">${this.formatFileSize(fileData.size)}</span>
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="file-preview generic-preview">
                    <i class="fas fa-file" style="font-size: 48px; color: #6b7280;"></i>
                    <div class="file-info">
                        <span class="file-name">${fileData.name}</span>
                        <span class="file-size">${this.formatFileSize(fileData.size)}</span>
                        <span class="file-type">${fileData.type}</span>
                    </div>
                </div>
            `;
        }
    }

    /**
     * Очистка всех файлов
     */
    clearFiles() {
        this.files = [];
        this.uploadQueue = [];
        this.isUploading = false;
    }

    /**
     * Удаление файла по индексу
     * @param {number} index - Индекс файла
     */
    removeFile(index) {
        if (index >= 0 && index < this.files.length) {
            this.files.splice(index, 1);
        }
    }

    /**
     * Получение статистики файлов
     * @returns {Object} Статистика
     */
    getStats() {
        const totalSize = this.files.reduce((sum, file) => sum + file.size, 0);
        const fileTypes = [...new Set(this.files.map(file => file.type))];
        
        return {
            count: this.files.length,
            totalSize: totalSize,
            formattedSize: this.formatFileSize(totalSize),
            types: fileTypes,
            images: this.files.filter(f => f.type.startsWith('image/')).length,
            videos: this.files.filter(f => f.type.startsWith('video/')).length,
            other: this.files.filter(f => !f.type.startsWith('image/') && !f.type.startsWith('video/')).length
        };
    }

    /**
     * Экспорт файлов в формате JSON
     * @returns {string} JSON строка
     */
    exportToJSON() {
        const exportData = {
            files: this.files.map(file => ({
                name: file.name,
                size: file.size,
                type: file.type,
                uploadDate: file.uploadDate,
                dataURL: file.dataURL // Внимание: может быть большим!
            })),
            stats: this.getStats(),
            timestamp: new Date().toISOString()
        };
        
        return JSON.stringify(exportData, null, 2);
    }
}

// Создание фабричного метода для удобного использования
FileUploader.create = (options) => {
    return new FileUploader(options);
};

// Экспорт для использования в разных средах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FileUploader;
} else if (typeof define === 'function' && define.amd) {
    define([], () => FileUploader);
} else {
    window.FileUploader = FileUploader;
}