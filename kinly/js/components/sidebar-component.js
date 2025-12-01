import { AbstractComponent } from '../framework/view/abstract-component.js';

export class SidebarComponent extends AbstractComponent {
  constructor() {
    super();
    this._callbacks = {};
  }

  getTemplate() {
    return `
      <aside class="sidebar">
        <div class="logo-section">
          <div class="logo">
            <i class="fas fa-paw"></i>
          </div>
          <h1>KINLY</h1>
        </div>

        <nav class="main-nav">
          <div class="nav-section">
            <h3>Мои питомцы</h3>
            <div class="pets-list" id="petsList">
              <!-- Питомцы будут добавлены динамически -->
            </div>
            <button class="add-pet-btn" id="addPetBtn" type="button">
              <span class="btn-icon"><i class="fas fa-plus"></i></span>
              Добавить питомца
            </button>
          </div>

          <div class="nav-section">
            <h3>Навигация</h3>
            <div class="nav-links">
              <button class="nav-link active" data-section="обзор" type="button">
                <span class="nav-icon"><i class="fas fa-chart-bar"></i></span>
                <span>Обзор</span>
              </button>
              <button class="nav-link" data-section="здоровье" type="button">
                <span class="nav-icon"><i class="fas fa-heartbeat"></i></span>
                <span>Здоровье</span>
              </button>
              <button class="nav-link" data-section="уход" type="button">
                <span class="nav-icon"><i class="fas fa-shield-alt"></i></span>
                <span>Уход</span>
              </button>
              <button class="nav-link" data-section="питание" type="button">
                <span class="nav-icon"><i class="fas fa-utensils"></i></span>
                <span>Питание</span>
              </button>
              <button class="nav-link" data-section="галерея" type="button">
                <span class="nav-icon"><i class="fas fa-images"></i></span>
                <span>Галерея</span>
              </button>
              <button class="nav-link" data-section="напоминания" type="button">
                <span class="nav-icon"><i class="fas fa-bell"></i></span>
                <span>Напоминания</span>
              </button>
            </div>
          </div>
        </nav>

        <button class="user-section" id="userProfileBtn" type="button">
          <div class="user-avatar" id="userAvatar">Д</div>
          <div class="user-info">
            <strong id="userName">Субаева Диана</strong>
            <span id="userRole">Владелец питомцев</span>
          </div>
        </button>
      </aside>
    `;
  }

  afterRender() {
    console.log('SidebarComponent afterRender called');
    this._setupEventListeners();
  }

