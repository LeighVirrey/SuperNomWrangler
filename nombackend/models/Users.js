const dal = require('../DAL/mssqlDal');

export default class User {
  constructor({userId, username, email, password, isAdmin, rank}){
    this.id = userId;
    this.username = username;
    this.email = email;
    this.password = password;
    this.isAdmin = isAdmin;
    this.rank = rank;
  }

  static async getAllUsers(){
    const query = 'SELECT * FROM Users';
    const users = await dal.executeQuery(query);
    return users.map(user => new User(user));
  }
  static async getUserById(userId){
    const query = 'SELECT * FROM Users WHERE userId = @userId';
    const params = { userId };
    const users = await dal.executeQuery(query, params);
    return users.length ? new User(users[0]) : null;
  }
  static async createUser({ username, email, password, isAdmin, rank }){
    const query = 'INSERT INTO Users (username, email, password, isAdmin, rank) VALUES (@username, @email, @password, @isAdmin, @rank)';
    const params = { username, email, password, isAdmin, rank };
    await dal.executeQuery(query, params);
    return new User({ username, email, password, isAdmin, rank });
  }
  static async updateUser(userId, { username, email, password, isAdmin, rank }){
    const query = 'UPDATE Users SET username = @username, email = @email, password = @password, isAdmin = @isAdmin, rank = @rank WHERE userId = @userId';
    const params = { userId, username, email, password, isAdmin, rank };
    await dal.executeQuery(query, params);
    return new User({ userId, username, email, password, isAdmin, rank });
  }
  static async deleteUser(userId){
    const query = 'DELETE FROM Users WHERE userId = @userId';
    const params = { userId };
    await dal.executeQuery(query, params);
    return true;
  }
}
