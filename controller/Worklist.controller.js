sap.ui.define(["./BaseController",
	"./utilities",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV"
], function(BaseController, Utilities, History, MessageToast, MessageBox, JSONModel, Filter, FilterOperator, Export, ExportTypeCSV) {
	"use strict";

	return BaseController.extend("zmm005.zsrvamd.controller.Worklist", {
		handleRouteMatched: function(oEvent) {
			var sAppId = "App5fe9d7c68fe028020f80bb7a";

			var oParams = {};

			if (oEvent.mParameters.data.context) {
				this.sContext = oEvent.mParameters.data.context;

			} else {
				if (this.getOwnerComponent().getComponentData()) {
					var patternConvert = function(oParam) {
						if (Object.keys(oParam).length !== 0) {
							for (var prop in oParam) {
								if (prop !== "sourcePrototype" && prop.includes("Set")) {
									return prop + "(" + oParam[prop][0] + ")";
								}
							}
						}
					};

					this.sContext = patternConvert(this.getOwnerComponent().getComponentData().startupParameters);

				}
			}

			var oPath;

			if (this.sContext) {
				oPath = {
					path: "/" + this.sContext,
					parameters: oParams
				};
				this.getView().bindObject(oPath);
			}

		},
		_onCreateSolReq: function() {

			this.getRouter().navTo("SerAmndRequest", {
				ReqNo: '0000000000',
				Approver : false
			});

			// set all the variables to 
			var oCrtSolReq = new JSONModel({
				"Address": "",
				"Amendment": "",
				"AmericaAct": 0,
				"BillNum": "",
				"CAFund": false,
				"ChngOrd": "",
				"ChngType": "",
				"City": "",
				"ContPerson": "",
				"CtrEndDate": null,
				"CtrStartDate": null,
				"DateAppr": null,
				"Deliverables": "",
				"Department": "",
				"DescWork": "",
				"EffortTaken": "",
				"ExecOrder": 0,
				"ExecOrderNo": "",
				"Expenses": '0.00',
				"Fax": "",
				"FederalSrc": false,
				"FirmName": "",
				"IIDRevenue": false,
				"BrdAppr": false,
				"IntReq": "",
				"Mail": "",
				"Mobile": "",
				"MwaAttach": 0,
				"MwaNumber": "",
				"MwaValue": 0,
				"Nerc": 0,
				"OnDate": null,
				"OtherFund": false,
				"OtherServ": "",
				"Phone": "",
				"PurchGrp": "",
				"PurchIT": 0,
				"RepairCheck": 0,
				"ReqNo": "",
				"ReqTy": "",
				"Requestor": "",
				"SenateBill": 0,
				"SoleSrc": "",
				"SoleSrcCheck": 0,
				"Solicitation": "",
				"SolType": "",
				"Status": "",
				"Subject": "",
				"Terms": "",
				"Totval": '0.00',
				"PresentVal": '0.00',
				"PresVal2": "0.00",
				"NewVal": '0.00',
				"NoEconVal": "",
				"UnderMWA": false,
				"UniqueExp": "",
				"Value": '0.00',
				"VendorNo": "",
				"IsEdit": true,

				"ReqApprNav": [{
					"Reqno": "0000000000",
					"Mulappr": "",
					"Title": "",
					"Apprlevel": 0,
					"Apprsublevel": 0,

					"Adhoc": "",
					"Status": "",
					"Rcvddate": null,
					"Apprdate": null,
					"Apprtime": null,
					"Usrchk": false,
					"Apprname": "",
					"Comments": "",
					"Approvedby": ""

				}],

				"ReqAttachNav": [{
					"ReqNo": "0000000000",
					"DocumentId": "0000",
					"MimeType": "",
					"FileName": "",
					"Description": "",
					"CreatedDate": null,
					"CreatedBy": ""

				}],
				"ReqPRNav": [{
					"ReqNo": "0000000000"

				}]

			});

			oCrtSolReq.setDefaultBindingMode("TwoWay");
			this.getRouter()._oViews._oViews["zmm005.zsrvamd.view.SerAmndRequest"].setModel(oCrtSolReq, "oCrtSolReq");

		},
		_onEditSerAgr: function(oEvent) {

			this.getRouter().navTo("SerAmndRequest", {
				ReqNo: oEvent.getSource().getBindingContext().getProperty('ReqNo'),
				Approver : false
			});

		},

		doNavigate: function(sRouteName, oBindingContext, fnPromiseResolve, sViaRelation) {
			var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
			var oModel = (oBindingContext) ? oBindingContext.getModel() : null;

			var sEntityNameSet;
			if (sPath !== null && sPath !== "") {
				if (sPath.substring(0, 1) === "/") {
					sPath = sPath.substring(1);
				}
				sEntityNameSet = sPath.split("(")[0];
			}
			var sNavigationPropertyName;
			var sMasterContext = this.sMasterContext ? this.sMasterContext : sPath;

			if (sEntityNameSet !== null) {
				sNavigationPropertyName = sViaRelation || this.getOwnerComponent().getNavigationPropertyForNavigationWithContext(sEntityNameSet,
					sRouteName);
			}
			if (sNavigationPropertyName !== null && sNavigationPropertyName !== undefined) {
				if (sNavigationPropertyName === "") {
					this.oRouter.navTo(sRouteName, {
						context: sPath,
						masterContext: sMasterContext
					}, false);
				} else {
					oModel.createBindingContext(sNavigationPropertyName, oBindingContext, null, function(bindingContext) {
						if (bindingContext) {
							sPath = bindingContext.getPath();
							if (sPath.substring(0, 1) === "/") {
								sPath = sPath.substring(1);
							}
						} else {
							sPath = "undefined";
						}

						// If the navigation is a 1-n, sPath would be "undefined" as this is not supported in Build
						if (sPath === "undefined") {
							this.oRouter.navTo(sRouteName);
						} else {
							this.oRouter.navTo(sRouteName, {
								context: sPath,
								masterContext: sMasterContext
							}, false);
						}
					}.bind(this));
				}
			} else {
				this.oRouter.navTo(sRouteName);
			}

			if (typeof fnPromiseResolve === "function") {
				fnPromiseResolve();
			}

		},
		_onButtonPress1: function(oEvent) {

			var oBindingContext = oEvent.getSource().getBindingContext();

			return new Promise(function(fnResolve) {

				this.doNavigate("Page6", oBindingContext, fnResolve, "");
			}.bind(this)).catch(function(err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		updateBindingOptions: function(sCollectionId, oBindingData, sSourceId) {
			this.mBindingOptions = this.mBindingOptions || {};
			this.mBindingOptions[sCollectionId] = this.mBindingOptions[sCollectionId] || {};

			var aSorters = this.mBindingOptions[sCollectionId].sorters;
			var aGroupby = this.mBindingOptions[sCollectionId].groupby;

			// If there is no oBindingData parameter, we just need the processed filters and sorters from this function
			if (oBindingData) {
				if (oBindingData.sorters) {
					aSorters = oBindingData.sorters;
				}
				if (oBindingData.groupby || oBindingData.groupby === null) {
					aGroupby = oBindingData.groupby;
				}
				// 1) Update the filters map for the given collection and source
				this.mBindingOptions[sCollectionId].sorters = aSorters;
				this.mBindingOptions[sCollectionId].groupby = aGroupby;
				this.mBindingOptions[sCollectionId].filters = this.mBindingOptions[sCollectionId].filters || {};
				this.mBindingOptions[sCollectionId].filters[sSourceId] = oBindingData.filters || [];
			}

			// 2) Reapply all the filters and sorters
			var aFilters = [];
			for (var key in this.mBindingOptions[sCollectionId].filters) {
				aFilters = aFilters.concat(this.mBindingOptions[sCollectionId].filters[key]);
			}

			// Add the groupby first in the sorters array
			if (aGroupby) {
				aSorters = aSorters ? aGroupby.concat(aSorters) : aGroupby;
			}

			var aFinalFilters = aFilters.length > 0 ? [new sap.ui.model.Filter(aFilters, true)] : undefined;
			return {
				filters: aFinalFilters,
				sorters: aSorters
			};

		},
		createFiltersAndSorters: function() {
			this.mBindingOptions = {};
			var oBindingData, aPropertyFilters;
			oBindingData = {};
			oBindingData.filters = [];
			aPropertyFilters = [];

			aPropertyFilters.push(new sap.ui.model.Filter("Status", "EQ", "Initiated"));
			oBindingData.filters.push(new sap.ui.model.Filter(aPropertyFilters, false));

			this.updateBindingOptions(
				"sap_Worklist_Page_0-content-sap_m_IconTabBar-1-items-sap_m_IconTabFilter-2-content-build_simple_Table-1609164206767",
				oBindingData);
			oBindingData = {};
			oBindingData.filters = [];
			aPropertyFilters = [];

			aPropertyFilters.push(new sap.ui.model.Filter("Status", "EQ", "In Approval"));
			oBindingData.filters.push(new sap.ui.model.Filter(aPropertyFilters, false));

			this.updateBindingOptions(
				"sap_Worklist_Page_0-content-sap_m_IconTabBar-1-items-sap_m_IconTabFilter-3-content-build_simple_Table-1609164230477",
				oBindingData);
			oBindingData = {};
			oBindingData.filters = [];
			aPropertyFilters = [];

			aPropertyFilters.push(new sap.ui.model.Filter("Status", "EQ", "Approved"));
			oBindingData.filters.push(new sap.ui.model.Filter(aPropertyFilters, false));

			this.updateBindingOptions(
				"sap_Worklist_Page_0-content-sap_m_IconTabBar-1-items-sap_m_IconTabFilter-1609164249218-content-build_simple_Table-1",
				oBindingData);

		},
		applyFiltersAndSorters: function(sControlId, sAggregationName, chartBindingInfo) {
			if (chartBindingInfo) {
				var oBindingInfo = chartBindingInfo;
			} else {
				var oBindingInfo = this.getView().byId(sControlId).getBindingInfo(sAggregationName);
			}
			var oBindingOptions = this.updateBindingOptions(sControlId);
			this.getView().byId(sControlId).bindAggregation(sAggregationName, {
				model: oBindingInfo.model,
				path: oBindingInfo.path,
				parameters: oBindingInfo.parameters,
				template: oBindingInfo.template,
				templateShareable: true,
				sorter: oBindingOptions.sorters,
				filters: oBindingOptions.filters
			});

		},
		onInit: function() {
			var oViewModel,
				iOriginalBusyDelay,
				oTable = this.byId("idSrvAmndTbl");
			// Put down worklist table's original value for busy indicator delay,
			// so it can be restored later on. Busy handling on the table is
			// taken care of by the table itself.
			iOriginalBusyDelay = oTable.getBusyIndicatorDelay();
			this._oTable = oTable;
			oViewModel = new JSONModel({
				worklistTableTitle: this.getResourceBundle().getText("worklistTableTitle"),

				tableNoDataText: this.getResourceBundle().getText("tableNoDataText"),
				tableBusyDelay: 0,
				ALL: 0,
				DRAFT: 0,
				INAPPROVAL: 0,
				APPROVED: 0,
				REJECTED: 0,
				WITHDRAW: 0,
				COMPLETED: 0

			});
			this.setModel(oViewModel, "worklistView");
			// Create an object of filters
			this._mFilters = {
				"DRAFT": [new Filter("Status", FilterOperator.EQ, 'DRAFT')],
				"INAPPROVAL": [new Filter("Status", FilterOperator.EQ, 'INAPPROVAL')],
				"APPROVED": [new Filter("Status", FilterOperator.EQ, 'APPROVED')],
				"REJECTED": [new Filter("Status", FilterOperator.EQ, 'REJECTED')],
				"WITHDRAW": [new Filter("Status", FilterOperator.EQ, 'WITHDRAW')],
				"COMPLETED": [new Filter("Status", FilterOperator.EQ, 'COMPLETED')],
				"all": []
			};

			// Make sure, busy indication is showing immediately so there is no
			// break after the busy indication for loading the view's meta data is
			// ended (see promise 'oWhenMetadataIsLoaded' in AppController)
			oTable.attachEventOnce("updateFinished", function() {
				// Restore original busy indicator delay for worklist's table
				oViewModel.setProperty("/tableBusyDelay", iOriginalBusyDelay);
			});
			// var oUser = new sap.ushell.services.UserInfo();
			var oSerAmdData = {

				"filters": {
					"ReqNo": undefined,
					"Type": undefined,
					"Dept": undefined,
					"Status": undefined,
					"ReqTy": undefined,
					"Requestor": undefined
				}
			};
			this.setModel(new JSONModel(oSerAmdData), 'SerAmd');
			var oFilters = this.getModel('SerAmd').getProperty("/filters");
			var aFilter = [];
			if (oFilters.ReqTy && oFilters.ReqTy !== "") {
				aFilter.push(new Filter("ReqTy", FilterOperator.EQ, 'AMR'));
			}
			//Get Table Binding
			// var oBinding = this.getView().byId('idSrvAmndTbl').getBinding("items");
			// oBinding.filter(aFilter);
		},
		onExit: function() {},
		onExportData: function(oEvent) {
			var oResourceBundle = this.getResourceBundle();
			var oExport = new Export({
				// Type that will be used to generate the content. Own ExportType's can be created to support other formats
				exportType: new ExportTypeCSV({
					//File Extension Provided as XLS
					fileExtension: "xls",
					separatorChar: "\t",
					mimeType: "application/vnd.ms-excel",
					charset: "utf-8"
				}),
				models: this.getOwnerComponent().getModel(),
				// rows: {
				// 	path: "/ZMM_SERVAMND_REQ_SRV"
				// },
				rows: {
					path: "/ZC_WOM_REQUEST"
				},
				// column definitions with column name and binding info for the content
				columns: [{
						"name": oResourceBundle.getText("Request ID"),
						"template": {
							"content": "{ReqNo}"
						}
					}, {
						"name": oResourceBundle.getText("Request Date"),
						"template": {
							"content": "{OnDate}"
						}
					},

					// {
					// 	"name": oResourceBundle.getText("Solicitation Type"),
					// 	"template": {
					// 		"content": "{SolicitationType}"
					// 	}
					// },
					{
						"name": oResourceBundle.getText("Subject"),
						"template": {
							"content": "{Subject}"
						}
					}, {
						"name": oResourceBundle.getText("Status"),
						"template": {
							"content": "{StatusDesc}"
						}
					}, {
						"name": oResourceBundle.getText("Requestor"),
						"template": {
							"content": "{RequestorName}"
						}
					}, {
						"name": oResourceBundle.getText("Current Approver Name"),
						"template": {
							"content": "{CurrentApproverName}"
						}
					}, {
						"name": oResourceBundle.getText("Project Estimate"),
						"template": {
							"content": "{ path : 'NewVal' , type: 'sap.ui.model.type.Float', formatOptions: { minFractionDigits: 2,groupingSeparator: ',',decimalSeparator: '.', maxFractionDigits : 2 } }"
						}
					}, {
						"name": oResourceBundle.getText("Approvedon"),
						"template": {
							"content": "{ApprovedDate}"
						}
					}, {
						"name": "Approved By",
						"template": {
							"content": "{LastApprovedName}"
						}
					}

				]
			});

			// download exported file
			oExport.saveFile().catch(function(oError) {
				MessageBox.error("Error when downloading data. Browser might not be supported!\n\n" + oError);
			}).then(function() {
				oExport.destroy();
			});
		},
		onUpdateFinished: function(oEvent) {
			var sTitle,
				oTable = oEvent.getSource(),
				oViewModel = this.getModel("worklistView"),
				iTotalItems = oEvent.getParameter("total");
			// only update the counter if the length is final and

			// the table is not empty
			if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
				// Get the count for all the requests and set the value to 'ALL' property
				var oFilter = new Array();
				oFilter = [];
				oFilter[0] = new sap.ui.model.Filter("ReqTy", sap.ui.model.FilterOperator.EQ, 'SRA');
				this.getOwnerComponent().getModel().read("/ZC_WOM_REQUEST/$count", {
					success: function(oData) {
						oViewModel.setProperty("/ALL", oData);
					},
					filters: oFilter
				});
				// read the count for the draft
				oFilter = [];
				oFilter[0] = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, 'DRAFT');
				oFilter[1] = new sap.ui.model.Filter("ReqTy", sap.ui.model.FilterOperator.EQ, 'SRA');
				this.getOwnerComponent().getModel().read("/ZC_WOM_REQUEST/$count", {
					success: function(oData) {
						oViewModel.setProperty("/DRAFT", oData);
					},
					filters: oFilter
				});
				// read the count for the In Approval
				oFilter = [];
					oFilter[0] = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, 'INAPPROVAL');
				oFilter[1] = new sap.ui.model.Filter("ReqTy", sap.ui.model.FilterOperator.EQ, 'SRA');
				this.getOwnerComponent().getModel().read("/ZC_WOM_REQUEST/$count", {
					success: function(oData) {
						oViewModel.setProperty("/INAPPROVAL", oData);
					},
					filters: oFilter
				});
				// read the count for the Approved
				oFilter = [];
				oFilter[0] = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, 'APPROVED');
				oFilter[1] = new sap.ui.model.Filter("ReqTy", sap.ui.model.FilterOperator.EQ, 'SRA');
				this.getOwnerComponent().getModel().read("/ZC_WOM_REQUEST/$count", {
					success: function(oData) {
						oViewModel.setProperty("/APPROVED", oData);
					},
					filters: oFilter
				});
				// read the count for the Rejected
				oFilter = [];
					oFilter[0] = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, 'REJECTED');
				oFilter[1] = new sap.ui.model.Filter("ReqTy", sap.ui.model.FilterOperator.EQ, 'SRA');
				this.getOwnerComponent().getModel().read("/ZC_WOM_REQUEST/$count", {
					success: function(oData) {
						oViewModel.setProperty("/REJECTED", oData);
					},
					filters: oFilter

				});
				// read the count for the WITHDRAW
				oFilter = [];
					oFilter[0] = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, 'WITHDRAW');
				oFilter[1] = new sap.ui.model.Filter("ReqTy", sap.ui.model.FilterOperator.EQ, 'SRA');
				this.getOwnerComponent().getModel().read("/ZC_WOM_REQUEST/$count", {
					success: function(oData) {
						oViewModel.setProperty("/WITHDRAW", oData);
					},
					filters: oFilter
				});
				
				// read the count for the Completed
				oFilter = [];
					oFilter[0] = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, 'COMPLETED');
				oFilter[1] = new sap.ui.model.Filter("ReqTy", sap.ui.model.FilterOperator.EQ, 'SRA');
				this.getOwnerComponent().getModel().read("/ZC_WOM_REQUEST/$count", {
					success: function(oData) {
						oViewModel.setProperty("/COMPLETED", oData);
					},
					filters: oFilter
				});
				

			} else {
				sTitle = this.getResourceBundle().getText("worklistTableTitle");
			}
			this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
		},
		onQuickFilter: function(oEvent) {
			var oBinding = this._oTable.getBinding("items"),
				sKey = oEvent.getParameter("selectedKey");
			oBinding.filter(this._mFilters[sKey]);
		},
		onSearch: function(oEvent) {
			var oFilters = this.getModel('SerAmd').getProperty("/filters");
			var aFilter = [];

			//Construct Filter Array
			if (oFilters.ReqNo && oFilters.ReqNo !== "") {
				aFilter.push(new Filter("ReqNo", FilterOperator.Contains, oFilters.ReqNo));
			}
			if (oFilters.Type && oFilters.Type !== "") {
				aFilter.push(new Filter("SolType", FilterOperator.Contains, oFilters.Type));
			}
			if (oFilters.Requestor && oFilters.Requestor !== "") {
				aFilter.push(new Filter("Requestor", FilterOperator.Contains, oFilters.Requestor));
			}
			if (oFilters.Dept && oFilters.Dept !== "") {
				aFilter.push(new Filter("Department", FilterOperator.Contains, oFilters.Dept));
			}
			if (oFilters.Status && oFilters.Status !== "") {
				aFilter.push(new Filter("Status", FilterOperator.Contains, oFilters.Status));
			}

			//Get Table Binding
			var oBinding = this.getView().byId('idSrvAmndTbl').getBinding("items");
			oBinding.filter(aFilter);
		},
		handleF4RequestorWV: function(oEvent) {
			if (!this.onf4Requestorhelpdialog) {
				this.onf4Requestorhelpdialog = sap.ui.xmlfragment("zmm005.zsrvamd.fragment.onF4RequestorWV", this);
				this.getView().addDependent(this.onf4Requestorhelpdialog);
			}
			this.onf4Requestorhelpdialog.open();
		},
		onSearchReqWV: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("Bname", FilterOperator.Contains, sValue);
			var oBinding = oEvent.getSource().getBinding("items");
			if (sValue && sValue !== "") {
				oBinding.filter([oFilter]);
			} else {
				oFilter = new Filter("Bname", FilterOperator.Contains, '*');
				oBinding.filter([]);
			}

		},
		onReqVHConfirmWV: function(oEvent) {
			var oInput = this.byId("idSerAmdRequestorWV");
			var oName = oEvent.getParameters().selectedItem.mAggregations.cells[0].getText();
			// var oName = oEvent.getParameters().selectedItem.mAggregations.cells[1].getText() + ' ' + oEvent.getParameters().selectedItem.mAggregations
			// 	.cells[2].getText();
			oInput.setValue(oName);

		}

	});
}, /* bExport= */ true);