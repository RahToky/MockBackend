export enum HttpStatus {
  OK = 200,
  Created = 201,
  NoContent = 204,
  BadRequest = 400,
  Unauthorized = 401,
  Error = 500,
}

interface IResponseDto {
  code: 200 | 201 | 404 | 500;
  message: string;
}

export interface ISuccessResponseDto extends IResponseDto {
  data: any;
}

export interface IErrorResponseDto extends IResponseDto {
  error: string;
}