  _setupEventListeners() {
    console.log('Setting up sidebar event listeners');
    
    // 1. Кнопка добавления питомца
    const addPetBtn = this.getElement().querySelector('#addPetBtn');
    if (addPetBtn) {
      console.log('Add pet button found, adding click listener');
      // Удаляем старые обработчики
      addPetBtn.replaceWith(addPetBtn.cloneNode(true));
      const newAddPetBtn = this.getElement().querySelector('#addPetBtn');
      
      newAddPetBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('✅ Add pet button clicked!');
        if (this._callbacks.addPet) {
          console.log('Calling addPet callback');
          this._callbacks.addPet();
        } else {
          console.error('❌ addPet callback is not set!');
        }
      });
    } else {
      console.error('❌ Add pet button not found!');
    }

    // 2. Кнопка профиля пользователя
    const profileBtn = this.getElement().querySelector('#userProfileBtn');
    if (profileBtn) {
      console.log('Profile button found, adding click listener');
      profileBtn.replaceWith(profileBtn.cloneNode(true));
      const newProfileBtn = this.getElement().querySelector('#userProfileBtn');
      
      newProfileBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('✅ Profile button clicked!');
        if (this._callbacks.profile) {
          console.log('Calling profile callback');
          this._callbacks.profile();
        } else {
          console.error('❌ profile callback is not set!');
        }
      });
    }

    // 3. Кнопки навигации
    console.log('Setting up navigation buttons');
    const navLinks = this.getElement().querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.replaceWith(link.cloneNode(true));
    });
    
    // После клонирования нужно получить новые элементы
    const newNavLinks = this.getElement().querySelectorAll('.nav-link');
    newNavLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const section = link.dataset.section;
        console.log(`✅ Navigation clicked: ${section}`);
        
        // Удаляем active у всех ссылок
        newNavLinks.forEach(l => l.classList.remove('active'));
        // Добавляем active текущей
        link.classList.add('active');
        
        if (this._callbacks.pageChange) {
          console.log(`Calling pageChange callback for section: ${section}`);
          this._callbacks.pageChange(section);
        } else {
          console.error('❌ pageChange callback is not set!');
        }
      });
    });
    
    console.log('All sidebar event listeners set up');
  }

  updateUserProfile(profile) {
    console.log('SidebarComponent.updateUserProfile called with:', profile);
    
    const avatar = this.getElement().querySelector('#userAvatar');
    const name = this.getElement().querySelector('#userName');
    const role = this.getElement().querySelector('#userRole');
    
    if (avatar && profile.avatar) {
      console.log('Updating avatar to:', profile.avatar);
      avatar.textContent = profile.avatar;
    }
    
    if (name && profile.firstName && profile.lastName) {
      const fullName = `${profile.lastName} ${profile.firstName}`;
      console.log('Updating name to:', fullName);
      name.textContent = fullName;
    }
    
    if (role && profile.role) {
      console.log('Updating role to:', profile.role);
      role.textContent = profile.role;
    }
  }

  updatePetsList(pets) {
    console.log('SidebarComponent: updatePetsList called with', pets.length, 'pets');
    
    const petsList = this.getElement().querySelector('#petsList');
    if (!petsList) {
      console.error('❌ petsList element not found!');
      return;
    }

    // Очищаем список
    petsList.innerHTML = '';
    
    // Добавляем каждого питомца
    pets.forEach(pet => {
      console.log('Creating pet item for:', pet.name, 'ID:', pet.id);
      const petItem = this._createPetItem(pet);
      petsList.appendChild(petItem);
    });
    
    // После добавления питомцев, настраиваем обработчики
    this._setupPetListeners();
    
    console.log('Pets list updated successfully');
  }

  _createPetItem(pet) {
    const element = document.createElement('div');
    element.className = 'pet-item';
    element.dataset.id = pet.id;
    element.dataset.name = pet.name;
    
    const icon = pet.type === 'cat' ? 'fa-cat' : 
                 pet.type === 'dog' ? 'fa-dog' : 
                 pet.type === 'bird' ? 'fa-dove' : 'fa-paw';
    
    element.innerHTML = `
      <div class="pet-avatar">
        <i class="fas ${icon}"></i>
      </div>
      <div class="pet-info">
        <strong>${pet.name}</strong>
        <span>${pet.breed || 'Без породы'}</span>
      </div>
      <button class="btn-icon btn-edit-pet" type="button" title="Редактировать питомца">
        <i class="fas fa-edit"></i>
      </button>
    `;
    
    return element;
  }

  _setupPetListeners() {
    console.log('Setting up pet listeners');
    const petsList = this.getElement().querySelector('#petsList');
    if (!petsList) return;

    const petItems = petsList.querySelectorAll('.pet-item');
    
    petItems.forEach(petItem => {
      const petId = petItem.dataset.id;
      const petName = petItem.dataset.name;
      
      // Обработчик клика на всю карточку питомца (для выбора)
      petItem.addEventListener('click', (e) => {
        // Не срабатывает при клике на кнопку редактирования
        if (!e.target.closest('.btn-edit-pet')) {
          e.preventDefault();
          e.stopPropagation();
          console.log(`✅ Pet selected: ${petName} (ID: ${petId})`);
          
          // Удаляем active у всех питомцев
          petItems.forEach(item => item.classList.remove('active'));
          // Добавляем active текущему
          petItem.classList.add('active');
          
          if (this._callbacks.selectPet) {
            console.log(`Calling selectPet callback for pet: ${petId}`);
            this._callbacks.selectPet(petId);
          } else {
            console.error('❌ selectPet callback is not set!');
          }
        }
      });
      
      // Обработчик для кнопки редактирования
      const editBtn = petItem.querySelector('.btn-edit-pet');
      if (editBtn) {
        editBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log(`✅ Edit pet clicked: ${petName} (ID: ${petId})`);
          if (this._callbacks.editPet) {
            console.log(`Calling editPet callback for pet: ${petId}`);
            this._callbacks.editPet(petId);
          } else {
            console.error('❌ editPet callback is not set!');
          }
        });
      }
    });
  }

  // Методы для установки обработчиков
  setOnAddPetHandler(callback) {
    console.log('SidebarComponent.setOnAddPetHandler called with callback:', typeof callback);
    this._callbacks.addPet = callback;
  }

  setOnEditPetHandler(callback) {
    console.log('SidebarComponent.setOnEditPetHandler called');
    this._callbacks.editPet = callback;
  }

  setOnSelectPetHandler(callback) {
    console.log('SidebarComponent.setOnSelectPetHandler called');
    this._callbacks.selectPet = callback;
  }

  setOnProfileHandler(callback) {
    console.log('SidebarComponent.setOnProfileHandler called');
    this._callbacks.profile = callback;
  }

  setOnPageChangeHandler(callback) {
    console.log('SidebarComponent.setOnPageChangeHandler called');
    this._callbacks.pageChange = callback;
  }
}