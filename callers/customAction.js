var common = require("../common/shared");
var client = require("../common/axiosClient");
var retried = false;
async function run(customAction) {
  if (customAction === null || customAction === undefined) {
    return "No custom action specified";
  }

  data = await client.postMessage(customAction);
  if (
    typeof data === "string" &&
    data.includes("markup://aura:clientOutOfSync") &&
    !retried
  ) {
    console.error("Client out of sync");
    client.setExpectedFWUID(data);
    console.log("Retrying with new FWUID: " + client.fwuid());
    retried = true;
    return run(customAction);
  }
  return data;
}

module.exports.run = run;
if (require.main === module) {
  const cli = require("../cli");
  cli.cli();
}
