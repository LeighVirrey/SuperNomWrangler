import bcrypt from 'bcryptjs';
import * as DAL from '../dal';

export default class User {
  constructor({ id, email, username, isAdmin, rank, passwordHash, createdAt }) {
    this.id = id;
    this.email = email;
    this.username = username;
    this.isAdmin = isAdmin;
    this.rank = rank;
    this.passwordHash = passwordHash;
    this.createdAt = createdAt ? new Date(createdAt) : new Date();
  }

  // Getters & Setters
  getID() { return this.id; }
  setID(id) { this.id = id; }

  getEmail() { return this.email; }
  setEmail(email) { this.email = email; }

  getUsername() { return this.username; }
  setUsername(username) { this.username = username; }

  getIsAdmin() { return this.isAdmin; }
  setIsAdmin(flag) { this.isAdmin = flag; }

  getRank() { return this.rank; }
  setRank(rank) { this.rank = rank; }

  compareUsername(other) { return this.username === other; }

  static saltHash(password, rounds = 10) {
    return bcrypt.hashSync(password, rounds);
  }

  // CRUD Methods
  static async getAll() {
    const rows = await DAL.getAllUsers();
    return rows.map(u => new User(u));
  }

  static async get(id) {
    const row = await DAL.getUserByID(id);
    return new User(row);
  }

  static async create({ email, username, password, isAdmin = false, rank = 0 }) {
    const passwordHash = User.saltHash(password);
    const row = await DAL.createUser({ email, username, passwordHash, isAdmin, rank });
    return new User(row);
  }

  static async login({ email, password }) {
    return DAL.loginUser({ email, password });
  }

  async update({ email, username, isAdmin, rank }) {
    const row = await DAL.updateUser(this.id, { email, username, isAdmin, rank });
    Object.assign(this, row);
    return this;
  }

  async delete() {
    await DAL.deleteUser(this.id);
  }
}
