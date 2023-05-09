module.exports.handleAxiosCatch = function (error) {
  let invalidTLS = "INVALID TLS CERT";
  let errorObj = {
    Url: new URL(error.config.url).hostname,
    Response: "ERROR",
    status: error.code || 404,
    error: error,
    statusText:
      error.code == "UNABLE_TO_VERIFY_LEAF_SIGNATURE"
        ? invalidTLS
        : "404 not found - Invalid URL or lightning featured have been disabled for Guest users",
  };
  //console.error(errorObj);
  return errorObj;
};
