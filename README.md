# node-simplehttps
Simple, low-config, HTTPS server with HTTP redirect for Node.js

## Installation

npm install --save https://github.com/rossharper/node-simplehttps

> Will hopefully be available via npm in the future

## Usage

### Simple Setup: HTTPS server with HTTP -> HTTPS Redirect

Create a low-config HTTPS server on port 4443 with an HTTP server on port 8080. All traffic to HTTP:8080 will be redirected to the secure server. A server certificate and key in PEM format is expected in `certs` under the working directory.

The server takes an 'app', in exactly the same way as `http.createServer`, and could be an Express app.

```js
const simplehttps = require('simplehttps');

const app = function (req, res) {
  res.write('Hello, simplehttps world.');
  res.end();
};

const server = simplehttps.start(app);
```

### Specify Ports

```js
const server = simplehttps.start(app, {
  securedServer: {
    port: 443
  },
  unsecuredServer: {
    port: 80
  }
});
```
### Configure SSL Certificate Paths (including optionally adding CA certs)

```js
const server = simplehttps.start(app, {
  securedServer: {
    serverKeyPath: '/path/to/server/key.pem',
    serverCertPath: '/path/to/server/cert.pem',
    passphrase: 'server key passphrase',
    caPath: '/path/to/pem/ca/certs/'
  }
});
```

### HTTPS Only

```js
const server = simplehttps.start(app, {
  unsecuredServer: {
    enabled: false
  }
});
```

### HTTP Only

```js
const server = simplehttps.start(app, {
  unsecuredServer: {
    redirectsToSecuredServer: false
  },
  securedServer: {
    enabled: false
  }
});
```

### Stop / Close server

```js
const server = simplehttps.start(app);

server.close();
```

### Supplying options

`.start` optionally takes an options object that can be used to configure the server. See below for the schema and defaults.

```js
{
  unsecuredServer: {
    enabled: true,
    redirectsToSecuredServer: false,
    port: 8080
  },
  securedServer: {
    enabled: true,
    port: 4443,
    serverKeyPath: 'certs/serverkey.pem', // relative to the running process' working directory
    serverCertPath: 'certs/servercert.pem',
    passphrase: '',
    caPath: undefined, // uses built-in CAs by default
    tlsOptions: undefined, // options passed through to underlying TLS server
  }
}
```
See Node.js [`tls.createServer` Documentation](https://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener) for more information on `tlsOptions` that can be passed through.

### License

```
Copyright 2016 Ross Harper

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
