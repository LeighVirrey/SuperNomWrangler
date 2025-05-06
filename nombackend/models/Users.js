import { createResource, getResource, getResourceById, updateResource, deleteResource } from '../services/dal';

export default class User {
  constructor({ id, email, created_at }) {
    this.id = id;
    this.email = email;
    this.createdAt = new Date(created_at);
  }

  // Create a new user (register)
  static async create({ email, password }) {
    return createResource('/register', { email, password });
  }

  // Log in an existing user
  static async login({ email, password }) {
    return createResource('/login', { email, password });
  }

  // Fetch all users
  static async fetchAll() {
    const users = await getResource('/users');
    return users.map(u => new User(u));
  }

  // Fetch one user by ID
  static async fetchById(id) {
    const u = await getResourceById('/users', id);
    return new User(u);
  }

  // Update this user's data
  async update(updates) {
    const updated = await updateResource('/users', this.id, updates);
    Object.assign(this, { email: updated.email, createdAt: new Date(updated.created_at) });
    return this;
  }

  // Delete this user
  async delete() {
    await deleteResource('/users', this.id);
  }
}
