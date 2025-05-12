import * as DAL from '../dal';

export default class Review {
  constructor({ reviewID, userID, restaurantID, rating, comment, datePosted, createdAt }) {
    this.reviewID = reviewID;
    this.userID = userID;
    this.restaurantID = restaurantID;
    this.rating = rating;
    this.comment = comment;
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

  getComment() { return this.comment; }
  setComment(comment) { this.comment = comment; }

  getDatePosted() { return this.datePosted; }
  setDatePosted(date) { this.datePosted = new Date(date); }

  checkProfan() {
    // implement profanity filter logic here
  }

  getCreatedAt() { return this.createdAt; }
  setCreatedAt(date) { this.createdAt = new Date(date); }

  // CRUD Methods
  static async getAll() {
    const rows = await DAL.getAllReviews();
    return rows.map(r => new Review(r));
  }

  static async get(reviewID) {
    const row = await DAL.getReviewByID(reviewID);
    return new Review(row);
  }

  static async create({ userID, restaurantID, rating, comment, datePosted }) {
    const row = await DAL.createReview({ userID, restaurantID, rating, comment, datePosted });
    return new Review(row);
  }

  async update({ rating, comment }) {
    const row = await DAL.updateReview(this.reviewID, { rating, comment });
    Object.assign(this, { rating: row.rating, comment: row.comment });
    return this;
  }

  async delete() {
    await DAL.deleteReview(this.reviewID);
  }
}