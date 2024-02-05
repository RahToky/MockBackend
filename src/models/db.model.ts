export type Endpoint = {
  method:
    | "get"
    | "post"
    | "delete"
    | "put"
    | "head"
    | "options"
    | "trace"
    | "connect";
  path: string;
  code: number;
  data: string;
  error: string;
  message: string;
};

export type DatabaseStructure = {
  endpoints: Endpoint[];
};
