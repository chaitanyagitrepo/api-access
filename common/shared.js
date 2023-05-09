const dotenv = require("dotenv");
const path = require("path");
dotenv.config();
const https = require("https");
const errorHandler = require("./util/errorHandler");

_options = {
  host: process.env.HOST,
  site: process.env.SITE,
  get tlsRejectUnauthorized() {
    return this._tlsRejectUnauthorized;
  },
  set tlsRejectUnauthorized(x) {
    this._tlsRejectUnauthorized = x;
    https.globalAgent.options.rejectUnauthorized = x;
  },
  _tlsRejectUnauthorized: process.env.TLS_REJECT_UNAUTHORIZED || true,
  getURL: function () {
    let urlPath = this.site
      ? this.host.replace(/\/+$/, "") + "/" + this.site.replace(/^\/+/, "")
      : this.host;
    if (urlPath && urlPath.endsWith("/")) {
      //urlPath += '/';
      return urlPath.slice(0, -1);
    }
    return urlPath;
  },
  outputPath: path.join(process.cwd(), "reports/"),
  sessionToken: process.env.TOKEN,
  auraToken: process.env.AURA_TOKEN,
};

module.exports = {
  HOST: _options.host, //process.env.HOST || '',
  SITE: _options.site, //process.env.SITE || '',
  folderNameFromUrl: function (useFullDomain = false) {
    let hostname = new URL(_options.host).hostname.toLowerCase();
    if (useFullDomain) return hostname;
    let isForce = hostname.endsWith(".force.com");
    return isForce ? hostname.split(".")[0] : hostname.replace(".", "_");
  },
  siteData: {},
  setSiteData: function (key, value) {
    module.exports.siteData[key] = value;
  },
  argv: {},
  options: _options,
  errorHandler: errorHandler,
  sessionToken: _options.token,
  auraToken: _options.auraToken,
};
