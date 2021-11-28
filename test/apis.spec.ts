import Client from '@src/index';
import { ApisMap } from 'src/types';
import { getAjaxRequest } from './helper';
import { AxiosResponse } from 'axios';
const serverMap = {
  baseServer: {
    baseMap: {}, // 处理环境变量
    default: true,
    baseURL: 'https://base.com',
  },
  qqServer: {
    baseMap: {}, // 处理环境变量
    baseURL: 'https://production.com',
  },
};
const apiMap: ApisMap = {
  getBaseInfo: {
    method: 'get',
    url: '/base/info',
  },
  getBaseInfoById: {
    method: 'get',
    url: '/base/info/:id',
    server: 'qqServer',
  },
  getUserInfo: {
    method: 'post',
    url: '/user/:id/info/:age',
    server: 'qqServer',
  },
};
Client.useRes(
  (result: any) => {
    console.log('响应中间拦截器');
    return result;
  },
  (error: any) => Promise.reject(error),
);

const client = Client.create(serverMap, apiMap);
describe('test apis library', () => {
  beforeEach(() => {
    jasmine.Ajax.install();
  });

  afterEach(() => {
    jasmine.Ajax.uninstall();
  });

  // 测试apis的length
  it('should be the correct apis object length', () => {
    expect(Object.keys(client.apis).length).toEqual(3);
  });

  // 测试是否正常请求
  it('should be normal request', async () => {
    let response: AxiosResponse<any> | null = null;
    client.apis.getBaseInfo({ params: { name: 'nillwang' } }).then((res) => {
      response = res;
    });
    const request = await getAjaxRequest();
    request.respondWith({
      status: 200,
      statusText: 'OK',
      responseText: '{"nickname": "vnues"}',
      responseHeaders: {
        'Content-Type': 'application/json',
      },
    });
    setTimeout(() => {
      expect(request.url).toBe('https://base.com/base/info?name=nillwang');
      expect(request.method).toBe('GET');
      expect(response!.data).toEqual({ nickname: 'vnues' });
    }, 100);
  });

  // 测试是否支持多host
  it('should be called with qqServer', async () => {
    client.apis.getBaseInfoById({ rest: { id: '12' } });
    const request = await getAjaxRequest();
    expect(request.method).toEqual('GET');
    expect(request.url).toEqual('https://production.com/base/info/12');
  });

  it('should be error restful url', async () => {
    client.apis.getBaseInfoById({ rest: { nick: '12' } });
    const request = await getAjaxRequest();
    expect(request.url).toEqual('https://production.com/base/info/:id');
  });

  // 测试拦截器
  it('interceptors should be called', async () => {
    const reqFn = jest.fn((config) => {
      console.log('请求中间拦截器1');
      const reConf = { ...config };
      reConf.headers.Authorization = 'Bearer';
      return reConf;
    });
    const reqErrFn = jest.fn((error) => Promise.reject(error));
    const resFn = jest.fn((config) => {
      console.log('请求中间拦截器2');
      const reConf = { ...config };
      reConf.headers.Authorization = 'Bearer';
      return reConf;
    });
    const resErrFn = jest.fn((error) => Promise.reject(error));
    Client.useReq(reqFn, reqErrFn);
    Client.useReq(resFn, resErrFn);
    const client = Client.create(serverMap, apiMap);
    client.apis.getBaseInfo({});
    const request = await getAjaxRequest();
    request.respondWith({
      status: 200,
      statusText: 'OK',
      responseText: '{"foo": "bar"}',
      responseHeaders: {
        'Content-Type': 'application/json',
      },
    });
    setTimeout(() => {
      expect(reqFn).toHaveBeenCalled();
      expect(reqErrFn).not.toHaveBeenCalled();
      expect(resFn).toHaveBeenCalled();
      expect(reqErrFn).not.toHaveBeenCalled();
    }, 100);
  });

  // 测试是否支持restful
  it('should be support restful', async () => {
    client.apis.getUserInfo({ rest: { id: '20', age: 18 } });
    const request = await getAjaxRequest();
    expect(request.method).toEqual('POST');
    expect(request.url).toEqual('https://production.com/user/20/info/18');
  });

  it('should be error with 500 status', async () => {
    const fn = jest.fn();
    client.apis.getBaseInfo({}).catch(fn);
    const request = await getAjaxRequest();
    request.respondWith({
      status: 500,
    });
    setTimeout(() => {
      expect(fn).toHaveBeenCalled();
    }, 100);
  });

  it('test request', async () => {
    client.request('https://production.com/user/:id/info/:age', { method: 'GET', rest: { id: '20', age: 18 } });
    const request = await getAjaxRequest();
    expect(request.method).toEqual('GET');
    expect(request.url).toEqual('https://production.com/user/20/info/18');
  });

  it('test request', async () => {
    client.get('https://production.com/user/:id/info/:age', { rest: { id: '20', age: 18 } });
    const request = await getAjaxRequest();
    expect(request.method).toEqual('GET');
    expect(request.url).toEqual('https://production.com/user/20/info/18');
  });
  it('test POST', async () => {
    client.post('https://production.com/user/:id/info/:age', { rest: { id: '20', age: 18 } });
    const request = await getAjaxRequest();
    expect(request.method).toEqual('POST');
    expect(request.url).toEqual('https://production.com/user/20/info/18');
  });

  it('test PUT', async () => {
    client.put('https://production.com/user/:id/info/:age', { rest: { id: '20', age: 18 } });
    const request = await getAjaxRequest();
    expect(request.method).toEqual('PUT');
    expect(request.url).toEqual('https://production.com/user/20/info/18');
  });

  it('test DELETE', async () => {
    client.delete('https://production.com/user/:id/info/:age', { rest: { id: '20', age: 18 } });
    const request = await getAjaxRequest();
    expect(request.method).toEqual('DELETE');
    expect(request.url).toEqual('https://production.com/user/20/info/18');
  });

  it('test PATCH', async () => {
    client.patch('https://production.com/user/:guildID/info/:age', {
      method: 'PATCH',
      rest: { guildID: '20', age: 18 },
    });
    const request = await getAjaxRequest();
    expect(request.method).toEqual('PATCH');
    expect(request.url).toEqual('https://production.com/user/20/info/18');
  });
});
