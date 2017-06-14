'use strict';

const http = require('http');

function selectRedirectPort(opts) {
  return (opts.redirectPort) ? opts.redirectPort : opts.securedServerPort;
}

function configureUnsecuredTrafficRedirect(opts) {
  opts.unSecuredServerPort = opts.unSecuredServerPort || 8080;
  const unsecuredServer = http.createServer();
  const redirectPort = selectRedirectPort(opts);
  unsecuredServer.on('request', (req, res) => {
    try {
      const portlessHost = (req.headers.host.indexOf(':') > -1) ? req.headers.host.substring(0, req.headers.host.indexOf(':')) : req.headers.host;
      const portSuffix = (redirectPort === 443) ? '' : `:${redirectPort}`;
      res.setHeader(
        'Location', `https://${portlessHost}${portSuffix}${req.url}`
      );
      res.statusCode = 302;
      res.end();
    } catch (err) {
      console.log('ERROR: ' + err + '\nwhile serving request ' + req);
      res.statusCode = 500;
      res.end();
    }
  });
  unsecuredServer.listen(opts.unSecuredServerPort, () => {
    console.log(`\nRedirecting all HTTP traffic on port ${opts.unSecuredServerPort} to HTTPS on port ${redirectPort}\n`);
  });
  return {
    close: function () {
      unsecuredServer.close();
    }
  };
}

module.exports = {
  start: function (opts) {
    return configureUnsecuredTrafficRedirect(opts);
  }
};
