var client = require('../common/axiosClient');

async function run() {
    return client.postMessage(client.messagePayloads.getProfileMenuMessage)
    .then(d=>{
        console.dir(d,{depth:null})
    });
}

module.exports.run = run;
if (require.main === module) {
    run();
}