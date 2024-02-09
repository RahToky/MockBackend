export type Endpoint = {
  _id?: string;
  status: number;
  name: string;
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
  comment?: string;
  response: {} | [] | string;
};

export type Collection = {
  _id?: string;
  name: string;
  comment?: string;
  prefix?: string | undefined;
  endpoints: Endpoint[];
};

export type DatabaseStructure = {
  collections: Collection[];
};
