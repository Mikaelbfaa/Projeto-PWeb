class BaseStorage {
  constructor(dbService, storeName) {
    this.db = dbService;
    this.storeName = storeName;
  }

  async save(data) {
    await this.db.saveData(this.storeName, data);
    await this.db.setLastSyncTime(this.storeName);
  }

  async getAll() {
    return await this.db.getAllData(this.storeName);
  }

  async getById(id) {
    return await this.db.getData(this.storeName, id);
  }

  async delete(id) {
    return await this.db.deleteData(this.storeName, id);
  }

  async clear() {
    return await this.db.clearStore(this.storeName);
  }

  async count() {
    return await this.db.getDataCount(this.storeName);
  }

  async searchByName(searchTerm) {
    return await this.db.searchByName(this.storeName, searchTerm);
  }

  async getLastSync() {
    return await this.db.getLastSyncTime(this.storeName);
  }
}

export default BaseStorage;