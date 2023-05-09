module.exports.callback = {};
const { option } = require("yargs");
const common = require("./common/shared");
const appName = "scanner";
const writer = require("./common/writer");
const getData = require("./callers/getData");
const checkAccess = require("./callers/checkAccess");
const runner = require("./run");

let options = common.options;

function cli() {
  const yargs = require("yargs")
    .version()
    .usage(
      `Usage: ${appName} <HOST_URL> <SITE_NAME> <NODE_TLS_REJECT_UNAUTHORIZED>`
    )
    .example(
      `${appName} -h https://hc-erm-tso-1738f968218-17421-177a6f6fd7d.force.com -s erm`,
      "Scans the https://hc-erm-tso-1738f968218-17421-177a6f6fd7d.force.com/erm site for vulnerabilities."
    )
    .example(
      `${appName} -h https://hc-erm-tso-1738f968218-17421-177a6f6fd7d.force.com -s erm -t 0`,
      "Scans the https://hc-erm-tso-1738f968218-17421-177a6f6fd7d.force.com/erm site for vulnerabilities with optional NODE_TLS_REJECT_UNAUTHORIZED set to 0/false."
    )
    .option("host-url", {
      alias: "u",
      describe: "Host URL",
      type: "url",
      nargs: 1,
      demand: true,
      demand: "Host URL is required",
    })
    .option("site-name", {
      alias: "s",
      describe: "Community Site Prefix",
      type: "string",
      nargs: 1,
    })
    .option("query-all", {
      alias: ["a", "all"],
      describe:
        "Query CRUD permissions for all sObjects returned from Config call",
      type: "boolean",
      default: false,
    })
    .option("entity", {
      alias: ["e", "sObject"],
      describe: "Query the specified sObject (Case Sensitive)",
      type: "string",
      nargs: 1,
      demand: false,
    })
    .option("count", {
      alias: ["c", "pageSize"],
      describe: "Will query record data and limit to the specified count",
      type: "number",
      nargs: 1,
      demand: false,
      default: 0,
    })
    .option("output", {
      alias: "o",
      describe: "Output Directory [Default: ./reports/<hostname>/files...]",
      type: "string",
      nargs: 1,
      demand: false,
      default: common.options.outputPath,
    })
    .option("tls-reject-unauthorized", {
      alias: "t",
      describe: "Reject calls when SSL certificate check fails",
      type: "boolean",
      nargs: 1,
    })
    .command(
      "$0",
      "Scans Community Sites for Guest Access Vulnerability: https://www.enumerated.ie/index/salesforce",
      (yargs) => {},
      async function (argv) {
        setSharedSettings(argv);
        if (argv.entity) {
          querySObject(argv.entity);
        } else {
          if (argv.a) {
            queryAll();
          } else {
            queryConfigOnly();
          }
        }
      }
    )
    .help("h")
    .alias("h", "help").argv;
}

async function querySObject(entityApiName) {
  let accessData = await checkAccess.getValue(entityApiName).then(async (d) => {
    let results = {};
    results[entityApiName] = d;
    if (options.getRecords && d.queryable) {
      if (d.queryable) {
        let records = await getData.run(entityApiName, count);
        results[entityApiName].records = records;
      } else {
        results[entityApiName].records = "Not Queryable";
      }
    }
    console.dir(results, { depth: 5 });
    return results;
  });
}


function queryConfigOnly() {
  //unless specified, only query the config
  const getConfig = require("./callers/getConfig");
  getConfig
    .run()
    .then((data) => {
      console.log(data);
      writer.saveObjToFileAsync("configResponse.json", data);
    })
    .catch(console.warn);
}

function queryAll() {
  //user specified to query all objects (making this explicit rather than the default)
  runner.run();
}

function setSharedSettings(argv) {
  options.outputPath = argv.o ? argv.o : options.outputPath;
  options.count = argv.c ? argv.c : options.count;
  options.getRecords = options.count > 0;
  //need to check for null because otherwise it always set it, ignoring what was in .env
  if (argv.u != "env") {
    ///allow for setting the env senvironment even through command line
    options.host = argv.u;
    if (argv.s != null) options.site = argv.s;
    if (argv.t != null) options.tlsRejectUnauthorized = argv.t;
  }
  common.argv = argv;
  common.HOST = options.host;
  common.SITE = options.site;
  common.options = options;
}

module.exports.cli = cli;
if (require.main === module) {
  cli();
}
