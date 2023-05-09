// Set the below value if you are getting "UNABLE_TO_VERIFY_LEAF_SIGNATURE" errors
//process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var express = require("express");
const bodyParser = require("body-parser");
const open = require("open");
var app = express();
const port = 3000;
app.use(express.static("web-app"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let resultsMap = new Map();
let errorsMap = new Map();

function looseJsonParse(obj) {
  return eval(`(${obj})`);
}

app
  .route("/api")
  .get(function (req, res) {
    res.send("Nothing to see here");
  })
  .post(function (req, res) {
    resultsMap = new Map();
    errorsMap = new Map();
    console.dir(req.body);
    const config = require("./callers/getConfig");
    var common = require("./common/shared");
    common.options.host = req.body.host;
    common.options.site = req.body.site;
    common.options.tlsRejectUnauthorized = !req.body.tlsAcceptInvalidCert;
    common.options.sessionToken = req.body.sessionToken;
    common.options.auraToken = req.body.auraToken;
    common.argv.count = req.body.count ? req.body.count : common.argv.count;
    queryRecords = req.body.getRecords;
    common.argv.customAction = req.body.customAction;
    config
      .run()
      .then((configData) => {
        if (configData.Response == "ERROR") {
          if (
            configData.statusText ==
            "404 not found - Invalid URL or lightning featured have been disabled for Guest users"
          ) {
            res.json({
              response:
                configData.Url +
                common.options.site +
                " does not appear to be vulnerable to this exploit",
              error_message:
                "Invalid URL or lightning featured have been disabled for Guest users",
              options: {
                host: common.options.host,
                site: common.options.site,
                tlsRejectUnauthorized: common.options.tlsRejectUnauthorized,
              },
            });
          } else {
            res.json({
              response: configData.Response,
              error_message: configData.statusText,
              options: {
                host: common.options.host,
                site: common.options.site,
                tlsRejectUnauthorized: common.options.tlsRejectUnauthorized,
              },
            });
          }
          res.end();
        } else {
          let promiseArray = [];
          if (req.body.queryall) {
            let cdata = config.getSObjectsFromConfig(configData);
            resultsMap = new Map(cdata.map((name) => [name, "NOT CHECKED"]));
            for (let key of resultsMap.keys()) {
              promiseArray.push(checkSObjectData(key, req.body.getrecords));
            }
          } else if (req.body.sobjects) {
            objects = req.body.sobjects.split(",");
            trimmed = objects.map((s) => s.trim());
            unique = [...new Set(trimmed)];
            sorted = unique.sort((a, b) => a.localeCompare(b));
            for (let sobj of sorted) {
              promiseArray.push(
                checkSObjectData(sobj.trim(), req.body.getrecords)
              );
            }
          } else if (common.argv.customAction) {
            console.log("Running custom action");
            let ca = looseJsonParse(common.argv.customAction);
            console.log(ca);
            let sendCustomAction = require("./callers/customAction");
            sendCustomAction.run(ca).then((data) => {
              res.json(data);
              res.end();
            });
          } else {
            res.json(configData);
            res.end();
          }

          if (promiseArray.length > 0) {
            Promise.all(promiseArray)
              .then(async () => {
                let resultsObj = Object.fromEntries(resultsMap);
                var sortedResults = Object.keys(resultsObj)
                  .sort()
                  .reduce((objEntries, key) => {
                    objEntries[key] = resultsObj[key];
                    return objEntries;
                  }, {});
                res.json(sortedResults);
                console.dir(sortedResults, { depth: 6 });
                console.log("Total Queries: " + promiseArray.length);
                res.end();
              })
              .catch((error) => {
                console.error(error);
              });
          }
        }
      })
      .catch((error) => {
        console.error(error);
        res.json(error.statusText);
        res.end();
      });
  });

// To start the web UI without automatically opening the browser, run the following command:
// node web -s
app.listen(port, () => {
  console.log("Express started on port 3000");
  console.log("URL: http://localhost:3000");
  let silent = false;
  if (argv.length > 2) {
    let opts = argv.slice(2);
    silent = opts[0] == "-s";
  }
  if (!silent) {
    open("http://localhost:3000");
  }
});

let getData = require("./callers/getData");
let checkAccess = require("./callers/checkAccess");
const { argv } = require("process");
async function checkSObjectData(sObject, getRecordData = false) {
  await checkAccess
    .getValue(sObject)
    .then(async (data) => {
      if (getRecordData && data.queryable) {
        let recs = await getRecords(sObject);
        data.records = recs;
      }
      setResults(sObject, data);
    })
    .catch((err) => {
      console.dir(err, { depth: 2 });
      setErrors(sObject, err);
    });
}

async function getRecords(sObject) {
  let records = await getData
    .run(sObject)
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return { error: err };
    });
  return records;
}

function setResults(k, v) {
  resultsMap.set(k, v);
}

function setErrors(k, v) {
  errorsMap.set(k, v);
  setResults(k, "*** ERROR ***");
}
