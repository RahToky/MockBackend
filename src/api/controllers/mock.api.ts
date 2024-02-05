import { Request, Response } from "express";
import { HttpStatus, ISuccessResponseDto } from "../models/response.dto.model";

export function checkApi(_req: Request, res: Response): void {
  let response: ISuccessResponseDto = {
    code: HttpStatus.OK,
    data: null,
    message: "OK",
  };
  res.json(response);
}
