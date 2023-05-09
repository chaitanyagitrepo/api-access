let parsers = {
  parseConfig: function (payload) {
    return payload;
  },
  parseObjectInfo: function (payload) {
    return payload;
  },
  parseCRUD: function (data) {
    try {
      if (data.actions !== undefined) {
        let action = data.actions[0];
        let returnVal = action.returnValue;
        let error = action.error.length > 0 ? action.error[0] : null;
        if (error) {
          let errData = error.event.attributes.values.error.data;
          if (errData.message.endsWith("is not supported in UI API")) {
            return "Not Vulnerable >> " + errData.message;
          } else if (errData.statusCode == 403) {
            return "No Access >> " + errData.errorCode;
          } else {
            return errData;
          }
        } else {
          let result = (({
            createable,
            queryable,
            updateable,
            deletable,
            searchable,
          }) => ({
            createable,
            queryable,
            updateable,
            deletable,
            searchable,
          }))(returnVal);
          return result;
        }
      } else {
        return " *** ERROR: data.actions was undefined >>> " + data.status;
      }
    } catch (ex) {
      console.dir(ex, { depth: 2 });
      return ex;
    }
  },
  parseRecords: function (payload) {
    return payload;
  },
  parseListsByObjectName: function (payload) {
    return payload;
  },
};

module.exports = {
  parseConfig: parsers.parseConfig,
  parseObjectInfo: parsers.parseObjectInfo,
  parseRecords: parsers.parseRecords,
  parseListsByObjectName: parsers.parseListsByObjectName,
};
