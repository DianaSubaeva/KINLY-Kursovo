import { Pet } from './pet.js';
import { Event } from './event.js';
import { Meal } from './meal.js';

export class AppModel {
  constructor() {
    console.log('=== AppModel constructor ===');
    this.pets = JSON.parse(localStorage.getItem('pets')) || [];
    this.events = JSON.parse(localStorage.getItem('events')) || [];
    this.meals = JSON.parse(localStorage.getItem('meals')) || [];
    this.careActivities = JSON.parse(localStorage.getItem('careActivities')) || [];
    this.photos = JSON.parse(localStorage.getItem('photos')) || [];
    this.weights = JSON.parse(localStorage.getItem('weights')) || [];
    
    // Исправлено: всегда берем из localStorage или первый питомец
    this.activePetId = localStorage.getItem('activePetId');
    if (!this.activePetId && this.pets.length > 0) {
      this.activePetId = this.pets[0].id;
      localStorage.setItem('activePetId', this.activePetId);
    }
    
    console.log('Model initialized with:', {
      pets: this.pets.length,
      events: this.events.length,
      meals: this.meals.length,
      activePetId: this.activePetId
    });
    console.log('=== End AppModel constructor ===');
  }

  // ============ PETS ============
  getPets() {
    console.log('AppModel.getPets() called, returning', this.pets.length, 'pets');
    return this.pets;
  }

  addPet(petData) {
    console.log('AppModel.addPet() called with:', petData);
    const pet = new Pet({
      ...petData,
      id: Date.now().toString()
    });
    this.pets.push(pet);
    
    // Если это первый питомец, делаем его активным
    if (this.pets.length === 1) {
      this.activePetId = pet.id;
      localStorage.setItem('activePetId', this.activePetId);
    }
    
    this._saveToStorage('pets', this.pets);
    return pet;
  }

  getPetById(id) {
    console.log('AppModel.getPetById() called with id:', id);
    const pet = this.pets.find(p => p.id === id);
    console.log('Found pet:', pet);
    return pet;
  }

  updatePet(id, updates) {
    console.log('AppModel.updatePet() called for id:', id, 'updates:', updates);
    const index = this.pets.findIndex(p => p.id === id);
    if (index !== -1) {
      this.pets[index] = { ...this.pets[index], ...updates };
      this._saveToStorage('pets', this.pets);
      return this.pets[index];
    }
    return null;
  }

  deletePet(id) {
    console.log('AppModel.deletePet() called for id:', id);
    const index = this.pets.findIndex(p => p.id === id);
    if (index !== -1) {
      this.pets.splice(index, 1);
      this._saveToStorage('pets', this.pets);
      
      // Если удалили активного питомца, выбираем нового
      if (id === this.activePetId && this.pets.length > 0) {
        this.activePetId = this.pets[0].id;
        localStorage.setItem('activePetId', this.activePetId);
      }
      return true;
    }
    return false;
  }

  // ============ EVENTS ============
  getEvents() {
    return this.events.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  }

  getEventById(id) {
    console.log('AppModel.getEventById() called with id:', id);
    return this.events.find(e => e.id === id);
  }

  addEvent(eventData) {
    console.log('=== AppModel.addEvent START ===');
    console.log('eventData:', eventData);
    console.log('activePetId:', this.activePetId);
    
    try {
      // Исправлено: Проверяем, что petId есть в данных или устанавливаем
      if (!eventData.petId && this.activePetId) {
        eventData.petId = this.activePetId;
        console.log('Setting petId from activePetId:', eventData.petId);
      }
      
      const event = new Event({
        ...eventData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      });
      
      console.log('Created event:', event);
      
      this.events.push(event);
      console.log('Events count after push:', this.events.length);
      
      this._saveToStorage('events', this.events);
      
      // Проверяем сохранение
      const stored = JSON.parse(localStorage.getItem('events') || '[]');
      console.log('Stored in localStorage:', stored.length);
      console.log('Last stored event:', stored[stored.length - 1]);
      
      console.log('=== AppModel.addEvent END ===');
      return event;
    } catch (error) {
      console.error('Error in addEvent:', error);
      throw error;
    }
  }

