export enum ResponseStatus {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface GenericResponse<T> {
  status: ResponseStatus;
  message: string;
  _embedded: T;
}
