const dal = require('../DAL/mssqlDal');

class User {
  constructor({user_Id, username, email, password, is_Admin, rank}){
    this.id = user_Id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.is_Admin = is_Admin;
    this.rank = rank;
  }

  static async getAllUsers(){
    const query = 'SELECT * FROM Users';
    const users = await dal.executeQuery(query);
    return users.map(user => new User(user));
  }
  static async getUserById(user_Id){
    const query = 'SELECT * FROM Users WHERE user_Id = @user_Id';
    const params = { user_Id };
    const users = await dal.executeQuery(query, params);
    return users.length ? new User(users[0]) : null;
  }

  static async checkEmailExists(email){
    const query = 'SELECT * FROM Users WHERE email = @email';
    const params = { email };
    const users = await dal.executeQuery(query, params);
    return users.user_Id;
  }
  static async createUser({ username, email, password, is_Admin, rank }){
    const query = 'INSERT INTO Users (username, email, password, is_Admin, rank) VALUES (@username, @email, @password, @is_Admin, @rank)';
    const params = { username, email, password, is_Admin, rank };
    await dal.executeQuery(query, params);
    return new User({ username, email, password, is_Admin, rank });
  }
  static async updateUser(userId, { username, email, password, is_Admin, rank }){
    const query = 'UPDATE Users SET username = @username, email = @email, password = @password, is_Admin = @is_Admin, rank = @rank WHERE userId = @userId';
    const params = { userId, username, email, password, is_Admin, rank };
    await dal.executeQuery(query, params);
    return new User({ userId, username, email, password, is_Admin, rank });
  }
  static async deleteUser(user_Id){
    const query = 'DELETE FROM Users WHERE user_Id = @user_Id';
    const params = { user_Id };
    await dal.executeQuery(query, params);
    return true;
  }
}

module.exports = User;