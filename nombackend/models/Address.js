const dal = require('../DAL/mssqlDal');

class Address {
  constructor({ id, street, city, state, zip, created_at }) {
    this.id = id;
    this.street = street;
    this.city = city;
    this.state = state;
    this.zip = zip;
    this.createdAt = new Date(created_at);
  }

  static async create({ street, city, state, zip }) {
    const data = await createResource('/addresses', { street, city, state, zip });
    return new Address(data);
  }

  static async fetchAll() {
    const list = await getResource('/addresses');
    return list.map(a => new Address(a));
  }

  static async fetchById(id) {
    const a = await getResourceById('/addresses', id);
    return new Address(a);
  }

  async update(updates) {
    const data = await updateResource('/addresses', this.id, updates);
    Object.assign(this, updates);
    return this;
  }

  async delete() {
    await deleteResource('/addresses', this.id);
  }
}

module.exports = Address;