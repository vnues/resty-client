<p align="center">
<h1 align="center">resty-client</h1>
<p align="center">Simple HTTP and REST client library which base on axios for Browser and Node  (inspired by Go resty)</p>
<p align="center"><a href="#features">Features</a> section describes in detail about Resty capabilities</p>
</p>

## Features

- GET, POST, PUT, DELETE, HEAD, PATCH, OPTIONS, etc.
- Simple methods for settings and request
- Resty client HTTP & REST Request and Response middlewares
- Centralized management of request interface

## Installation

```bash
npm i resty-client --save-dev
```

## Usage

The following samples will assist you to become as comfortable as possible with resty library.

```ts
import resty from 'resty-client';
```

#### Request Config

> These are the available config options for making requests. Only the url is required. Requests will default to GET if method is not specified. See [axios docs](https://github.com/axios/axios#request-config)

```ts
{
  // `url` is the server URL that will be used for the request
  url: '/user',

  // `method` is the request method to be used when making the request
  method: 'get', // default

  // `baseURL` will be prepended to `url` unless `url` is absolute.
  // It can be convenient to set `baseURL` for an instance of axios to pass relative URLs
  // to methods of that instance.
  baseURL: 'https://some-domain.com/api/',

  // `transformRequest` allows changes to the request data before it is sent to the server
  // This is only applicable for request methods 'PUT', 'POST', 'PATCH' and 'DELETE'
  // The last function in the array must return a string or an instance of Buffer, ArrayBuffer,
  // FormData or Stream
  // You may modify the headers object.
  transformRequest: [function (data, headers) {
    // Do whatever you want to transform the data

    return data;
  }],

  // `transformResponse` allows changes to the response data to be made before
  // it is passed to then/catch
  transformResponse: [function (data) {
    // Do whatever you want to transform the data

    return data;
  }],

  // `headers` are custom headers to be sent
  headers: {'X-Requested-With': 'XMLHttpRequest'},

  // `params` are the URL parameters to be sent with the request
  // Must be a plain object or a URLSearchParams object
  params: {
    ID: 12345
  },

  // `paramsSerializer` is an optional function in charge of serializing `params`
  // (e.g. https://www.npmjs.com/package/qs, http://api.jquery.com/jquery.param/)
  paramsSerializer: function (params) {
    return Qs.stringify(params, {arrayFormat: 'brackets'})
  },

  // `data` is the data to be sent as the request body
  // Only applicable for request methods 'PUT', 'POST', 'DELETE , and 'PATCH'
  // When no `transformRequest` is set, must be of one of the following types:
  // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
  // - Browser only: FormData, File, Blob
  // - Node only: Stream, Buffer
  data: {
    firstName: 'Fred'
  },

  // syntax alternative to send data into the body
  // method post
  // only the value is sent, not the key
  data: 'Country=Brasil&City=Belo Horizonte',

  // `timeout` specifies the number of milliseconds before the request times out.
  // If the request takes longer than `timeout`, the request will be aborted.
  timeout: 1000, // default is `0` (no timeout)

  // `withCredentials` indicates whether or not cross-site Access-Control requests
  // should be made using credentials
  withCredentials: false, // default

  // `adapter` allows custom handling of requests which makes testing easier.
  // Return a promise and supply a valid response (see lib/adapters/README.md).
  adapter: function (config) {
    /* ... */
  },

  // `auth` indicates that HTTP Basic auth should be used, and supplies credentials.
  // This will set an `Authorization` header, overwriting any existing
  // `Authorization` custom headers you have set using `headers`.
  // Please note that only HTTP Basic auth is configurable through this parameter.
  // For Bearer tokens and such, use `Authorization` custom headers instead.
  auth: {
    username: 'janedoe',
    password: 's00pers3cret'
  },

  // `responseType` indicates the type of data that the server will respond with
  // options are: 'arraybuffer', 'document', 'json', 'text', 'stream'
  //   browser only: 'blob'
  responseType: 'json', // default

  // `responseEncoding` indicates encoding to use for decoding responses (Node.js only)
  // Note: Ignored for `responseType` of 'stream' or client-side requests
  responseEncoding: 'utf8', // default

  // `xsrfCookieName` is the name of the cookie to use as a value for xsrf token
  xsrfCookieName: 'XSRF-TOKEN', // default

  // `xsrfHeaderName` is the name of the http header that carries the xsrf token value
  xsrfHeaderName: 'X-XSRF-TOKEN', // default

  // `onUploadProgress` allows handling of progress events for uploads
  // browser only
  onUploadProgress: function (progressEvent) {
    // Do whatever you want with the native progress event
  },

  // `onDownloadProgress` allows handling of progress events for downloads
  // browser only
  onDownloadProgress: function (progressEvent) {
    // Do whatever you want with the native progress event
  },

  // `maxContentLength` defines the max size of the http response content in bytes allowed in node.js
  maxContentLength: 2000,

  // `maxBodyLength` (Node only option) defines the max size of the http request content in bytes allowed
  maxBodyLength: 2000,

  // `validateStatus` defines whether to resolve or reject the promise for a given
  // HTTP response status code. If `validateStatus` returns `true` (or is set to `null`
  // or `undefined`), the promise will be resolved; otherwise, the promise will be
  // rejected.
  validateStatus: function (status) {
    return status >= 200 && status < 300; // default
  },

  // `maxRedirects` defines the maximum number of redirects to follow in node.js.
  // If set to 0, no redirects will be followed.
  maxRedirects: 5, // default

  // `socketPath` defines a UNIX Socket to be used in node.js.
  // e.g. '/var/run/docker.sock' to send requests to the docker daemon.
  // Only either `socketPath` or `proxy` can be specified.
  // If both are specified, `socketPath` is used.
  socketPath: null, // default

  // `httpAgent` and `httpsAgent` define a custom agent to be used when performing http
  // and https requests, respectively, in node.js. This allows options to be added like
  // `keepAlive` that are not enabled by default.
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),

  // `proxy` defines the hostname, port, and protocol of the proxy server.
  // You can also define your proxy using the conventional `http_proxy` and
  // `https_proxy` environment variables. If you are using environment variables
  // for your proxy configuration, you can also define a `no_proxy` environment
  // variable as a comma-separated list of domains that should not be proxied.
  // Use `false` to disable proxies, ignoring environment variables.
  // `auth` indicates that HTTP Basic auth should be used to connect to the proxy, and
  // supplies credentials.
  // This will set an `Proxy-Authorization` header, overwriting any existing
  // `Proxy-Authorization` custom headers you have set using `headers`.
  // If the proxy server uses HTTPS, then you must set the protocol to `https`.
  proxy: {
    protocol: 'https',
    host: '127.0.0.1',
    port: 9000,
    auth: {
      username: 'mikeymike',
      password: 'rapunz3l'
    }
  },

  // `cancelToken` specifies a cancel token that can be used to cancel the request
  // (see Cancellation section below for details)
  cancelToken: new CancelToken(function (cancel) {
  }),

  // an alternative way to cancel Axios requests using AbortController
  signal: new AbortController().signal,

  // `decompress` indicates whether or not the response body should be decompressed
  // automatically. If set to `true` will also remove the 'content-encoding' header
  // from the responses objects of all decompressed responses
  // - Node only (XHR cannot turn off decompression)
  decompress: true // default

  // `insecureHTTPParser` boolean.
  // Indicates where to use an insecure HTTP parser that accepts invalid HTTP headers.
  // This may allow interoperability with non-conformant HTTP implementations.
  // Using the insecure parser should be avoided.
  // see options https://nodejs.org/dist/latest-v12.x/docs/api/http.html#http_http_request_url_options_callback
  // see also https://nodejs.org/en/blog/vulnerability/february-2020-security-releases/#strict-http-header-parsing-none
  insecureHTTPParser: undefined // default

  // transitional options for backward compatibility that may be removed in the newer versions
  transitional: {
    // silent JSON parsing mode
    // `true`  - ignore JSON parsing errors and set response.data to null if parsing failed (old behaviour)
    // `false` - throw SyntaxError if JSON parsing failed (Note: responseType must be set to 'json')
    silentJSONParsing: true, // default value for the current Axios version

    // try to parse the response string as JSON even if `responseType` is not 'json'
    forcedJSONParsing: true,

    // throw ETIMEDOUT error instead of generic ECONNABORTED on request timeouts
    clarifyTimeoutError: false,
  }
}


```

#### Response Schema

> The response for a request contains the following information. See [axios docs](https://github.com/axios/axios#response-schema)

```ts
{
  // `data` is the response that was provided by the server
  data: {},

  // `status` is the HTTP status code from the server response
  status: 200,

  // `statusText` is the HTTP status message from the server response
  statusText: 'OK',

  // `headers` the HTTP headers that the server responded with
  // All header names are lower cased and can be accessed using the bracket notation.
  // Example: `response.headers['content-type']`
  headers: {},

  // `config` is the config that was provided to `axios` for the request
  config: {},

  // `request` is the request that generated this response
  // It is the last ClientRequest instance in node.js (in redirects)
  // and an XMLHttpRequest instance in the browser
  request: {}
}


```

#### Simple GET

```ts
// Create a Resty Client
client := resty.create()

client.get("https://user/:id",{
  rest:{
        id:12345
    }
}).then((res)=>{
  console.log(res)
}).catch((err)=>{
    console.log(err)
})
```

#### Simple POST

```ts
// Create a Resty Client
client := resty.create()

client.post("https://user/:id",{
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone'
  },
  rest:{
        id:12345
    }
}).then((res)=>{
  console.log(res)
}).catch((err)=>{
    console.log(err)
})
```

#### Sample PUT

```ts
// Create a Resty Client
client := resty.create()

client.put("https://user/:id",{
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone'
  },
  rest:{
        id:12345
    }
}).then((res)=>{
  console.log(res)
}).catch((err)=>{
    console.log(err)
})
```

#### Sample PATCH

You can use various combinations of `PATCH` method call like demonstrated for `POST`.

```ts
// Create a Resty Client
client := resty.create()

client.patch("https://user/:id",{
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone'
  },
  rest:{
        id:12345
    }
}).then((res)=>{
  console.log(res)
}).catch((err)=>{
    console.log(err)
})
```

#### Interface Collection

- Unified interface management
- Support multi-host configuration

```ts
// server
const serverMap = {
  baseServer: {
    baseMap: {},
    baseURL: 'https://base.com',
    default: true,
  },
  qqServer: {
    baseMap: {},
    baseURL: 'https://qq.com',
  },
};
// apis
const apiMap = {
  getBaseInfo: {
    method: 'get',
    url: '/base/info',
  },
  getBaseRestInfo: {
    method: 'get',
    url: '/base/user/:id',
    server: 'qqServer',
  },
};
//interceptor
resty.useReq(
  (config) => {
    console.log('middleware');
    const reConf = { ...config };
    reConf.headers.Authorization = 'Bearer';
    return reConf;
  },
  (error) => Promise.reject(error),
);
// interceptor
resty.useReq(
  (config) => {
    console.log('middleware');
    const reConf = { ...config };
    reConf.headers.Authorization = 'Bearer';
    return reConf;
  },
  (error) => Promise.reject(error),
);
// interceptor
resty.useRes(
  (result) => {
    console.log('middleware');
    return result;
  },
  (error) => Promise.reject(error),
);
// the client instance
const client = resty.create(serverMap, apiMap);

// getBaseInfo request method
client.apis.getBaseInfo({ params: { name: 'hello' } }).then((res) => {
  console.log(res);
});

// getBaseRestInfo request method
client.apis.getBaseRestInfo({ rest: { id: 9527, test: 250 } }).then((res) => {
  console.log(res);
});
```

#### Instance

> If you want to operate the axios instance, you can operate it through the client.instance object,See [axios docs](https://github.com/axios/axios)

```ts
import resty from 'resty-client';
const client = resty.create();
// get client instance
console.log(client.instance);
```
