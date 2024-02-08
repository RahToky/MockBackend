import DBManager from "../db/db.manager";
import { Collection } from "../models/db.type";
import DbService from "./service";

export default class PageService extends DbService {
  private static instance: PageService;

  private constructor() {
    super();
  }

  static getInstance() {
    if (!PageService.instance) {
      PageService.instance = new PageService();
    }
    return PageService.instance;
  }
}