  getUpcomingEvents() {
    console.log('=== AppModel.getUpcomingEvents() DEBUG START ===');
    console.log('Active pet ID in model:', this.activePetId);
    console.log('Total events count:', this.events.length);
    
    if (!this.activePetId) {
      console.log('No active pet, returning empty array');
      console.log('=== AppModel.getUpcomingEvents() DEBUG END ===');
      return [];
    }
    
    const petId = this.activePetId;
    const now = new Date();
    console.log('Current date/time:', now);
    console.log('Current date (toDateString):', now.toDateString());
    
    // Получаем события для активного питомца
    const petEvents = this.getEventsByPet(petId);
    console.log('Events for active pet:', petEvents.length);
    
    // Фильтруем: показываем события на сегодня ИЛИ в будущем
    const upcoming = petEvents.filter(event => {
      const eventDate = new Date(event.startDate);
      const eventDay = eventDate.toDateString();
      const today = now.toDateString();
      
      // Событие сегодня или в будущем
      const isTodayOrFuture = eventDay === today || eventDate >= now;
      console.log(`Event ${event.id}: date=${eventDate}, today=${today}, isTodayOrFuture=${isTodayOrFuture}`);
      
      return isTodayOrFuture;
    });
    
    // Сортируем по дате
    upcoming.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    
    console.log('Upcoming events before limit:', upcoming.length);
    const result = upcoming.slice(0, 4);
    console.log('Upcoming events after limit:', result.length);
    console.log('Result:', result);
    
    console.log('=== AppModel.getUpcomingEvents() DEBUG END ===');
    return result;
  }

  updateEvent(id, updates) {
    console.log('AppModel.updateEvent() called for id:', id, 'updates:', updates);
    const index = this.events.findIndex(e => e.id === id);
    if (index !== -1) {
      this.events[index] = { ...this.events[index], ...updates };
      this._saveToStorage('events', this.events);
      return this.events[index];
    }
    return null;
  }

  deleteEvent(id) {
    console.log('AppModel.deleteEvent() called for id:', id);
    const index = this.events.findIndex(e => e.id === id);
    if (index !== -1) {
      this.events.splice(index, 1);
      this._saveToStorage('events', this.events);
      return true;
    }
    return false;
  }

  // ============ MEALS ============
  getMeals() {
    return this.meals.sort((a, b) => a.feedingTime.localeCompare(b.feedingTime));
  }

  getMealById(id) {
    console.log('AppModel.getMealById() called with id:', id);
    return this.meals.find(m => m.id === id);
  }

  addMeal(mealData) {
    console.log('=== AppModel.addMeal START ===');
    console.log('mealData:', mealData);
    console.log('activePetId:', this.activePetId);
    
    try {
      const meal = new Meal({
        ...mealData,
        id: Date.now().toString(),
        petId: this.activePetId,
        createdAt: new Date().toISOString()
      });
      
      console.log('Created meal:', meal);
      
      this.meals.push(meal);
      console.log('Meals count after push:', this.meals.length);
      
      this._saveToStorage('meals', this.meals);
      
      const stored = JSON.parse(localStorage.getItem('meals') || '[]');
      console.log('Stored in localStorage:', stored.length);
      
      console.log('=== AppModel.addMeal END ===');
      return meal;
    } catch (error) {
      console.error('Error in addMeal:', error);
      throw error;
    }
  }

  getTodayMeals() {
    const petId = this.activePetId;
    const today = new Date().toDateString();
    return this.getMealsByPet(petId)
      .filter(meal => {
        const mealDate = new Date(meal.createdAt).toDateString();
        return mealDate === today;
      });
  }

