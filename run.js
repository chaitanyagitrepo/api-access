#!/usr/bin / env node
const getConfig = require("./callers/getConfig");
const getData = require("./callers/getData");
const checkAccess = require("./callers/checkAccess");
const writer = require("./common/writer");
const common = require("./common/shared");
const e = require("express");

let resultsMap = new Map();
let errorsMap = new Map();
let recordsMap = new Map();

function run() {
  getConfig
    .run()
    .then((response) => {
      if (response.Response == "ERROR" && response.status == 404) {
        console.log({
          Response: response.Response,
          status: response.status,
          statusText: response.statusText,
        });
        console.log(
          common.options.host +
            common.options.site +
            " does not appear to be vulnerable to this exploit"
        );
        return;
      }
      let cdata = getConfig.getSObjectsFromConfig(response);
      if (cdata.length > 0) {
        resultsMap = new Map(cdata.sort().map((name) => [name, "NOT CHECKED"]));
        //Promises.All ---
        let promiseArray = [];
        for (let key of resultsMap.keys()) {
          promiseArray.push(getObjectInfo(key));
        }
        if (promiseArray.length > 0) {
          Promise.all(promiseArray)
            .then(async () => {
              let resultsObj = Object.fromEntries(resultsMap);
              console.dir(resultsMap, { depth: 2 });
              writer.saveObjToFileAsync("results.json", resultsObj);
              if (errorsMap.size > 0) {
                writer.saveObjToFileAsync(
                  "errors.json",
                  Object.fromEntries(errorsMap)
                );
              }
              if (recordsMap.size > 0) {
                writer.saveObjToFileAsync(
                  "records.json",
                  Object.fromEntries(recordsMap)
                );
              }
            })
            .catch((error) => console.error(error));
        } else {
          console.log("No SObjects to check");
        }
      } else {
        console.dir(response, { depth: 5 });
      }
    })
    .catch((error) => {
      console.dir(error, { depth: 2 });
    });
}

async function getObjectInfo(sObject) {
  let accessData = await checkAccess.getValue(sObject);
  setResults(sObject, accessData);
  let shouldQueryData =
    common.options.getRecords !== undefined ? common.options.getRecords : false;
  if (accessData.queryable && shouldQueryData) {
    let recDatas = await getData.run(sObject);
    recordsMap.set(sObject, recDatas);
  }
}

function setResults(k, v) {
  resultsMap.set(k, v);
}

function setErrors(k, v) {
  errorsMap.set(k, v);
  setResults(k, "*** ERROR ***");
}

module.exports.run = run;
if (require.main === module) {
  run();
}
