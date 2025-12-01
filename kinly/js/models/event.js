export class Event {
  constructor(data) {
    this.id = data.id || Date.now().toString();
    this.type = data.type;
    this.title = data.title;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.location = data.location;
    this.description = data.description;
    this.petId = data.petId; // ДОБАВИТЬ!
    this.createdAt = data.createdAt || new Date().toISOString();
  }
}