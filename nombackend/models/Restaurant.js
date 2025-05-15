import * as DAL from '../dal';
import Address from './Address';

export default class Restaurant {
  constructor({ restaurantID, restaurantName, locationAddressID, imgURL, description, priceRange, cuisine, operatingHours, isFlagged, createdAt }) {
    this.restaurantID = restaurantID;
    this.restaurantName = restaurantName;
    this.locationAddressID = locationAddressID;
    this.imgURL = imgURL;
    this.description = description;
    this.priceRange = priceRange;
    this.cuisine = cuisine;
    this.operatingHours = operatingHours;
    this.isFlagged = isFlagged;
    this.createdAt = createdAt ? new Date(createdAt) : new Date();
  }

  // Getters & Setters
  getRestaurantID() { return this.restaurantID; }
  setRestaurantID(id) { this.restaurantID = id; }

  getRestaurantName() { return this.restaurantName; }
  setRestaurantName(name) { this.restaurantName = name; }

  getLocationAddressID() { return this.locationAddressID; }
  setLocationAddressID(id) { this.locationAddressID = id; }

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

  getCreatedAt() { return this.createdAt; }
  setCreatedAt(date) { this.createdAt = new Date(date); }

  // Relationship Method
  async getAddress() {
    return await Address.get(this.locationAddressID);
  }

  // CRUD Methods (UML naming)
  static async getAll() {
    const rows = await DAL.getAllRestaurants();
    return rows.map(r => new Restaurant(r));
  }

  static async get(restaurantID) {
    const row = await DAL.getRestaurantByID(restaurantID);
    return new Restaurant(row);
  }

  static async create({ restaurantName, locationAddressID, imgURL, description, priceRange, cuisine, operatingHours, isFlagged }) {
    const row = await DAL.createRestaurant({ restaurantName, locationAddressID, imgURL, description, priceRange, cuisine, operatingHours, isFlagged });
    return new Restaurant(row);
  }

  async update({ restaurantName, locationAddressID, imgURL, description, priceRange, cuisine, operatingHours, isFlagged }) {
    const row = await DAL.updateRestaurant(this.restaurantID, { restaurantName, locationAddressID, imgURL, description, priceRange, cuisine, operatingHours, isFlagged });
    Object.assign(this, {
      restaurantName: row.restaurantName,
      locationAddressID: row.locationAddressID,
      imgURL: row.imgURL,
      description: row.description,
      priceRange: row.priceRange,
      cuisine: row.cuisine,
      operatingHours: row.operatingHours,
      isFlagged: row.isFlagged
    });
    return this;
  }

  async delete() {
    await DAL.deleteRestaurant(this.restaurantID);
  }
}