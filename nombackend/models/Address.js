import * as DAL from '../dal';

export default class Address {
  constructor({ addressID, streetName, suite, city, state, zipCode, createdAt }) {
    this.addressID = addressID;
    this.streetName = streetName;
    this.suite = suite;
    this.city = city;
    this.state = state;
    this.zipCode = zipCode;
    this.createdAt = createdAt ? new Date(createdAt) : new Date();
  }

  // Getters & Setters
  getAddressID() { return this.addressID; }
  setAddressID(id) { this.addressID = id; }

  getStreetName() { return this.streetName; }
  setStreetName(name) { this.streetName = name; }

  getSuite() { return this.suite; }
  setSuite(suite) { this.suite = suite; }

  getCity() { return this.city; }
  setCity(city) { this.city = city; }

  getState() { return this.state; }
  setState(state) { this.state = state; }

  getZipCode() { return this.zipCode; }
  setZipCode(zip) { this.zipCode = zip; }

  getCreatedAt() { return this.createdAt; }
  setCreatedAt(date) { this.createdAt = new Date(date); }

  // CRUD Methods
  static async getAll() {
    const rows = await DAL.getAllAddresses();
    return rows.map(r => new Address(r));
  }

  static async get(addressID) {
    const row = await DAL.getAddressByID(addressID);
    return new Address(row);
  }

  static async create({ streetName, suite, city, state, zipCode }) {
    const row = await DAL.createAddress({ streetName, suite, city, state, zipCode });
    return new Address(row);
  }

  async update({ streetName, suite, city, state, zipCode }) {
    const row = await DAL.updateAddress(this.addressID, { streetName, suite, city, state, zipCode });
    Object.assign(this, {
      streetName: row.streetName,
      suite: row.suite,
      city: row.city,
      state: row.state,
      zipCode: row.zipCode
    });
    return this;
  }

  async delete() {
    await DAL.deleteAddress(this.addressID);
  }
}

