var common = require("../common/shared");
var client = require("../common/axiosClient");
var recordListParser = require("../common/payloads/parsers/recordList");
var retried = false;
async function run(entityNameOrId = "User") {
  data = await client.queryObject(entityNameOrId, common.argv.count);
  if (
    typeof data === "string" &&
    data.includes("markup://aura:clientOutOfSync") &&
    !retried
  ) {
    console.error("Client out of sync");
    client.setExpectedFWUID(data);
    console.log("Retrying with new FWUID: " + client.fwuid());
    retried = true;
    return run(entityNameOrId);
  }
  return recordListParser.parse(data);
}

module.exports.run = run;
if (require.main === module) {
  const cli = require("../cli");
  cli.cli();
}
