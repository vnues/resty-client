import {
  ApisConfig,
  ApisInstance,
  ApisMap,
  Middleware,
  RejectedMiddleWare,
  RequestOptions,
  ResolvedMiddleWare,
  ServerMap,
} from './types';

import axios, { AxiosInstance, AxiosResponse } from 'axios';
export class Client {
  static reqMiddleware: Middleware[] = [];
  static resMiddleware: Middleware[] = [];

  static useReq(onFulfilled?: ResolvedMiddleWare<RequestOptions>, onRejected?: RejectedMiddleWare) {
    Client.reqMiddleware.push({ onFulfilled, onRejected });
  }

  static useRes(onFulfilled?: ResolvedMiddleWare<AxiosResponse>, onRejected?: RejectedMiddleWare) {
    Client.resMiddleware.push({ onFulfilled, onRejected });
  }

  static create(serverMap?: ServerMap, apiMap?: ApisMap, common?: RequestOptions) {
    const client = new Client(serverMap, apiMap, common);
    return client;
  }

  public common: RequestOptions;
  // 默认的server配置
  public base!: string;
  // server服务的集合
  public serverMap: ServerMap;
  // 对象形式的请求方法集合
  public apiMap: ApisMap;
  // 挂载所有请求方法的集合对象
  public apis: ApisInstance;
  // axios实例化对象
  public instance: AxiosInstance;

  constructor(serverMap?: ServerMap, apiMap?: ApisMap, common?: RequestOptions) {
    this.common = common || {};
    this.instance = axios.create(common);
    this.serverMap = serverMap || {};
    this.apiMap = apiMap || {};
    this.apis = {};
    if (Object.keys(this.serverMap).length && Object.keys(this.apiMap).length) {
      this.base = this.getDefault();
      this.formatConfigUrl();
      this.combine2Request();
    }

    this.middleware();
  }
  /**
   * 获取默认的配置
   * @returns
   */
  public getDefault(): string {
    let base = '';

    for (const key of Object.keys(this.serverMap)) {
      if (this.serverMap[key].default) {
        base = key;
      }
    }

    if (!base) {
      console.error('apis: 找不到默认服务器配置');
    }

    return base;
  }

  /**
   * 配置正确的baseURL,如果没有baseURL就读默认的
   *  @returns
   */
  public formatConfigUrl(): void {
    for (const key of Object.keys(this.apiMap)) {
      const item = this.apiMap[key];

      if (!item.server) {
        item.server = this.base;
      }

      this.apiMap[key] = {
        ...this.serverMap[item.server],
        ...item,
      };
    }
  }

  public get<T extends Record<string, any> = any>(url: string, request: RequestOptions): Promise<AxiosResponse<T>> {
    return this.request(url, request);
  }

  public delete<T extends Record<string, any> = any>(url: string, request: RequestOptions): Promise<AxiosResponse<T>> {
    return this.request(url, request);
  }

  public post<T extends Record<string, any> = any>(url: string, request: RequestOptions): Promise<AxiosResponse<T>> {
    return this.request(url, request);
  }

  public put<T extends Record<string, any> = any>(url: string, request: RequestOptions): Promise<AxiosResponse<T>> {
    return this.request(url, request);
  }

  public patch<T extends Record<string, any> = any>(url: string, request: RequestOptions): Promise<AxiosResponse<T>> {
    return this.request(url, request);
  }

  public request<T extends Record<string, any> = any>(url: string, request: RequestOptions): Promise<AxiosResponse<T>> {
    const rest = request.rest || {};
    let path = url;
    if (Object.keys(rest).length) {
      path = this.restful(url, rest);
    }
    // 合并公共配置
    const options = { ...this.common, ...request };
    return this.instance.request({
      ...options,
      url: path,
    });
  }

  /**
   * 将url转换为restful风格
   * @param url
   * @param rest
   * @returns
   */
  private restful(url: string, rest: Record<string, any>): string {
    const regex = /:[^/]*/g;
    return url.replace(regex, (p) => {
      const key = p.slice(1);

      if (rest[key]) {
        return rest[key];
      }

      return p;
    });
  }

  /**
   * 将restful config配置合并
   * @param config1 apis文件的基本配置信息
   * @param config2 用户传入的配置信息
   * @returns
   */
  private rest2Combine(config1: ApisConfig, config2: ApisConfig): ApisConfig {
    const reConf = { ...config2 };

    if (config2.rest) {
      reConf.url = this.restful(config1.url!, config2.rest);
    }

    return { ...config1, ...reConf };
  }

  /**
   * 合并配置,转化为请求方法
   * @returns
   */
  private combine2Request(): void {
    for (const key of Object.keys(this.apiMap)) {
      this.apis[key] = (config?: ApisConfig) => {
        let result: ApisConfig = this.apiMap[key];

        if (config) {
          result = this.rest2Combine(this.apiMap[key], config);
        }

        return this.instance.request(result);
      };
    }
  }
  /**
   * client拦截器处理
   */
  private middleware(): void {
    Client.reqMiddleware.map((middleware: Middleware) =>
      this.instance.interceptors.request.use(middleware.onFulfilled, middleware.onRejected),
    );

    Client.resMiddleware.map((middleware: Middleware) =>
      this.instance.interceptors.response.use(middleware.onFulfilled, middleware.onRejected),
    );
  }
}
