var axios = require("axios");
var FormData = require("form-data");
var common = require("../common/shared");
var options = common.options;
var messagePayloads = require("./payloads/messagePayloads");
let _fwuid = "Q8onN6EmJyGRC51_NSPc2A";
var https = require("https");

const axiosRetry = require("axios-retry");
//axiosRetry(axios, { retries: 2 });
module.exports = {
  axios: axios,
  FormData: FormData,
  postMessage: postMessage,
  postMessageToURI: postMessageToURI,
  messagePayloads: messagePayloads,
  queryObject: queryObject,
  setExpectedFWUID: setExpectedFWUID,
  fwuid: function () {
    return _fwuid;
  },
};

let _queryObjectMessage = messagePayloads.objectQueryMessage;

function setSObjectApiName(entityName) {
  _queryObjectMessage.actions[0].params.entityNameOrId = entityName;
  return _queryObjectMessage;
}

function setExpectedFWUID(responseString) {
  let regex = /Expected: ([^ ]+) Actual/;
  let match = regex.exec(responseString);
  if (match) {
    _fwuid = match[1];
  }
  return _fwuid;
}

async function queryObject(sobjectApiName = "User", count = 5) {
  _queryObjectMessage.actions[0].params.pageSize = count;
  console.log("Querying sObject: " + sobjectApiName);
  return postMessage(setSObjectApiName(sobjectApiName));
}

async function postMessage(message) {
  return postMessageToURI(
    message,
    "/aura?r=1&ui-instrumentation-components-beacon.InstrumentationBeacon.sendData=1"
  );
}

async function postMessageToURI(message, uri) {
  var data = new FormData();
  data.append("message", JSON.stringify(message));
  data.append(
    "aura.context",
    '{"mode":"PROD","fwuid":"' +
      _fwuid +
      '","app":"siteforce:communityApp","loaded":{"APPLICATION@markup://siteforce:communityApp":"Lxj49OM4CA4D42prjs-b3A","COMPONENT@markup://forceCommunity:embeddedServiceSidebar":"YnVfpOlsFRX8BKuoL9afPA"},"dn":[],"globals":{},"uad":false}'
  );
  data.append("aura.token", options.auraToken || "undefined");
  let urlPath = options.getURL();
  let headerCookie =
    "renderCtx=%7B%22pageId%22%3A%22cd153cfc-9eb3-4da0-ac93-58834cae5f40%22%2C%22schema%22%3A%22Published%22%2C%22viewType%22%3A%22Published%22%2C%22brandingSetId%22%3A%221775e352-2ae8-4392-89f3-88cd827f1812%22%2C%22audienceIds%22%3A%226Aut0000000PBM8%22%7D; pctrk=eeb871a6-fb25-4839-b63e-3cf5bf61e7f8; ";
  if (options.sessionToken && options.sessionToken.length > 0) {
    headerCookie += "sid=" + options.sessionToken;
    +";";
  }
  var config = {
    method: "post",
    url: `${urlPath}${uri}`,
    httpsAgent: new https.Agent({ keepAlive: true }),
    headers: {
      Connection: "keep-alive",
      "sec-ch-ua":
        '"Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"',
      DNT: "1",
      "sec-ch-ua-mobile": "?0",
      "X-SFDC-Page-Scope-Id": "c950e899-ed9b-4c05-9828-c9736c26cefd",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
      "X-SFDC-Request-Id": "762570000441c985d5",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      Accept: "*/*",
      Origin: urlPath,
      "Sec-Fetch-Site": "same-origin",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Dest": "empty",
      Referer: options.host + "/s/",
      "Accept-Language": "en-US,en;q=0.9",
      Cookie: headerCookie,
      ...data.getHeaders(),
    },
    data: data,
  };

  ax = axios(config)
    .then(function (response) {
      return response.data;
    })
    .catch((error) => {
      return common.errorHandler.handleAxiosCatch(error);
    });

  return ax;
}
