var common = require("../common/shared");
var client = require("../common/axiosClient");

async function run(entityNameOrId = "User", searchTerm = "****") {
  if (common.options.host) {
    let payload = client.messagePayloads.getLookupItemsMessage;
    payload.actions[0].params.scope = entityNameOrId;
    payload.actions[0].params.term = searchTerm;
    data = await client.postMessage(payload);

    if (
      typeof data === "string" &&
      data.includes("markup://aura:clientOutOfSync")
    ) {
      console.error("Client out of sync");
      client.setExpectedFWUID(data);
      console.log("Retrying with new FWUID: " + client.fwuid());
      data = await client.postMessage(payload);
    }
    console.dir(data, { depth: 4 });
    return data;
  } else {
    console.error(
      "Invalid environment variables HOST and SITE.  Check your .env file"
    );
  }
}

module.exports.run = run;
if (require.main === module) {
  run();
}
