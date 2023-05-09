//https://www.enumerated.ie/index/salesforce
let messagePayloads = {
  configMessage: {
    actions: [
      {
        id: "123;a",
        descriptor:
          "serviceComponent://ui.force.components.controllers.hostConfig.HostConfigController/ACTION$getConfigData",
        callingDescriptor: "UNKNOWN",
        params: {},
      },
    ],
  },
  getObjectInfoMessage: function (entityNameOrId = "User") {
    return {
      actions: [
        {
          id: "1;a",
          descriptor: "aura://RecordUiController/ACTION$getObjectInfo",
          callingDescriptor: "UNKNOWN",
          params: { objectApiName: entityNameOrId },
        },
      ],
    };
  },
  getListsByObjectName: function (entityNameOrId = "User") {
    return {
      actions: [
        {
          id: "1;a",
          descriptor: "aura://ListUiController/ACTION$getListsByObjectName",
          callingDescriptor: "UNKNOWN",
          params: { objectApiName: entityNameOrId },
        },
      ],
    };
  },
  objectQueryMessage: {
    actions: [
      {
        id: "123;a",
        descriptor:
          "serviceComponent://ui.force.components.controllers.lists.selectableListDataProvider.SelectableListDataProviderController/ACTION$getItems",
        callingDescriptor: "UNKNOWN",
        params: {
          entityNameOrId: "User",
          layoutType: "FULL",
          pageSize: 5,
          currentPage: 0,
          useTimeout: false,
          getCount: true,
          enableRowActions: false,
        },
      },
    ],
  },
  getProfileMenuMessage: {
    actions: [
      {
        id: "123;a",
        descriptor:
          "serviceComponent://ui.self.service.components.profileMenu.ProfileMenuController/ACTION$getProfileMenuResponse",
        callingDescriptor: "UNKNOWN",
        params: {},
      },
    ],
  },
  getLookupItemsMessage: {
    actions: [
      {
        id: "123;a",
        descriptor:
          "serviceComponent://ui.search.components.forcesearch.scopedresultsdataprovider.ScopedResultsDataProviderController/ACTION$getLookupItems",
        callingDescriptor: "UNKNOWN",
        params: {
          scope: "User",
          term: "script",
          pageSize: 10,
          currentPage: 1,
          enableRowActions: false,
          additionalFields: [],
          useADS: false,
        },
      },
    ],
  },
  apexActionExecuteMessage: {
    actions: [
      {
        id: "123;a",
        descriptor: "aura://ApexActionController/ACTION$execute",
        callingDescriptor: "UNKNOWN",
        params: {
          namespace: "",
          classname: "<APEX_CLASSNAME>",
          method: "<APEX_METHOD>",
          params: {},
          cacheable: false,
          isContinuation: false,
        },
      },
    ],
  },
};

//let _searchURITemplate = "/auraCmpDef?aura.app=markup://siteforce:communityApp&_au={{VALUE}}&_def=markup://forceSearch:resultsGridLVMDataManager";

module.exports = {
  configMessage: messagePayloads.configMessage,
  objectQueryMessage: messagePayloads.objectQueryMessage,
  getProfileMenuMessage: messagePayloads.getProfileMenuMessage,
  getLookupItemsMessage: messagePayloads.getLookupItemsMessage,
  apexActionExecuteMessage: messagePayloads.apexActionExecuteMessage,
  getObjectInfoMessage: messagePayloads.getObjectInfoMessage,
  getListsByObjectName: messagePayloads.getListsByObjectName,
};
