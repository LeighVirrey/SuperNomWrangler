const DAL = require('../DAL/mssqlDal');

class Address {
  constructor({ address_Id, name_Street, number_Street, suite, city, country, state, zip_Code }) {
    this.address_Id = address_Id;
    this.name_Street = name_Street;
    this.number_Street = number_Street;
    this.suite = suite;
    this.city = city;
    this.country = country;
    this.state = state;
    this.zip_Code = zip_Code;
  }

  // Getters & Setters
  getAddressId() { return this.address_Id; }
  setAddressId(id) { this.address_Id = id; }

  getStreetName() { return this.name_Street; }
  setStreetName(name) { this.name_Street = name; }

  getStreetNumber() { return this.number_Street; }
  setStreetNumber(number) { this.number_Street = number; }

  getSuite() { return this.suite; }
  setSuite(suite) { this.suite = suite; }

  getCity() { return this.city; }
  setCity(city) { this.city = city; }

  getState() { return this.state; }
  setState(state) { this.state = state; }

  getCountry() { return this.country; }
  setCountry(country) { this.country = country; }

  getZipCode() { return this.zip_Code; }
  setZipCode(zip) { this.zip_Code = zip; }


  // CRUD Methods (UML naming)
  static async getAll() {
    const query = 'SELECT * FROM Address';
    const rows = await DAL.executeQuery(query);
    return rows.map(r => new Address(r));
  }

  static async get(address_Id) {
    const query = 'SELECT * FROM Address WHERE address_Id = @address_Id';
    const params = { address_Id };
    const rows = await DAL.executeQuery(query, params);
    return rows.length ? new Address(rows[0]) : null;
  }

  static async getFromAddress({ name_Street, number_Street, suite, city, state, zip_Code, country }) {
    const query = 'SELECT * FROM Address WHERE name_Street = @name_Street AND number_Street = @number_Street AND suite = @suite AND city = @city AND state = @state AND zip_Code = @zip_Code AND country = @country';
    const params = { name_Street, number_Street, suite, city, state, zip_Code, country };
    const rows = await DAL.executeQuery(query, params);
    return rows.length ? new Address(rows[0]) : null;
  }

  static async create({ name_Street, number_Street, suite, city, state, zip_Code, country }) {
    const query = 'INSERT INTO Address (name_Street, number_Street, suite, city, state, zip_Code, country) VALUES (@name_Street, @number_Street, @suite, @city, @state, @zip_Code, @country)';
    const params = { name_Street, number_Street, suite, city, state, zip_Code, country };
    await DAL.executeQuery(query, params);
    return new Address(name_Street, number_Street, suite, city, state, zip_Code, country);
  }

  static async update({ address_Id, name_Street, number_Street, suite, city, state, zip_Code, country }) {
    const query = 'UPDATE Address SET name_Street = @name_Street, number_Street = @number_Street, suite = @suite, city = @city, state = @state, zip_Code = @zip_Code, country = @country WHERE address_Id = @address_Id';
    const params = { address_Id, name_Street, number_Street, suite, city, state, zip_Code, country };
    await DAL.executeQuery(query, params);
    return new Address(name_Street, number_Street, suite, city, state, zip_Code, country);
  }

  static async delete( address_Id ) {
    const query = 'DELETE FROM Address WHERE address_Id = @address_Id';
    const params = { address_Id };
    await DAL.executeQuery(query, params);
    return { address_Id };
  }
}

module.exports = Address;