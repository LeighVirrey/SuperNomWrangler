const DAL = require('../DAL/mssqlDal')
const { profanity } = require('@2toad/profanity')

class Review {
  constructor({ review_Id, user_Id, restaurant_Id, rating, review, date_Posted, is_Flagged }) {
    this.review_Id  = review_Id;
    this.user_Id = user_Id;
    this.restaurant_Id = restaurant_Id;
    this.rating = rating;
    this.review = review;
    this.date_Posted = date_Posted ? new Date(date_Posted) : new Date();
    this.is_Flagged = is_Flagged;
  }

  // Getters & Setters
  getReviewId() { return this.review_Id; }
  setReviewId(id) { this.review_Id = id; }

  getUserId() { return this.user_Id; }
  setUserId(id) { this.user_Id = id; }

  getRestaurantId() { return this.restaurant_Id; }
  setRestaurantId(id) { this.restaurant_Id = id; }

  getRating() { return this.rating; }
  setRating(rating) { this.rating = rating; }

  getReview() { return this.review; }
  setReview(review) { this.review = review; }

  getDatePosted() { return this.datePosted; }
  setDatePosted(date) { this.datePosted = new Date(date); }

  getIsFlagged() { return this.is_Flagged; }
  setIsFlagged(is_Flagged) { this.is_Flagged = is_Flagged; }

  // CRUD Methods (UML naming)
  static async getAll() {
    const query = 'SELECT * FROM Reviews';
    const rows = await DAL.executeQuery(query);
    return rows.map(r => new Review(r));
  }

  static async get(review_Id) {
    const query = 'SELECT * FROM Reviews WHERE review_Id = @review_Id';
    const params = { review_Id };
    const rows = await DAL.executeQuery(query, params);
    return rows.length ? new Review(rows[0]) : null;
  }

  static async getByUserId(user_Id) {
    const query = 'SELECT * FROM Reviews WHERE user_Id = @user_Id';
    const params = { user_Id };
    const rows = await DAL.executeQuery(query, params);
    return rows.length ? new Review(rows[0]) : null;
  }
  static async getByRestaurantId(restaurant_Id) {
    const query = 'SELECT * FROM Reviews WHERE restaurant_Id = @restaurant_Id';
    const params = { restaurant_Id };
    const rows = await DAL.executeQuery(query, params);
    return rows.length ? new Review(rows[0]) : null;
  }
  static async getByUserIdAndRestaurantId({ user_Id, restaurant_Id }) {
    const query = 'SELECT * FROM Reviews WHERE user_Id = @user_Id AND restaurant_Id = @restaurant_Id';
    const params = { user_Id, restaurant_Id };
    const rows = await DAL.executeQuery(query, params);
    return rows.length ? new Review(rows[0]) : null;
  }

  static async create({ user_Id, restaurant_Id, rating, review, is_Flagged }) {
    const date_Posted = new Date();
    review = profanity.censor(review);
    const query = 'INSERT INTO Reviews (user_Id, restaurant_Id, rating, review, date_Posted, is_Flagged) VALUES (@user_Id, @restaurant_Id, @rating, @review, @date_Posted, @is_Flagged)';
    const params = { user_Id, restaurant_Id, rating, review, date_Posted, is_Flagged };
    await DAL.executeQuery(query, params);
    return new Review({ user_Id, restaurant_Id, rating, review, date_Posted, is_Flagged });
  }

  static async update({ review_Id, rating, review, is_Flagged }) {
    review = profanity.censor(review);
    const query = 'UPDATE Reviews SET rating = @rating, review = @review, is_Flagged = @is_Flagged WHERE review_Id = @review_Id';
    const params = { review_Id, rating, review, is_Flagged };
    await DAL.executeQuery(query, params);
    return new Review({ review_Id, rating, review, is_Flagged });
  }

  static async delete({ review_Id }) {
    const query = 'DELETE FROM Reviews WHERE review_Id = @review_Id';
    const params = { review_Id };
    await DAL.executeQuery(query, params);
    return { review_Id };
  }
}

module.exports = Review;