export type Endpoint = {
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
  status: number;
  response: {} | [] | string;
};

export type Collection = {
  name: string;
  comment: string | undefined;
  prefix: string | undefined;
  endpoints: Endpoint[];
};

export type DatabaseStructure = {
  endpointPacks: Collection[];
};
