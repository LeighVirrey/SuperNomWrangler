const DAL = require('../DAL/mssqlDal')

class Review {
  constructor({ reviewId, userId, restaurantId, rating, review, datePosted }) {
    this.reviewId  = reviewId;
    this.userId = userId;
    this.restaurantId = restaurantId;
    this.rating = rating;
    this.review = review;
    this.datePosted = datePosted ? new Date(datePosted) : new Date();
  }

  // Getters & Setters
  getReviewId() { return this.reviewId; }
  setReviewId(id) { this.reviewId = id; }

  getUserId() { return this.userId; }
  setUserId(id) { this.userId = id; }

  getRestaurantId() { return this.restaurantId; }
  setRestaurantId(id) { this.restaurantId = id; }

  getRating() { return this.rating; }
  setRating(rating) { this.rating = rating; }

  getReview() { return this.review; }
  setReview(review) { this.review = review; }

  getDatePosted() { return this.datePosted; }
  setDatePosted(date) { this.datePosted = new Date(date); }

  checkProfan() {
    //implement this later, please intall the profanity package as I cannot do so right now -ZK
  }

  // CRUD Methods (UML naming)
  static async getAll() {
    const query = 'SELECT * FROM Reviews';
    const rows = await DAL.executeQuery(query);
    return rows.map(r => new Review(r));
  }

  static async get(reviewId) {
    const query = 'SELECT * FROM Reviews WHERE reviewId = @reviewId';
    const params = { reviewId };
    const rows = await DAL.executeQuery(query, params);
    return rows.length ? new Review(rows[0]) : null;
  }

  static async getByUserId(userId) {
    const query = 'SELECT * FROM Reviews WHERE userId = @userId';
    const params = { userId };
    const rows = await DAL.executeQuery(query, params);
    return rows.length ? new Review(rows[0]) : null;
  }
  static async getByRestaurantId(restaurantId) {
    const query = 'SELECT * FROM Reviews WHERE restaurantId = @restaurantId';
    const params = { restaurantId };
    const rows = await DAL.executeQuery(query, params);
    return rows.length ? new Review(rows[0]) : null;
  }
  static async getByUserIdAndRestaurantId({ userId, restaurantId }) {
    const query = 'SELECT * FROM Reviews WHERE userId = @userId AND restaurantId = @restaurantId';
    const params = { userId, restaurantId };
    const rows = await DAL.executeQuery(query, params);
    return rows.length ? new Review(rows[0]) : null;
  }

  static async create({ userId, restaurantId, rating, review, datePosted }) {
    const query = 'INSERT INTO Reviews (userId, restaurantId, rating, review, datePosted) VALUES (@userId, @restaurantId, @rating, @review, @datePosted)';
    const params = { userId, restaurantId, rating, review, datePosted };
    const row = await DAL.executeQuery(query, params);
    return new Review(row);
  }

  static async update({ reviewId, rating, review }) {
    const query = 'UPDATE Reviews SET rating = @rating, review = @review WHERE reviewId = @reviewId';
    const params = { reviewId, rating, review };
    const row = await DAL.executeQuery(query, params);
    return new Review(row);
  }

  static async delete({ reviewId }) {
    const query = 'DELETE FROM Reviews WHERE reviewId = @reviewId';
    const params = { reviewId };
    await DAL.executeQuery(query, params);
    return { reviewId };
  }
}

module.exports = Review;