import * as DAL from '../dal';

export default class Review {
  constructor({ reviewID, userID, restaurantID, rating, review, datePosted, createdAt }) {
    this.reviewID = reviewID;
    this.userID = userID;
    this.restaurantID = restaurantID;
    this.rating = rating;
    this.review = review;
    this.datePosted = datePosted ? new Date(datePosted) : new Date();
    this.createdAt = createdAt ? new Date(createdAt) : new Date();
  }

  // Getters & Setters
  getReviewID() { return this.reviewID; }
  setReviewID(id) { this.reviewID = id; }

  getUserID() { return this.userID; }
  setUserID(id) { this.userID = id; }

  getRestaurantID() { return this.restaurantID; }
  setRestaurantID(id) { this.restaurantID = id; }

  getRating() { return this.rating; }
  setRating(rating) { this.rating = rating; }

  getReview() { return this.review; }
  setReview(review) { this.review = review; }

  getDatePosted() { return this.datePosted; }
  setDatePosted(date) { this.datePosted = new Date(date); }

  checkProfan() {
    // implement profanity filter logic here
  }

  getCreatedAt() { return this.createdAt; }
  setCreatedAt(date) { this.createdAt = new Date(date); }

  // CRUD Methods (UML naming)
  static async getAll() {
    const rows = await DAL.getAllReviews();
    return rows.map(r => new Review(r));
  }

  static async get(reviewID) {
    const row = await DAL.getReviewByID(reviewID);
    return new Review(row);
  }

  static async create({ userID, restaurantID, rating, review, datePosted }) {
    const row = await DAL.createReview({ userID, restaurantID, rating, review, datePosted });
    return new Review(row);
  }

  async update({ rating, review }) {
    const row = await DAL.updateReview(this.reviewID, { rating, review });
    Object.assign(this, { rating: row.rating, review: row.review });
    return this;
  }

  async delete() {
    await DAL.deleteReview(this.reviewID);
  }
}
