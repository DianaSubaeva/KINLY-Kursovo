export class Pet {
  constructor(data) {
    this.id = data.id || Date.now().toString();
    this.name = data.name;
    this.type = data.type;
    this.breed = data.breed;
    this.birthDate = data.birthDate;
    this.gender = data.gender;
    this.notes = data.notes;
    this.weight = data.weight || []; // Это массив весов
    this.petId = data.petId; // ДОБАВИТЬ!
    this.createdAt = data.createdAt || new Date().toISOString();
  }
}