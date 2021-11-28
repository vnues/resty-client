import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface ApisMap {
  [key: string]: {
    server?: string;
    url: string;
    method:
      | 'get'
      | 'GET'
      | 'post'
      | 'POST'
      | 'put'
      | 'PUT'
      | 'delete'
      | 'DELETE'
      | 'options'
      | 'OPTIONS'
      | 'patch'
      | 'PATCH'
      | 'head'
      | 'HEAD';
  };
}
export interface ServerMap {
  [key: string]: Config;
}

export interface BaseMap {
  prod?: string;
  stage?: string;
  test?: string;
  dev?: string;
  local?: string;
  [key: string]: any;
}

export interface Config {
  default?: boolean;
  baseURL?: string;
  baseMap: BaseMap;
}

export interface RequestOptions extends AxiosRequestConfig {
  rest?: Record<string, any>;
}

export type ResolvedMiddleWare<T = any> = (val: T) => T | Promise<T>;

export type RejectedMiddleWare = (err: any) => any;

export interface Middleware {
  onFulfilled?: ResolvedMiddleWare;
  onRejected?: RejectedMiddleWare;
}

export interface ApisConfig extends AxiosRequestConfig {
  rest?: Record<string, any>;
}
export interface Apis {
  [key: string]: (config?: ApisConfig) => AxiosPromise;
}

export type ApisInstance = Apis;

export type RestyResponse<T> = AxiosResponse<T>;
