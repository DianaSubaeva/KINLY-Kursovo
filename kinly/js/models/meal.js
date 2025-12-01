export class Meal {
  constructor(data) {
    this.id = data.id || Date.now().toString();
    this.foodType = data.foodType;
    this.foodName = data.foodName;
    this.feedingTime = data.feedingTime;
    this.amount = data.amount;
    this.notes = data.notes;
    this.petId = data.petId; // ДОБАВИТЬ!
    this.createdAt = data.createdAt || new Date().toISOString();
  }
}