  updateMeal(id, updates) {
    console.log('AppModel.updateMeal() called for id:', id, 'updates:', updates);
    const index = this.meals.findIndex(m => m.id === id);
    if (index !== -1) {
      this.meals[index] = { ...this.meals[index], ...updates };
      this._saveToStorage('meals', this.meals);
      return this.meals[index];
    }
    return null;
  }

  deleteMeal(id) {
    console.log('AppModel.deleteMeal() called for id:', id);
    const index = this.meals.findIndex(m => m.id === id);
    if (index !== -1) {
      this.meals.splice(index, 1);
      this._saveToStorage('meals', this.meals);
      return true;
    }
    return false;
  }

  // ============ CARE ACTIVITIES ============
  getCareActivities() {
    return this.careActivities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getCareActivityById(id) {
    console.log('AppModel.getCareActivityById() called with id:', id);
    return this.careActivities.find(c => c.id === id);
  }

  addCareActivity(careData) {
    console.log('AppModel.addCareActivity() called with:', careData);
    const care = { 
      id: Date.now().toString(), 
      ...careData, 
      petId: this.activePetId,
      createdAt: new Date().toISOString() 
    };
    this.careActivities.push(care);
    this._saveToStorage('careActivities', this.careActivities);
    return care;
  }

  getRecentCareActivities() {
    const petId = this.activePetId;
    return this.getCareActivitiesByPet(petId).slice(0, 6);
  }

  updateCareActivity(id, updates) {
    console.log('AppModel.updateCareActivity() called for id:', id, 'updates:', updates);
    const index = this.careActivities.findIndex(c => c.id === id);
    if (index !== -1) {
      this.careActivities[index] = { ...this.careActivities[index], ...updates };
      this._saveToStorage('careActivities', this.careActivities);
      return this.careActivities[index];
    }
    return null;
  }

  deleteCareActivity(id) {
    console.log('AppModel.deleteCareActivity() called for id:', id);
    const index = this.careActivities.findIndex(c => c.id === id);
    if (index !== -1) {
      this.careActivities.splice(index, 1);
      this._saveToStorage('careActivities', this.careActivities);
      return true;
    }
    return false;
  }

  // ============ PHOTOS ============
  getPhotos() {
    return this.photos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getPhotoById(id) {
    console.log('AppModel.getPhotoById() called with id:', id);
    return this.photos.find(p => p.id === id);
  }

  addPhoto(photoData) {
    console.log('=== AppModel.addPhoto START ===');
    console.log('photoData:', photoData);
    console.log('activePetId:', this.activePetId);
    
    try {
      const photo = { 
        id: Date.now().toString(), 
        ...photoData, 
        petId: this.activePetId,
        createdAt: new Date().toISOString() 
      };
      
      console.log('Created photo:', photo);
      
      this.photos.push(photo);
      console.log('Photos count after push:', this.photos.length);
      
      this._saveToStorage('photos', this.photos);
      
      const stored = JSON.parse(localStorage.getItem('photos') || '[]');
      console.log('Stored in localStorage:', stored.length);
      
      console.log('=== AppModel.addPhoto END ===');
      return photo;
    } catch (error) {
      console.error('Error in addPhoto:', error);
      throw error;
    }
  }

  getRecentPhotos() {
    const petId = this.activePetId;
    return this.getPhotosByPet(petId).slice(0, 6);
  }

  updatePhoto(id, updates) {
    console.log('AppModel.updatePhoto() called for id:', id, 'updates:', updates);
    const index = this.photos.findIndex(p => p.id === id);
    if (index !== -1) {
      this.photos[index] = { ...this.photos[index], ...updates };
      this._saveToStorage('photos', this.photos);
      return this.photos[index];
    }
    return null;
  }

  deletePhoto(id) {
    console.log('AppModel.deletePhoto() called for id:', id);
    const index = this.photos.findIndex(p => p.id === id);
    if (index !== -1) {
      this.photos.splice(index, 1);
      this._saveToStorage('photos', this.photos);
      return true;
    }
    return false;
  }

  // ============ WEIGHTS ============
  getWeights() {
    return this.weights.sort((a, b) => new Date(a.measurementDate) - new Date(b.measurementDate));
  }

  getWeightById(id) {
    console.log('AppModel.getWeightById() called with id:', id);
    return this.weights.find(w => w.id === id);
  }

  addWeight(weightData) {
    console.log('AppModel.addWeight() called with:', weightData);
    const weight = { 
      id: Date.now().toString(), 
      ...weightData, 
      petId: this.activePetId,
      createdAt: new Date().toISOString() 
    };
    this.weights.push(weight);
    this._saveToStorage('weights', this.weights);
    return weight;
  }

  getLatestWeight() {
    const petId = this.activePetId;
    const weights = this.getWeightsByPet(petId);
    return weights.length > 0 ? weights[weights.length - 1] : null;
  }

  updateWeight(id, updates) {
    console.log('AppModel.updateWeight() called for id:', id, 'updates:', updates);
    const index = this.weights.findIndex(w => w.id === id);
    if (index !== -1) {
      this.weights[index] = { ...this.weights[index], ...updates };
      this._saveToStorage('weights', this.weights);
      return this.weights[index];
    }
    return null;
  }

  deleteWeight(id) {
    console.log('AppModel.deleteWeight() called for id:', id);
    const index = this.weights.findIndex(w => w.id === id);
    if (index !== -1) {
      this.weights.splice(index, 1);
      this._saveToStorage('weights', this.weights);
      return true;
    }
    return false;
  }
  
  // ============ USER PROFILE ============
  getUserProfile() {
    const stored = JSON.parse(localStorage.getItem('userProfile'));
    return stored || {
      id: 'user-1',
      firstName: 'Диана',
      lastName: 'Субаева',
      email: 'diana@example.com',
      phone: '+7 (999) 123-45-67',
      bio: 'Владелец двух замечательных питомцев - кота Джаспера и собаки Вупи',
      avatar: 'Д',
      role: 'Владелец питомцев',
      createdAt: new Date().toISOString()
    };
  }

  updateUserProfile(updates) {
    console.log('AppModel.updateUserProfile() called with:', updates);
    const currentProfile = this.getUserProfile();
    const updatedProfile = { ...currentProfile, ...updates };
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    return updatedProfile;
  }

  // ============ PET-SPECIFIC METHODS ============
  getActivePet() {
    const pet = this.pets.find(p => p.id === this.activePetId);
    if (!pet && this.pets.length > 0) {
      // Если активный питомец не найден, берем первого
      this.activePetId = this.pets[0].id;
      localStorage.setItem('activePetId', this.activePetId);
      return this.pets[0];
    }
    console.log('AppModel.getActivePet() called, returning:', pet);
    return pet;
  }

  setActivePet(id) {
    console.log('AppModel.setActivePet() called with id:', id);
    this.activePetId = id;
    localStorage.setItem('activePetId', this.activePetId);
  }

  getEventsByPet(petId = this.activePetId) {
    if (!petId) return [];
    return this.events
      .filter(event => event.petId === petId)
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  }

  getMealsByPet(petId = this.activePetId) {
    if (!petId) return [];
    return this.meals
      .filter(meal => meal.petId === petId)
      .sort((a, b) => a.feedingTime.localeCompare(b.feedingTime));
  }

  getCareActivitiesByPet(petId = this.activePetId) {
    if (!petId) return [];
    return this.careActivities
      .filter(care => care.petId === petId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getPhotosByPet(petId = this.activePetId) {
    if (!petId) return [];
    return this.photos
      .filter(photo => photo.petId === petId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getWeightsByPet(petId = this.activePetId) {
    if (!petId) return [];
    return this.weights
      .filter(weight => weight.petId === petId)
      .sort((a, b) => new Date(a.measurementDate) - new Date(b.measurementDate));
  }

  // ============ UTILITIES ============
  _saveToStorage(key, data) {
    console.log('AppModel._saveToStorage() called for key:', key, 'data length:', data.length);
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }
}