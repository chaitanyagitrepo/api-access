var common = require("../common/shared");
var client = require("../common/axiosClient");
var crudParser = require("../common/payloads/parsers/crud");
var retried = false;
async function run(entityNameOrId = "User") {
  data = await client.postMessage(
    client.messagePayloads.getObjectInfoMessage(entityNameOrId)
  );
  if (
    typeof data === "string" &&
    data.includes("markup://aura:clientOutOfSync") &&
    !retried
  ) {
    console.error("Client out of sync");
    client.setExpectedFWUID(data);
    console.log("Retrying with new FWUID: " + client.fwuid());
    retried = true;
    return await run(entityNameOrId);
  }
  return data;
}

async function getValue(entityNameOrId = "User") {
  return crudParser.parse(await run(entityNameOrId));
}

// function process(data) {
//   try {
//     if (data.actions !== undefined) {
//       let action = data.actions[0];
//       let returnVal = action.returnValue;
//       let error = action.error.length > 0 ? action.error[0] : null;
//       if (error) {
//         let errData = error.event.attributes.values.error.data;
//         if (errData.message.endsWith("is not supported in UI API")) {
//           return "Not Vulnerable >> " + errData.message;
//         } else if (errData.statusCode == 403) {
//           return "No Access >> " + errData.errorCode;
//         } else {
//           return errData;
//         }
//       } else {
//         let result = (({
//           createable,
//           queryable,
//           updateable,
//           deletable,
//           searchable,
//         }) => ({
//           createable,
//           queryable,
//           updateable,
//           deletable,
//           searchable,
//         }))(returnVal);
//         return result;
//       }
//     } else {
//       return " *** ERROR: data.actions was undefined >>> " + data.status;
//     }
//   } catch (ex) {
//     console.dir(ex, { depth: 2 });
//     return ex;
//   }
// }

module.exports.run = run;
module.exports.getValue = getValue;
if (require.main === module) {
  const cli = require("../cli");
  cli.cli();
}
