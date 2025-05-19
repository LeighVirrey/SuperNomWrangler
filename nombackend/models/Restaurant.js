const DAL = require('../DAL/mssqlDal');

class Restaurant {
  constructor({ restaurantId, restaurantName, addressId, imgURL, description, priceRange, cuisine, operatingHours, isFlagged }) {
    this.restaurantId = restaurantId;
    this.restaurantName = restaurantName;
    this.addressId = addressId;
    this.imgURL = imgURL;
    this.description = description;
    this.priceRange = priceRange;
    this.cuisine = cuisine;
    this.operatingHours = operatingHours;
    this.isFlagged = isFlagged;
  }

  // Getters & Setters
  getRestaurantId() { return this.restaurantId; }
  setRestaurantId(id) { this.restaurantId = id; }

  getRestaurantName() { return this.restaurantName; }
  setRestaurantName(name) { this.restaurantName = name; }

  getAddressId() { return this.addressId; }
  setAddressId(id) { this.addressId = id; }

  getImgURL() { return this.imgURL; }
  setImgURL(url) { this.imgURL = url; }

  getDescription() { return this.description; }
  setDescription(desc) { this.description = desc; }

  getPriceRange() { return this.priceRange; }
  setPriceRange(range) { this.priceRange = range; }

  getCuisine() { return this.cuisine; }
  setCuisine(cuisine) { this.cuisine = cuisine; }

  getOperatingHours() { return this.operatingHours; }
  setOperatingHours(hours) { this.operatingHours = hours; }

  getIsFlagged() { return this.isFlagged; }
  setIsFlagged(flag) { this.isFlagged = flag; }


  // Relationship Method
  async getAddress() {
    return await Address.get(this.locationAddressID);
  }

  // CRUD Methods (UML naming)
  static async getAll() {
    const query = 'SELECT * FROM Restaurants';
    const rows = await DAL.executeQuery(query);
    return rows.map(r => new Restaurant(r));
  }

  static async get(restaurantId) {
    const query = 'SELECT * FROM Restaurants WHERE restaurantId = @restaurantId';
    const params = { restaurantId };
    const rows = await DAL.executeQuery(query, params);
    return rows.length ? new Restaurant(rows[0]) : null;
  }

  static async create({ restaurantName, addressId, imgURL, description, priceRange, cuisine, operatingHours, isFlagged }) {
    const query = 'INSERT INTO Restaurants (restaurantName, addressId, imgURL, description, priceRange, cuisine, operatingHours, isFlagged) VALUES (@restaurantName, @addressId, @imgURL, @description, @priceRange, @cuisine, @operatingHours, @isFlagged)';
    const params = { restaurantName, addressId, imgURL, description, priceRange, cuisine, operatingHours, isFlagged };
    const row = await DAL.executeQuery(query, params);
    return new Restaurant(row);
  }

  static async update({ restaurantId, restaurantName, addressId, imgURL, description, priceRange, cuisine, operatingHours, isFlagged }) {
    const query = 'UPDATE Restaurants SET restaurantName = @restaurantName, addressId = @addressId, imgURL = @imgURL, description = @description, priceRange = @priceRange, cuisine = @cuisine, operatingHours = @operatingHours, isFlagged = @isFlagged WHERE restaurantId = @restaurantId';
    const params = { restaurantId, restaurantName, addressId, imgURL, description, priceRange, cuisine, operatingHours, isFlagged };
    const row = await DAL.executeQuery(query, params);
    return new Restaurant(row);
  }

  static async delete({ restaurantId }) {
    const query = 'DELETE FROM Restaurants WHERE restaurantId = @restaurantId';
    const params = { restaurantId };
    await DAL.executeQuery(query, params);
    return { restaurantId };
  }
}

module.exports = Restaurant;