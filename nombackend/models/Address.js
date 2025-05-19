const DAL = require('../DAL/mssqlDal');

class Address {
  constructor({ addressId, streetName, suite, city, state, zipCode }) {
    this.addressId = addressId;
    this.streetName = streetName;
    this.suite = suite;
    this.city = city;
    this.state = state;
    this.zipCode = zipCode;
  }

  // Getters & Setters
  getAddressId() { return this.addressId; }
  setAddressId(id) { this.addressId = id; }

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


  // CRUD Methods (UML naming)
  static async getAll() {
    const query = 'SELECT * FROM Addresses';
    const rows = await DAL.executeQuery(query);
    return rows.map(r => new Address(r));
  }

  static async get(addressId) {
    const query = 'SELECT * FROM Addresses WHERE addressId = @addressId';
    const params = { addressId };
    const rows = await DAL.executeQuery(query, params);
    return rows.length ? new Address(rows[0]) : null;
  }

  static async getFromAddress({ streetName, suite, city, state, zipCode }) {
    const query = 'SELECT * FROM Addresses WHERE streetName = @streetName AND suite = @suite AND city = @city AND state = @state AND zipCode = @zipCode';
    const params = { streetName, suite, city, state, zipCode };
    const rows = await DAL.executeQuery(query, params);
    return rows.length ? new Address(rows[0]) : null;
  }

  static async create({ streetName, suite, city, state, zipCode }) {
    const query = 'INSERT INTO Addresses (streetName, suite, city, state, zipCode) VALUES (@streetName, @suite, @city, @state, @zipCode)';
    const params = { streetName, suite, city, state, zipCode };
    const row = await DAL.executeQuery(query, params);
    return new Address(row);
  }

  static async update({ addressId, streetName, suite, city, state, zipCode }) {
    const query = 'UPDATE Addresses SET streetName = @streetName, suite = @suite, city = @city, state = @state, zipCode = @zipCode WHERE addressId = @addressId';
    const params = { addressId, streetName, suite, city, state, zipCode };
    const row = await DAL.executeQuery(query, params);
    return new Address(row);
  }

  static async delete({ addressId }) {
    const query = 'DELETE FROM Addresses WHERE addressId = @addressId';
    const params = { addressId };
    await DAL.executeQuery(query, params);
    return { addressId };
  }
}

module.exports = Address;