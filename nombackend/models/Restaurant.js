import { createResource, getResource, getResourceById, updateResource, deleteResource } from '../services/dal';

export default class Restaurant {
  constructor({ id, name, address_id, created_at }) {
    this.id = id;
    this.name = name;
    this.addressId = address_id;
    this.createdAt = new Date(created_at);
  }

  static async create({ name, addressId }) {
    const data = await createResource('/restaurants', { name, address_id: addressId });
    return new Restaurant(data);
  }

  static async fetchAll() {
    const list = await getResource('/restaurants');
    return list.map(r => new Restaurant(r));
  }

  static async fetchById(id) {
    const r = await getResourceById('/restaurants', id);
    return new Restaurant(r);
  }

  async update(updates) {
    const data = await updateResource('/restaurants', this.id, updates);
    Object.assign(this, { name: data.name, addressId: data.address_id });
    return this;
  }

  async delete() {
    await deleteResource('/restaurants', this.id);
  }
}
