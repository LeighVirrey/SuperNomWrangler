import { createResource, getResource, getResourceById, updateResource, deleteResource } from '../services/dal';

export default class Review {
  constructor({ id, user_id, restaurant_id, rating, comment, created_at }) {
    this.id = id;
    this.userId = user_id;
    this.restaurantId = restaurant_id;
    this.rating = rating;
    this.comment = comment;
    this.createdAt = new Date(created_at);
  }

  static async create({ userId, restaurantId, rating, comment }) {
    const data = await createResource('/reviews', {
      user_id: userId,
      restaurant_id: restaurantId,
      rating,
      comment
    });
    return new Review(data);
  }

  static async fetchAll() {
    const list = await getResource('/reviews');
    return list.map(r => new Review(r));
  }

  static async fetchById(id) {
    const r = await getResourceById('/reviews', id);
    return new Review(r);
  }

  async update(updates) {
    const data = await updateResource('/reviews', this.id, updates);
    Object.assign(this, updates);
    return this;
  }

  async delete() {
    await deleteResource('/reviews', this.id);
  }
}
