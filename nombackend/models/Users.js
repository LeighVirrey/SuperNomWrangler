const DAL = require('../DAL/mssqlDal');
const bcrypt = require('bcryptjs');

class User {
  constructor({user_Id, username, email, password, is_Admin, rank, imgUrl}){
    this.id = user_Id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.is_Admin = is_Admin;
    this.rank = rank;
    this.imgUrl = imgUrl;
  }

  // Getters & Setters
  getId() { return this.id; }
  setId(id) { this.id = id; }
  getUsername() { return this.username; }
  setUsername(username) { this.username = username; }
  getEmail() { return this.email; }
  setEmail(email) { this.email = email; }
  getPassword() { return this.password; }
  setPassword(password) { this.password = password; }
  getIsAdmin() { return this.is_Admin; }
  setIsAdmin(is_Admin) { this.is_Admin = is_Admin; }
  getRank() { return this.rank; }
  setRank(rank) { this.rank = rank; }
  getImgUrl() { return this.imgUrl; }
  setImgUrl(imgUrl) { this.imgUrl = imgUrl; }

  static async getAllUsers(){
    const query = 'SELECT * FROM Users';
    const users = await DAL.executeQuery(query);
    return users.map(user => new User(user));
  }
  static async getUserById(user_Id){
    const query = 'SELECT * FROM Users WHERE user_Id = @user_Id';
    const params = { user_Id };
    const users = await DAL.executeQuery(query, params);
    return users.length ? new User(users[0]) : null;
  }

  static async getUserByUsername(username){
    const query = 'SELECT * FROM Users WHERE username = @username';
    const params = { username };
    const users = await DAL.executeQuery(query, params);
    return users.length ? new User(users[0]) : null;
  }

  static async checkEmailExists(email){
    const query = 'SELECT * FROM Users WHERE email = @email';
    const params = { email };
    const users = await DAL.executeQuery(query, params);
    return users.length > 0 ? users[0].user_Id : false;
  }
  static async createUser({ username, email, password, is_Admin, rank, imgUrl }){
    const query = 'INSERT INTO Users (username, email, password, is_Admin, rank, imgUrl) VALUES (@username, @email, @password, @is_Admin, @rank, @imgUrl)';
    const hashedPassword = await User.saltHashPassword(password);
    const params = { username, email, password: hashedPassword, is_Admin, rank, imgUrl };
    await DAL.executeQuery(query, params);
    return new User({ username, email, password: hashedPassword, is_Admin, rank, imgUrl });
  }
  static async updateUser(userId, { username, email, password, is_Admin, rank, imgUrl }){
    const query = 'UPDATE Users SET username = @username, email = @email, password = @password, is_Admin = @is_Admin, rank = @rank, imgUrl = @imgUrl WHERE userId = @userId';
    const hashedPassword = await User.saltHashPassword(password);
    const params = { userId, username, email, password: hashedPassword, is_Admin, rank, imgUrl };
    await DAL.executeQuery(query, params);
    return new User({ userId, username, email, password: hashedPassword, is_Admin, rank });
  }
  static async deleteUser(user_Id){
    const query = 'DELETE FROM Users WHERE user_Id = @user_Id';
    const params = { user_Id };
    await DAL.executeQuery(query, params);
    return true;
  }

  static async deleteUserName(username){
    const query = 'DELETE FROM Users WHERE username = @username';
    const params = { username };
    await DAL.executeQuery(query, params);
    return true;
  }

  static saltHashPassword(password){
    return bcrypt.hash(password, 10);
  }
}

module.exports = User;
