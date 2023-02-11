const http = require("http");
const httpProxy = require("http-proxy");
const HttpProxyRules = require("http-proxy-rules");

const main = async () => {
  const port = process.env.PORT || 8080;
  var proxyRules = new HttpProxyRules({
    rules: {
      "/api/(.*)": "http://localhost:1757/$1",
    },
    default: "http://localhost:3000",
  });

  let proxy = httpProxy.createProxyServer();

  http
    .createServer(function (req, res) {
      // a match method is exposed on the proxy rules instance
      // to test a request to see if it matches against one of the specified rules
      var target = proxyRules.match(req);
      if (target) {
        return proxy.web(req, res, {
          target: target,
        });
      }

      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end(
        "The request url and path did not match any of the listed rules!"
      );
    })
    .listen(port);
};

main().catch((err) => {
  console.error(err);
});
