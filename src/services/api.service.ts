import { Router } from "express";
import DBManager from "../db/db.manager";
import { Endpoint } from "../models/db.model";

export default class ApiService {
  db;

  private static instance: ApiService;

  private constructor() {
    this.db = DBManager.getInstance();
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }
}
