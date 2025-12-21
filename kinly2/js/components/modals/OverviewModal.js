class OverviewModal {
    constructor(app) {
        this.app = app;
        this.currentOverviewPresenter = null;
        this.editStatModal = null;
        this.eventModal = null;
        this.careModal = null;
    }
    
    setOverviewPresenter(presenter) {
        this.currentOverviewPresenter = presenter;
        this.initSubModals();
    }
    
    initSubModals() {
        if (typeof EditStatModal !== 'undefined' && !this.editStatModal) {
            this.editStatModal = new EditStatModal(this.app, this.currentOverviewPresenter);
        }
        
        if (typeof EventModal !== 'undefined' && !this.eventModal) {
            this.eventModal = new EventModal(this.app, this.currentOverviewPresenter);
        }
        
        if (typeof CareModal !== 'undefined' && !this.careModal) {
            this.careModal = new CareModal(this.app, this.currentOverviewPresenter);
        }
    }
    
    showEditStatModal(stat) {
        if (this.editStatModal) {
            this.editStatModal.show(stat);
        }
    }
    
    showAddEventModal() {
        if (this.eventModal) {
            this.eventModal.showAdd();
        }
    }
    
    showEditEventModal(eventId) {
        if (this.eventModal) {
            this.eventModal.showEdit(eventId);
        }
    }
    
    showAddCareModal() {
        if (this.careModal) {
            this.careModal.showAdd();
        }
    }
    
    showEditCareModal(title) {
        if (this.careModal) {
            this.careModal.showEdit(title);
        }
    }
    
    showEditCareModalById(careItemId) {
        if (this.careModal && typeof this.careModal.showEditById === 'function') {
            this.careModal.showEditById(careItemId);
        } else if (this.careModal) {
            this.careModal.showEdit(`Запись #${careItemId}`);
        }
    }
}