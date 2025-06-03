export enum MethodType {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
  PATCH = 'PATCH',
}

export type IPCheckerConfigItem = {
  id?: number;
  configName: string;
  url: string;
  methodType: MethodType;
  regex: string;
  enable?: boolean;
};
