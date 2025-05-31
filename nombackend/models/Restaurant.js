const DAL = require('../DAL/mssqlDal');

class Restaurant {
  constructor({ restaurant_Id, name, address_Id, img_Url, description, price_Range, cuisine_Type, operating_Hours, is_Flagged, hidden_Gem, mom_And_Pop, nook_And_Cranny, dining_Style, extra_Text }) {
    this.restaurant_Id = restaurant_Id;
    this.name = name;
    this.address_Id = address_Id;
    this.img_Url = img_Url;
    this.description = description;
    this.price_Range = price_Range;
    this.cuisine_Type = cuisine_Type;
    this.dining_Style = dining_Style;
    this.operating_Hours = operating_Hours;
    this.is_Flagged = is_Flagged;
    this.hidden_Gem = hidden_Gem;
    this.mom_And_Pop = mom_And_Pop;
    this.nook_And_Cranny = nook_And_Cranny;
    this.extra_Text = extra_Text || ''; 
  }

  // Getters & Setters
  getRestaurantId() { return this.restaurant_Id; }
  setRestaurantId(id) { this.restaurant_Id = id; }

  getName() { return this.name; }
  setName(name) { this.name = name; }

  getAddressId() { return this.address_Id; }
  setAddressId(id) { this.address_Id = id; }

  getImgURL() { return this.img_Url; }
  setImgURL(url) { this.img_Url = url; }

  getDescription() { return this.description; }
  setDescription(desc) { this.description = desc; }

  getPriceRange() { return this.price_Range; }
  setPriceRange(range) { this.price_Range = range; }

  getCuisine() { return this.cuisine_Type; }
  setCuisine(cuisine) { this.cuisine_Type = cuisine; }

  getOperatingHours() { return this.operating_Hours; }
  setOperatingHours(hours) { this.operating_Hours = hours; }

  getIsFlagged() { return this.is_Flagged; }
  setIsFlagged(flag) { this.is_Flagged = flag; }

  getHidden_Gem() { return this.hidden_Gem; }
  setHidden_Gem(hidden) { this.hidden_Gem = hidden; }

  getMom_And_Pop() { return this.mom_And_Pop; }
  setMom_And_Pop(mom) { this.mom_And_Pop = mom; }

  getNook_And_Cranny() { return this.nook_And_Cranny; }
  setNook_And_Cranny(nook) { this.nook_And_Cranny = nook; }

  getDining_Style() { return this.dining_Style; }
  setDining_Style(style) { this.dining_Style = style; }

  getExtraText() { return this.extra_Text; }
  setExtraText(text) { this.extra_Text = text; }

  // Relationship Method
  async getAddress() {
    return await Address.get(this.address_Id);
  }

  // CRUD Methods (UML naming)
  static async getAll() {
    const query = 'SELECT * FROM Restaurants';
    const rows = await DAL.executeQuery(query);
    return rows.map(r => new Restaurant(r));
  }

  static async get(restaurant_Id) {
    const query = 'SELECT * FROM Restaurants WHERE restaurant_Id = @restaurant_Id';
    const params = { restaurant_Id };
    const rows = await DAL.executeQuery(query, params);
    return rows.length ? new Restaurant(rows[0]) : null;
  }

  static async getByAddressId(address_Id) {
    const query = 'SELECT * FROM Restaurants WHERE address_Id = @address_Id';
    const params = { address_Id };
    const rows = await DAL.executeQuery(query, params);
    return rows.length ? new Restaurant(rows[0]) : null;
  }

  static async create({ name, address_Id, img_Url, description, price_Range, cuisine_Type, operating_Hours, is_Flagged, hidden_Gem, mom_And_Pop, nook_And_Cranny, dining_Style, extra_Text }) {
    const query = 'INSERT INTO Restaurants (name, address_Id, img_Url, description, price_Range, cuisine_Type, operating_Hours, is_Flagged, hidden_Gem, mom_And_Pop, nook_And_Cranny, dining_Style, extra_Text) VALUES (@name, @address_Id, @img_Url, @description, @price_Range, @cuisine_Type, @operating_Hours, @is_Flagged, @hidden_Gem, @mom_And_Pop, @nook_And_Cranny, @dining_Style, @extra_Text)';
    const params = { name, address_Id, img_Url, description, price_Range, cuisine_Type, operating_Hours, is_Flagged, hidden_Gem, mom_And_Pop, nook_And_Cranny, dining_Style, extra_Text };
    await DAL.executeQuery(query, params);
    return new Restaurant({ name, address_Id, img_Url, description, price_Range, cuisine_Type, operating_Hours, is_Flagged, hidden_Gem, mom_And_Pop, nook_And_Cranny, dining_Style });
  }

  static async update({ restaurant_Id, name, address_Id, img_Url, description, price_Range, cuisine_Type, operating_Hours, is_Flagged, hidden_Gem, mom_And_Pop, nook_And_Cranny, dining_Style, extra_Text }) {
    const query = 'UPDATE Restaurants SET name = @name, address_Id = @address_Id, img_Url = @img_Url, description = @description, price_Range = @price_Range, cuisine_Type = @cuisine_Type, operating_Hours = @operating_Hours, is_Flagged = @is_Flagged, hidden_Gem = @hidden_Gem, mom_And_Pop = @mom_And_Pop, nook_And_Cranny = @nook_And_Cranny, dining_Style = @dining_Style, extra_Text = @extra_Text WHERE restaurant_Id = @restaurant_Id';
    const params = { restaurant_Id, name, address_Id, img_Url, description, price_Range, cuisine_Type, operating_Hours, is_Flagged, hidden_Gem, mom_And_Pop, nook_And_Cranny, dining_Style, extra_Text };
    await DAL.executeQuery(query, params);
    return new Restaurant({ restaurant_Id, name, address_Id, img_Url, description, price_Range, cuisine_Type, operating_Hours, is_Flagged, hidden_Gem, mom_And_Pop, nook_And_Cranny, dining_Style });
  }

  static async delete({ restaurant_Id }) {
    const query = 'DELETE FROM Restaurants WHERE restaurant_Id = @restaurant_Id';
    const params = { restaurant_Id };
    await DAL.executeQuery(query, params);
    return { restaurant_Id };
  }
}

module.exports = Restaurant;