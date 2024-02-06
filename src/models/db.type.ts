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
  status: number;
  response: {} | [] | string;
};

export type EndpointPack = {
  package: string;
  comment: string | undefined;
  prefix: string | undefined;
  endpoints: Endpoint[];
};

export type DatabaseStructure = {
  endpointPacks: EndpointPack[];
};
