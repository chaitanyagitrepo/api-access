let parser = {
  parse: function (data) {
    let retVal = {
      records: {
        result: [],
        actualCurrentPage: 0,
      },
    };
    try {
      retVal = data.actions[0].returnValue;
    } catch (ex) {
      console.dir(ex, { depth: 4 });
    }
    return retVal;
  },
};

module.exports = {
  parse: parser.parse,
};
