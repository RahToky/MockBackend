import DBManager from "../db/db.manager";

export default abstract class DbService {
  db: Promise<DBManager>;

  constructor() {
    this.db = DBManager.getInstance();
  }

  async findAllCollection() {
    return (await this.db).findAllCollection();
  }
}
