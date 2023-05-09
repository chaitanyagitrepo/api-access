var common = require("../common/shared");
var client = require("../common/axiosClient");

let retried = false;

async function run() {
  if (common.options.host) {
    data = await client.postMessage(client.messagePayloads.configMessage);

    if (
      typeof data === "string" &&
      data.includes("markup://aura:clientOutOfSync") &&
      !retried
    ) {
      console.error("Client out of sync");
      client.setExpectedFWUID(data);
      console.log("Retrying with new FWUID: " + client.fwuid());
      retried = true;
      return run();
    }
    try {
      if (retried && data?.actions[0].state !== "SUCCESS") {
        console.error(data);
        return { error: "Something went wrong. Check console for details." };
      }
    } catch (ex) {}
    return data;
  } else {
    console.error(
      "Invalid environment variables HOST and SITE.  Check your .env file"
    );
    return { error: "Invalid environment variables HOST and SITE" };
  }
}

module.exports.getSObjectsFromConfig = getSObjectsFromConfig;
function getSObjectsFromConfig(payload) {
  if (payload.Response == "ERROR") {
    return [];
  }
  try {
    let sobjects = payload.actions[0].returnValue.apiNamesToKeyPrefixes;
    let sobjectsToQuery = Object.keys(sobjects);
    return sobjectsToQuery.sort((a, b) => a.localeCompare(b));
  } catch (ex) {
    console.dir(payload, { depth: 4 });
    return ex;
  }
}

module.exports.run = run;
if (require.main === module) {
  run();
}
