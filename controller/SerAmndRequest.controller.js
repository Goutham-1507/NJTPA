sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/Text",
	"sap/ui/core/format/DateFormat",
	'sap/ui/core/Fragment',
	"sap/ui/core/message/Message",
	"sap/ui/core/library",
	"sap/m/MessageToast",
	"sap/m/UploadCollectionParameter",
	"sap/ui/Device",
	"sap/m/PDFViewer",
	"sap/ui/model/Filter", "sap/ui/model/FilterOperator"

], function(BaseController, MessageBox, Utilities, History, JSONModel, Dialog, Button, Text, DateFormat, Fragment, Message, library,
	MessageToast, UploadCollectionParameter, Device, PDFViewer, Filter, FilterOperator) {
	"use strict";
	// shortcut for sap.ui.core.ValueState
	var ValueState = library.ValueState;

	// shortcut for sap.ui.core.MessageType
	var MessageType = library.MessageType;
	return BaseController.extend("zmm005.zsrvamd.controller.SerAmndRequest", {

		onInit: function() {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this._formFragments = {};
			var oMessageManager, oView;

			oView = this.getView();

			// set message model
			oMessageManager = sap.ui.getCore().getMessageManager();

			oView.setModel(oMessageManager.getMessageModel(), "message");
			oMessageManager.registerObject(oView, true);

			sap.ui.getCore().getMessageManager().removeAllMessages();
			// or just do it for the whole view

			// Create/Edit Model
			var oCrtSerAgr = new JSONModel({
				"Address": "",
				"Amendment": "",
				"AmericaAct": 0,
				"BillNum": "",
				"CAFund": false,

				"ChngType": "",
				"City": "",
				"ContPerson": "",
				"ConPersTit": "",
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
				"AgrCostChk": false,
				"ChngOrd": false,
				"OthFinChk": false,
				"CostOthChk": false,
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
				"Reqtype": "",
				"Requestor": "",
				"SenateBill": 0,
				"SoleSrc": "",
				"SoleSrcCheck": 0,
				"Solicitation": "",
				"SolType": "",
				"Status": "",
				"Subject": "",
				"ServAgrNo": "",
				"Terms": "",
				"Totval": '0.00',
				"PresentVal": 0,
				"PresVal2": "0.00",
				"NewVal": '0.00',
				"NoEconVal": "",
				"UnderMWA": false,
				"UniqueExp": "",
				"Value": '0.00',
				"VendorNo": "",
				"IsEdit": true,
				"FinanCosChk": 0,
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
					"ReqNo": "0000000000",
					"Banfn": "",
					"Bnfpo": "",
					"Knttp": "",
					"Saknr": "",
					"Descr": "",
					"Quantity": "0.00",
					"Value": "0.00",
					"Rlwrt": "0.00",
					"AddInfo": ""

				}]

			});

			oCrtSerAgr.setDefaultBindingMode("TwoWay");
			this.getView().setModel(oCrtSerAgr, "oCrtSerAgr");

			//EmpConcerns
			var oEmpConcern = [{

				"ReqNo": "",
				"Title": "",
				"UserName": "",
				"FirstName": "",
				"LastName": "",
				"Mail": "",
				"Cell": "",
				"Telephone": ""

			}];
			var oJModel = this.getOwnerComponent().getModel("oJModel");
			var oJModel1 = this.getOwnerComponent().getModel("oJModel1");
			oJModel.setDefaultBindingMode("TwoWay");
			oJModel1.setDefaultBindingMode("TwoWay");

			var oPurReq = [{
				"ReqNo": "0000000000",
				"Banfn": "",
				"Bnfpo": "",
				"Knttp": "",
				"Saknr": "",
				"Descr": "",
				"Quantity": "0.00",
				"Value": "0.00",
				"Rlwrt": "0.00",
				"AddInfo": ""

			}];
			oJModel1.setProperty("/PurReq", oPurReq);

			// oJModel.setProperty('/filters', ofilters);

			// Attachment Model
			var oAttachment = new JSONModel();
			oAttachment.setDefaultBindingMode("TwoWay");
			this.getView().setModel(oAttachment, "oAttachment");
			// Device Model
			this.getView().setModel(new JSONModel(Device), "device");
			this.oRouter.getRoute("SerAmndRequest").attachPatternMatched(this._onObjectMatched, this);
		},
		onMessagePopoverPress: function(oEvent) {
			this._getMessagePopover().openBy(oEvent.getSource());
		},

		_onObjectMatched: function(oEvent) {
			var sObjectId = oEvent.getParameter("arguments").ReqNo;
			var ApproverView = oEvent.getParameter("arguments").Approver;
			var ApproverViewModel = this.getOwnerComponent().getModel("ApproverViewModel");
			ApproverViewModel.setProperty("/ApproverView", ApproverView);
			var oPage = this.byId("SolReq");
			var oReqNumber = this.byId("idRequestNumber");
			var oModel = this.getOwnerComponent().getModel();
			// oPage.removeAllContent();

			var oItemTemplate = new sap.m.UploadCollectionItem({
				url: '{media_src}',
				fileName: '{fileName}',
				mimeType: '{mimeType}',
				enableDelete: '{deleteButton}',
				attributes: {
					ObjectAttribute: {
						text: "{parts : ['fileSize', 'size']}"
					}
				}
			});

			this.getView().byId("UploadCollection").bindItems("/files2", oItemTemplate);

			if (sObjectId !== "0000000000") {

				// var oSoleReq = "('" + sObjectId + "')?$expand=ReqApprNav,ReqAttachNav";
				var oSoleReq = "/ServiceRequestSet('" + sObjectId + "')";
				this.getView().setBusy(true);
				oModel.read(oSoleReq, {
					urlParameters: {
						"$expand": ["ReqApprNav,ReqAttachNav", "ReqPRNav"]
					},
					success: jQuery.proxy(this._editSolReq, this)
				});

				this.getView().byId("idRequestNumber").setEditable(false);

				var reqnumber = this.getView().byId("idRequestNumber").getValue();

			} else {
				this.getView().byId('idAddApprover').setVisible(false);
				// Reset the values for every create 
				var oCrtSerAgr = new JSONModel({
					"Address": "",
					"Amendment": "",
					"AmericaAct": 0,
					"BillNum": "",
					"CAFund": false,
					"AgrCostChk": false,
					"ChngOrd": false,
					"OthFinChk": false,
					"CostOthChk": false,
					"ChngType": "",
					"City": "",
					"ContPerson": "",
					"ConPersTit": "",
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
					"Reqtype": "",
					"Requestor": "",
					"SenateBill": 0,
					"SoleSrc": "",
					"SoleSrcCheck": 0,
					"Solicitation": "",
					"SolType": "",
					"Status": "",
					"ServAgrNo": "",
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
					"FinanCosChk": 0,
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

						"ReqNo": "0000000000",
						"Banfn": "",
						"Bnfpo": "",
						"Knttp": "",
						"Saknr": "",
						"Descr": "",
						"Quantity": "0.00",
						"Value": "0.00",
						"Rlwrt": "0.00",
						"AddInfo": ""
					}]

				});
				var oJModel1 = this.getOwnerComponent().getModel("oJModel1");
				oJModel1.setDefaultBindingMode("TwoWay");
				var oPurReq = [{
					"ReqNo": "0000000000",
					"Banfn": "",
					"Bnfpo": "",
					"Knttp": "",
					"Saknr": "",
					"Descr": "",
					"Quantity": "0.00",
					"Value": "0.00",
					"Rlwrt": "0.00",
					"AddInfo": ""

				}];
				oJModel1.setProperty("/PurReq", oPurReq);

				this.getView().byId("idSolReqTitle").setEditable(true);
				this.getView().byId("idSolReqRequestDate").setEditable(true);
				this.getView().byId("idRequestNumber").setEditable(false);

				oCrtSerAgr.setDefaultBindingMode("TwoWay");
				this.getView().setModel(oCrtSerAgr, "oCrtSerAgr");
				//  Drag and drop - onobjectmatch
				var tokenCSRF = {
					name: "",
					HdrParams: "",
					value: ""
				};
				sap.ui.getCore().setModel(new JSONModel(tokenCSRF), "tokenCSRFModel");
				var data2 = {};
				data2.files2 = [];
				var new_obj2 = {};
				data2.files2.push(new_obj2);
				var oJsonModel2 = new JSONModel();
				oJsonModel2.setData(data2);
				this.getView().byId("UploadCollection").setModel(oJsonModel2);
				this.getView().byId("UploadCollection").unbindItems();

				var oValue = this.getView().byId('idUnderMWANo').getSelected();
				if (oValue === true) {
					var oNonMWA = false;
				} else {
					oNonMWA = true;
				}
				var req = 0;
				var req1 = '';
				req = this.getView().byId('idRequestNumber').getValue();
				if (req !== 0) {
					req1 = req;
				}

				var oURLparams = {
					"ReqNo": "",
					"ReqAmount": '',
					"ITRequired": 0,
					"NonMWA": true,
					"Cost": "0"
				};
				oModel.callFunction('/GetStaticAppr', {
					method: "GET",
					urlParameters: oURLparams,
					success: jQuery.proxy(this._getApprovers, this)
				});

			}

		},
		_getApprovers: function(oData, oResponse) {
			var oModel = this.getOwnerComponent().getModel("oJModel");
			sap.ui.getCore().getMessageManager().removeAllMessages();
			var oTable = this.getView().byId("idTableApprover");
			if (oData.results.length !== 0) {
				oTable.getModel("oJModel").setData({
					Approvers: oData.results
				});
			}
		},
		_editSolReq: function(oData, oRespone) {
			if (oData.Status == "INAPPROVAL" && oData.IsEdit == true) {
				this.getView().byId('idAddApprover').setVisible(true);
			} else {
				this.getView().byId('idAddApprover').setVisible(false);
			}
			if (oData.Status === 'COMPLETED') {
				oData.IsEdit = false;
			}
			this.validateform(oData);
			var origDate;
			var oDateFormat_op = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "EE MMM dd yyyy HH:MM:SS",
				UTC: true
					// 2021-10-26
			});

			if (oData.OnDate !== null) {
				oData.OnDate = oDateFormat_op.format(new Date(oData.OnDate));
				origDate = new Date(oData.OnDate);
				oData.OnDate = origDate;
			}
			if (oData.CtrStartDate !== null) {
				oData.CtrStartDate = oDateFormat_op.format(new Date(oData.CtrStartDate));
				origDate = new Date(oData.CtrStartDate);
				oData.CtrStartDate = origDate;
			}
			if (oData.CtrEndDate !== null) {
				oData.CtrEndDate = oDateFormat_op.format(new Date(oData.CtrEndDate));
				origDate = new Date(oData.CtrEndDate);
				oData.CtrEndDate = origDate;
			}
			if (oData.DateAppr !== null) {
				oData.DateAppr = oDateFormat_op.format(new Date(oData.DateAppr));
				origDate = new Date(oData.DateAppr);
				oData.DateAppr = origDate;
			}
			if (oData.FinanCosChk === '0' || oData.FinanCosChk === '1' || oData.FinanCosChk === '2' || oData.FinanCosChk === '3') {
				oData.FinanCosChk = parseInt(oData.FinanCosChk);
			} else {
				oData.FinanCosChk = 0;
			}
			var oEditSolReq = this.getView().getModel('oCrtSerAgr').setData(oData);

			// if (oData.IncChk || oData.DecChk || oData.NoCostChk === true) {
			// 	this.getView().byId("CstforallWrk").setEditable(true);
			// 	this.getView().byId("ExpensesPlus").setEditable(true);
			// 	this.getView().byId("ChangeSubAgrPresVal").setEditable(true);
			// 	this.getView().byId("SolReqPrjEst").setEditable(true);

			// }

			var oTable = this.getView().byId("idTableApprover");
			oTable.getModel("oJModel").setData({
				Approvers: oData.ReqApprNav.results
			});
			var oTablePurReq = this.getView().byId("idTablePurReq");
			oTablePurReq.getModel("oJModel1").setData({
				PurReq: oData.ReqPRNav.results
			});
			var oTablePurReq = this.getView().byId("idTablePurReq");

			oTablePurReq.getModel("oJModel1").setData({
				PurReq: oData.ReqPRNav.results
			});
			var oJsonModel2 = new sap.ui.model.json.JSONModel();
			var reqnumber = this.getView().byId("idRequestNumber").getValue();

			if (oData.ReqAttachNav.results.length > 0) {
				var data2 = {};
				data2.files2 = [];
				for (var i = 0; i < oData.ReqAttachNav.results.length; i++) {
					var docId = oData.ReqAttachNav.results[i].DocumentId;
					var new_obj2 = {
						'media_src': "/sap/opu/odata/sap/ZMM_SERVAMND_REQ_SRV/ReqAttachmentsSet(ReqNo='" + oData.ReqNo +
							"',DocumentId='" + docId + "')/$value",
						'fileType': oData.ReqAttachNav.results[i].MimeType,
						"fileName": oData.ReqAttachNav.results[i].FileName,
						"deleteButton": true

					};

					data2.files2[i] = new_obj2;
				}
				oJsonModel2.setData(data2);

				this.getView().byId("UploadCollection").setModel(oJsonModel2);
				var attachcount = this.getView().byId('UploadCollection').getItems().length;
				for (var i = 0; i < attachcount; i++) {
					this.getView().byId('UploadCollection').getItems()[i].setVisibleDelete(false);
				}

			} else {
				this.getView().byId("UploadCollection").unbindItems();

			}

			if (oData.Status === 'INAPPROVAL' || oData.Status === 'APPROVED' || oData.Status === 'COMPLETED') {
				this.getView().byId('idAddApprBtn').setEnabled(false);
				this.getView().byId('idRemApprBtn').setEnabled(false);
				this.getView().byId('idChgApprBtn').setEnabled(false);
			} else {
				this.getView().byId('idAddApprBtn').setEnabled(true);
				this.getView().byId('idRemApprBtn').setEnabled(true);
				this.getView().byId('idChgApprBtn').setEnabled(true);

			}
			this.getView().setBusy(false);
			this.getView().getModel().refresh();
			sap.ui.getCore().getMessageManager().removeAllMessages();
		},
		_getFormFragment: function(sFragmentName) {
			var pFormFragment = this._formFragments[sFragmentName],
				oView = this.getView();

			if (!pFormFragment) {
				pFormFragment = Fragment.load({
					id: oView.getId(),
					name: "zmm005.zsrvamd.fragment." + sFragmentName
				});
				this._formFragments[sFragmentName] = pFormFragment;
			}

			return pFormFragment;
		},
		onSaveConfirm: function() {
			var oCrtSerAgr = this.getView().getModel('oCrtSerAgr').getData();
			if (oCrtSerAgr.Status === 'INAPPROVAL') {
				if (!this.onSaveConfirmPop) {
					this.onSaveConfirmPop = sap.ui.xmlfragment("zmm005.zsrvamd.fragment.savePopUp", this);
					this.getView().addDependent(this.onSaveConfirmPop);
				}
				this.onSaveConfirmPop.open();
			} else {
				this.onSave();
			}
		},
		onCancelsave: function() {
			this.onSaveConfirmPop.close();
		},
		onSave: function(oEvent) {
			var oCrtSerAgr = this.getView().getModel('oCrtSerAgr').getData();
			if (oCrtSerAgr.ExtenCode != null) {
				oCrtSerAgr.ExtenCode = String(oCrtSerAgr.ExtenCode);
			}
			var oJModel = this.getOwnerComponent().getModel("oJModel");
			var oJModel1 = this.getOwnerComponent().getModel("oJModel1");
			oCrtSerAgr.FinanCosChk = String(oCrtSerAgr.FinanCosChk);
			var oSuccess = this.validateform(oCrtSerAgr);
			var oApprovers = oJModel.getProperty('/Approvers');
			var oPurReq = oJModel1.getProperty('/PurReq');
			var oUsers = oJModel.getProperty('/Contacts');
			var oModel = this.getOwnerComponent().getModel();
			var oJModel1 = this.getOwnerComponent().getModel("oJModel1");
			var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "yyyy-MM-ddT00:00:00"

			});
			if (oSuccess === true) {
				if (this.onSaveConfirmPop !== undefined) {
					this.onSaveConfirmPop.close();
				}
				this._clearMessages();
				this.getView().setBusy(true);
				oCrtSerAgr.Status = "DRAFT";
				oCrtSerAgr.ReqApprNav = oApprovers;
				if (oPurReq.length > 0) {
					oCrtSerAgr.ReqPRNav = oPurReq;
				}
				if (oCrtSerAgr.OnDate !== null) {
					oCrtSerAgr.OnDate = oDateFormat.format(new Date(oCrtSerAgr.OnDate));
				}
				if (oCrtSerAgr.DateAppr !== null) {
					oCrtSerAgr.DateAppr = oDateFormat.format(new Date(oCrtSerAgr.DateAppr));
				}
				if (oCrtSerAgr.CtrStartDate !== null) {
					oCrtSerAgr.CtrStartDate = oDateFormat.format(new Date(oCrtSerAgr.CtrStartDate));
				}
				if (oCrtSerAgr.CtrEndDate !== null) {
					oCrtSerAgr.CtrEndDate = oDateFormat.format(new Date(oCrtSerAgr.CtrEndDate));
				}

				oModel.create("/ServiceRequestSet", oCrtSerAgr, {
					success: jQuery.proxy(this._handleSolReqSave, this)
				});

			}
		},
		onOrder: function(oEvent) {
			var oCrtSerAgr = this.getView().getModel('oCrtSerAgr').getData();
			// oCrtSerAgr.ExtenCode = toString(oCrtSerAgr.ExtenCode);
			if (oCrtSerAgr.ExtenCode != null) {
				oCrtSerAgr.ExtenCode = String(oCrtSerAgr.ExtenCode);
			}
			var oJModel = this.getOwnerComponent().getModel("oJModel");
			var oJModel1 = this.getOwnerComponent().getModel("oJModel1");
			oCrtSerAgr.FinanCosChk = String(oCrtSerAgr.FinanCosChk);
			var oSuccess = this.validateform(oCrtSerAgr);
			var oApprovers = oJModel.getProperty('/Approvers');
			var oPurReq = oJModel1.getProperty('/PurReq');
			var oUsers = oJModel.getProperty('/Contacts');
			var oModel = this.getOwnerComponent().getModel();
			var oJModel1 = this.getOwnerComponent().getModel("oJModel1");
			var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "yyyy-MM-ddT00:00:00"

			});
			if (oSuccess === true) {
				this._clearMessages();
				this.getView().setBusy(true);
				oCrtSerAgr.Status = "INAPPROVAL";
				oCrtSerAgr.ReqApprNav = oApprovers;
				if (oPurReq.length > 0) {
					oCrtSerAgr.ReqPRNav = oPurReq;
				}
				if (oCrtSerAgr.OnDate !== null) {
					oCrtSerAgr.OnDate = oDateFormat.format(new Date(oCrtSerAgr.OnDate));
				}
				if (oCrtSerAgr.DateAppr !== null) {
					oCrtSerAgr.DateAppr = oDateFormat.format(new Date(oCrtSerAgr.DateAppr));
				}
				if (oCrtSerAgr.CtrStartDate !== null) {
					oCrtSerAgr.CtrStartDate = oDateFormat.format(new Date(oCrtSerAgr.CtrStartDate));
				}
				if (oCrtSerAgr.CtrEndDate !== null) {
					oCrtSerAgr.CtrEndDate = oDateFormat.format(new Date(oCrtSerAgr.CtrEndDate));
				}
				oModel.create("/ServiceRequestSet", oCrtSerAgr, {
					success: jQuery.proxy(this._handleSolReqSave, this)
				});
			}
		},
		onPressComplete: function() {
			var oCrtSerAgr = this.getView().getModel('oCrtSerAgr').getData();
			var ReqNo = oCrtSerAgr.ReqNo;
			var oModel = this.getOwnerComponent().getModel();
			this.getView().setBusy(true);
			var oURLparams = {
				"ReqNo": ReqNo
			};
			oModel.callFunction('/StatusUpdate', {
				method: "GET",
				urlParameters: oURLparams,
				success: jQuery.proxy(this._handleComplete, this, '1'),
				error: jQuery.proxy(this._handleComplete, this, '2')
			});

		},
		_handleComplete: function(a, oData, oResponse) {
			this.getView().setBusy(false);
			this.getView().getModel().refresh();
			if (a === '1') {
				var oErrTyp = 'Success';
				var oDErrMsg = "Successfully Completed the Task";
				// var oErrTyp = oErrMsg.severity;
				// var oDErrMsg = oErrMsg.message;
			} else {
				var oErrTyp = 'Error';
				var oDErrMsg = "Error while Completing the Task, please try again";
			}
			// if (oErrTyp === "error") {
			// 	oErrTyp = "Error";

			// } else {
			// 	oErrTyp = "Success";

			// 	var oCrtData = this.getView().getModel('oCrtWorkOrd').getData();
			// 	// Upload Attachments
			// 	var attach = true;
			// 	this.getView().getModel('oCrtWorkOrd').setData(null);
			// }
			var dialog = new Dialog({
				title: oErrTyp,
				type: 'Message',
				state: oErrTyp,
				content: new Text({
					text: oDErrMsg
				}),
				beginButton: new Button({
					text: 'OK',
					press: function() {
						if (oErrTyp === 'Success') {
							window.history.go(-1);

						}
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();
				}
			});
			dialog.open();

		},

		validateform: function(oData) {
			var lv_errFlag;
			this._clearMessages();
			var oUploadCollection = this.byId("UploadCollection");
			var cFiles = oUploadCollection.aItems.length;
			if (oData !== null) {
				if (oData.Title === "") {
					var oMsg = "Enter Title";
					var oMessage = new Message({
						message: oMsg,
						type: MessageType.Error,
						target: "/Dummy",
						processor: this.getView().getModel('oCrtSerAgr')
					});
					sap.ui.getCore().getMessageManager().addMessages(oMessage);
					var oInput = this.getView().byId("idSolReqTitle");
					oInput.setValueState(ValueState.Error);
					oInput.setValueStateText("Please Enter Title");

					lv_errFlag = true;
				}
				if (oData.RequestDate === null) {
					oMsg = "Enter Request Date";
					oMessage = new Message({
						message: oMsg,
						type: MessageType.Error,
						target: "/Dummy",
						processor: this.getView().getModel('oCrtSerAgr')
					});
					sap.ui.getCore().getMessageManager().addMessages(oMessage);
					oInput = this.getView().byId("idSolReqRequestDate");
					oInput.setValueState(ValueState.Error);
					oInput.setValueStateText("Please Enter Request Date");

					lv_errFlag = true;
				}
				// if (oData.Requestor === '') {
				// 	oMsg = "Enter Requestor";
				// 	oMessage = new Message({
				// 		message: oMsg,
				// 		type: MessageType.Error,
				// 		target: "/Dummy",
				// 		processor: this.getView().getModel('oCrtSerAgr')
				// 	});
				// 	sap.ui.getCore().getMessageManager().addMessages(oMessage);
				// 	oInput = this.getView().byId("idSolReqRequestor");
				// 	oInput.setValueState(ValueState.Error);
				// 	oInput.setValueStateText("Please Enter Request Date");

				// 	lv_errFlag = true;
				// }
				if (oData.Reqtype === '') {
					oMsg = "Enter Request Type";
					oMessage = new Message({
						message: oMsg,
						type: MessageType.Error,
						target: "/Dummy",
						processor: this.getView().getModel('oCrtSerAgr')
					});
					sap.ui.getCore().getMessageManager().addMessages(oMessage);
					var oInputTyp = this.getView().byId("SrvAmndReqType");
					oInputTyp.setValueState(ValueState.Error);
					oInputTyp.setValueStateText("Please Enter Request Type");

					lv_errFlag = true;
				} else {
					oInput = this.getView().byId("SrvAmndReqType");
					oInput.setValueState(ValueState.None);

				}
				if (oData.IntReqNo === '') {
					oMsg = "Enter Solicitation Request Number";
					oMessage = new Message({
						message: oMsg,
						type: MessageType.Error,
						target: "/Dummy",
						processor: this.getView().getModel('oCrtSerAgr')
					});
					sap.ui.getCore().getMessageManager().addMessages(oMessage);
					var oInputReqID = this.getView().byId("idIntReqNo");
					oInputReqID.setValueState(ValueState.Error);
					oInputReqID.setValueStateText("Enter Solicitation Request Number");

					lv_errFlag = true;
				}
				////////////////////////
				//////////////////////////////////////////////////
				if (oData.OnDate === null) {
					oMsg = "Enter Date";
					oMessage = new Message({
						message: oMsg,
						type: MessageType.Error,
						target: "/Dummy",
						processor: this.getView().getModel('oCrtSerAgr')
					});
					sap.ui.getCore().getMessageManager().addMessages(oMessage);
					oInput = this.getView().byId("idSolReqRequestDate");
					oInput.setValueState(ValueState.Error);
					oInput.setValueStateText("Please Enter Request Date");

					lv_errFlag = true;
				} else {
					oInput = this.getView().byId("idSolReqRequestDate");
					oInput.setValueState(ValueState.None);
				}

				if (oData.Requestor === "") {
					oMsg = "Enter Requestor";
					oMessage = new Message({
						message: oMsg,
						type: MessageType.Error,
						target: "/Dummy",
						processor: this.getView().getModel('oCrtSerAgr')
					});
					sap.ui.getCore().getMessageManager().addMessages(oMessage);
					oInput = this.getView().byId("idSolReqRequestor");
					oInput.setValueState(ValueState.Error);
					oInput.setValueStateText("Please Enter Requestor");

					lv_errFlag = true;
				} else {
					oInput = this.getView().byId("idSolReqRequestor");
					oInput.setValueState(ValueState.None);

				}

				if (oData.Subject === "") {
					oMsg = "Enter Subject";
					oMessage = new Message({
						message: oMsg,
						type: MessageType.Error,
						target: "/Dummy",
						processor: this.getView().getModel('oCrtSerAgr')
					});
					sap.ui.getCore().getMessageManager().addMessages(oMessage);
					oInput = this.getView().byId("idSolReqTitle");
					oInput.setValueState(ValueState.Error);
					oInput.setValueStateText("Please Enter Subject");

					lv_errFlag = true;
				} else {
					oInput = this.getView().byId("idSolReqTitle");
					oInput.setValueState(ValueState.None);

				}

				if (oData.ServAgrNo === "") {
					oMsg = "Enter Service Agreement";
					oMessage = new Message({
						message: oMsg,
						type: MessageType.Error,
						target: "/Dummy",
						processor: this.getView().getModel('oCrtSerAgr')
					});
					sap.ui.getCore().getMessageManager().addMessages(oMessage);
					oInput = this.getView().byId("idIntReqNo");
					oInput.setValueState(ValueState.Error);
					oInput.setValueStateText("Please Enter Service Agreement Number");

					lv_errFlag = true;
				} else {
					oInput = this.getView().byId("idIntReqNo");
					oInput.setValueState(ValueState.None);

				}

				if (oData.CtrEndDate === null) {
					oMsg = "Enter Contract End Date";
					oMessage = new Message({
						message: oMsg,
						type: MessageType.Error,
						target: "/Dummy",
						processor: this.getView().getModel('oCrtSerAgr')
					});
					sap.ui.getCore().getMessageManager().addMessages(oMessage);
					oInput = this.getView().byId("idSolReqContractEnd");
					oInput.setValueState(ValueState.Error);
					oInput.setValueStateText("Please Enter Contract End Date");

					lv_errFlag = true;
				} else {
					oInput = this.getView().byId("idSolReqContractEnd");
					oInput.setValueState(ValueState.None);

				}

				if (oData.ReachusAt === "" || oData.ReachusAt === undefined) {
					oMsg = "Enter Contact Information";
					oMessage = new Message({
						message: oMsg,
						type: MessageType.Error,
						target: "/Dummy",
						processor: this.getView().getModel('oCrtSerAgr')
					});
					sap.ui.getCore().getMessageManager().addMessages(oMessage);
					oInput = this.getView().byId("idRechUs");
					oInput.setValueState(ValueState.Error);
					oInput.setValueStateText("Enter Contact Information");

					lv_errFlag = true;
				} else {
					oInput = this.getView().byId("idRechUs");
					oInput.setValueState(ValueState.None);

				}

				if (oData.InvVim === "" || oData.InvVim === undefined) {
					oMsg = "Enter VIM processing to";
					oMessage = new Message({
						message: oMsg,
						type: MessageType.Error,
						target: "/Dummy",
						processor: this.getView().getModel('oCrtSerAgr')
					});
					sap.ui.getCore().getMessageManager().addMessages(oMessage);
					oInput = this.getView().byId("idVIMprocessing");
					oInput.setValueState(ValueState.Error);
					oInput.setValueStateText("Enter VIM processing to");
					lv_errFlag = true;
				} else {
					oInput = this.getView().byId("idVIMprocessing");
					oInput.setValueState(ValueState.None);
				}

				if (oData.NoCostChk) {
					if (parseInt(oData.PresVal2) === 0) {
						oMsg = "Enter No Cost amount";
						oMessage = new Message({
							message: oMsg,
							type: MessageType.Error,
							target: "/Dummy",
							processor: this.getView().getModel('oCrtSerAgr')
						});
						sap.ui.getCore().getMessageManager().addMessages(oMessage);
						oInput = this.getView().byId("idPresVal");
						oInput.setValueState(ValueState.Error);
						oInput.setValueStateText("Enter No Cost amount");
						lv_errFlag = true;
					} else {
						oInput = this.getView().byId("idPresVal");
						oInput.setValueState(ValueState.None);
					}

				}

				/////////////////////
				if (cFiles <= 0) {
					oMsg = "Please add Attachment";
					oMessage = new Message({
						message: oMsg,
						type: MessageType.Error,
						target: "/Dummy",
						processor: this.getView().getModel('oCrtSerAgr')
					});
					sap.ui.getCore().getMessageManager().addMessages(oMessage);
					lv_errFlag = true;
				}
				if (lv_errFlag === true) {
					return false;
				} else {
					return true;
				}
			}
		},
		_handleSolReqSave: function(oData, oResponse) {

			this.getView().setBusy(false);
			this.getView().getModel().refresh();

			var oErrRes = oResponse.headers["sap-message"];
			var oErrMsg = JSON.parse(oErrRes);
			if (oErrMsg.severity === 'success') {
				if (oErrMsg) {
					var oErrTyp = oErrMsg.severity;
					var oDErrMsg = oErrMsg.message;

					if (oErrTyp === "error") {
						oErrTyp = "Error";

					} else {
						oErrTyp = "Success";

						var oCrtData = this.getView().getModel('oCrtSerAgr').getData();
						// Upload Attachments
						var attach = true;
						this.getView().getModel('oCrtSerAgr').setData(null);
					}
					var dialog = new Dialog({
						title: oErrTyp,
						type: 'Message',
						state: oErrTyp,
						content: new Text({
							text: oDErrMsg
						}),
						beginButton: new Button({
							text: 'OK',
							press: function() {
								if (oErrTyp === 'Success') {
									window.history.go(-1);

								}
								dialog.close();
							}
						}),
						afterClose: function() {
							dialog.destroy();
						}
					});
					dialog.open();

				}
				if (attach === true) {
					this.uploadAttach(oData);
				}
			}

		},
		uploadAttach: function(oData) {
			var oUploadCollection = this.byId("UploadCollection");

			var cFiles = oUploadCollection.aItems.length;
			var uploadInfo = cFiles + " file(s)";
			var oJModel = this.getOwnerComponent().getModel("oJModel");
			oJModel.setProperty('/ReqNumber', oData.ReqNo);

			if (cFiles > 0) {

				oUploadCollection.upload();

			}
		},
		onBeforeUploadStartsMainFileNew: function(oEvent) {
			var oJModel = this.getOwnerComponent().getModel("oJModel");
			var oReqNumber = oJModel.getProperty('/ReqNumber');
			// Header Slug
			var oCustomerHeaderSlug = "";
			var oSlug = oReqNumber + "/" + oEvent.getParameter("fileName");
			oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
				name: "slug",
				value: oSlug
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
			//file drag n drop feature start - onBeforeUploadStartsMainFileNew
			var found = false;
			var finalArrays = oEvent.getParameters().getHeaderParameter();
			for (var k = 0; k < finalArrays.length; k++) {
				var xcsrf = finalArrays[k].getProperty("name");
				if (xcsrf.indexOf("x-csrf-token") !== -1) {
					found = true;
				}
			}
			if (!found) {
				var csrfFetch = sap.ui.getCore().getModel("tokenCSRFModel");
				if (csrfFetch.getData() !== undefined) {
					var csrfArr = sap.ui.getCore().getModel("tokenCSRFModel").getData().HdrParams;
					oEvent.getParameters().addHeaderParameter(csrfArr);
				}
			}
			//file drag n drop feature end
		},
		onCancel: function() {
			var oCrtData = this.getView().getModel('oCrtSerAgr').getData();
			this.getView().getModel('oCrtSerAgr').setData(null);
			window.history.go(-1);
			this.clearKeyValues("idDept");
			// this.clearKeyValues("idReqDate");
			this.clearKeyValues("idSolType");
			// window.history.go(-1);
		},
		onReqDateChang: function(oEvent) {
			// var oVal = DateFormat.getDateInstance().parse(oEvent.getParameter("newValue"), true);
			// this.setValue('/RequestDate', oVal);

		},
		onDept: function(oEvent) {
			var oVal = oEvent.getSource().getSelectedItem().getKey();
			this.setValue('/Department', oVal);

		},
		onSoltyp: function(oEvent) {
			var oVal = oEvent.getSource().getSelectedItem().getKey();
			this.setValue('/SolicitationType', oVal);

		},
		setValue: function(oFld, oVal) {
			var oCrtSerAgr = this.getView().getModel();
			oCrtSerAgr.setProperty(oFld, oVal);
		},
		clearKeyValues: function(oId) {
			var oReqDate = this.getView().byId(oId);
			oReqDate.setSelectedItem(" ");
			oReqDate.setSelectedItemId(" ");
			oReqDate.setSelectedKey(" ");
		},
		_getMessagePopover: function() {
			// create popover lazily (singleton)
			if (!this._oMessagePopover) {
				this._oMessagePopover = sap.ui.xmlfragment(this.getView().getId(),
					"zmm005.zsrvamd.fragment.MessagePopover", this);
				this.getView().addDependent(this._oMessagePopover);
			}
			return this._oMessagePopover;

		},
		_clearMessages: function() {
			// does not remove the manually set ValueStateText we set in onValueStatePress():
			sap.ui.getCore().getMessageManager().removeAllMessages();
		},
		onChange: function(oEvent) {
			var oUploadCollection = oEvent.getSource();
			var useroDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZMM_SERVAMND_REQ_SRV/", true);
			//	this.getView().setModel(useroDataModel);
			useroDataModel.disableHeadRequestForToken = true;
			//	var oModel = this.getView().getModel();

			useroDataModel.refreshSecurityToken();

			var oHeaders = useroDataModel.oHeaders;
			var sToken = oHeaders['x-csrf-token'];
			// Header Token
			var oCustomerHeaderToken = new UploadCollectionParameter({
				name: "x-csrf-token",
				value: sToken
			});
			oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
			//file drag n drop feature - onchange
			var tokenCSRF = {
				name: "x-csrf-token",
				HdrParams: oUploadCollection.getHeaderParameters()[0],
				value: sToken
			};
			sap.ui.getCore().setModel(new JSONModel(tokenCSRF), "tokenCSRFModel");
		},

		onFileDeleted: function(oEvent) {

		},

		onFilenameLengthExceed: function(oEvent) {

		},

		onFileSizeExceed: function(oEvent) {
			var msg = 'File size is above 100MB, Cannot be attached';
			MessageToast.show(msg);

		},

		onTypeMissmatch: function(oEvent) {

		},
		onDeleteSelectedItems: function(oEvenet) {
			var url1 = this.getView().byId('UploadCollection').getSelectedItems();
			var url = url1[0].mProperties.url;
			var ReqNumber = url.split('ReqNo=');
			var ReqNo = ReqNumber[1].slice(1, 11);
			var docId = ReqNumber[1].split("DocumentId='");
			var DocumentId = docId[1].replace("')/$value", "");
			var omodel = this.getOwnerComponent().getModel();
			var a = url.split('_SRV');
			url = a[1];
			omodel.remove(url, {
				method: "DELETE",
				// urlParameters: oURLparams,
				success: jQuery.proxy(this._deleteDocument(ReqNo, DocumentId)),
				error: function() {
					MessageToast.show('Error deleting file please try again');
				}
			});
			// this._deleteDocument(ReqNo, DocumentId);
		},
		_deleteDocument: function(ReqNo, DocumentId) {
			var a = this.getView().byId('UploadCollection').getModel().oData;
			for (var i = 0; i < a.files2.length; i++) {
				var url = a.files2[i].media_src;
				var ReqNumber1 = url.split('ReqNo=');
				var docId1 = ReqNumber1[1].split("DocumentId='");
				var DocumentId1 = docId1[1].replace("')/$value", "");
				if (DocumentId === DocumentId1) {
					a.files2.splice(i, 1);
					this.getView().byId('UploadCollection').removeItem(i);
					this.getView().byId('UploadCollection').getModel().getProperty('/files2');
				}
			}
		},

		onStartUpload: function(oEvent) {
			var oUploadCollection = this.byId("UploadCollection");
			var oTextArea = this.byId("TextArea");
			var cFiles = oUploadCollection.getItems().length;
			var uploadInfo = cFiles + " file(s)";

			if (cFiles > 0) {
				oUploadCollection.upload();

				if (oTextArea.getValue().length === 0) {
					uploadInfo = uploadInfo + " without notes";
				} else {
					uploadInfo = uploadInfo + " with notes";
				}

				MessageBox.information("Uploaded " + uploadInfo);
				oTextArea.setValue("");
			}
		},

		onBeforeUploadStarts: function(oEvent) {
			// Header Slug
			var oCustomerHeaderSlug = new UploadCollectionParameter({
				name: "slug",
				value: oEvent.getParameter("fileName")
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
			setTimeout(function() {

			}, 4000);
		},

		onUploadComplete: function(oEvent) {
			// var sUploadedFileName = oEvent.getParameter("files")[0].fileName;
			// setTimeout(function() {
			// 	var oUploadCollection = this.byId("UploadCollection");

			// 	for (var i = 0; i < oUploadCollection.getItems().length; i++) {
			// 		if (oUploadCollection.getItems()[i].getFileName() === sUploadedFileName) {
			// 			oUploadCollection.removeItem(oUploadCollection.getItems()[i]);
			// 			break;
			// 		}
			// 	}

			// }.bind(this), 8000);
			this.getView().byId("UploadCollection").setUploadUrl("/sap/opu/odata/sap/ZMM_SERVAMND_REQ_SRV/ReqAttachmentsSet");
		},

		onSelectChange: function(oEvent) {
			var oUploadCollection = this.byId("UploadCollection");
			oUploadCollection.setShowSeparators(oEvent.getParameters().selectedItem.getProperty("key"));
		},
		onTitleChange: function(oEvent) {
			var oInput = this.getView().byId("idSolReqTitle");
			oInput.setValueState(ValueState.None);
			oInput.setValueStateText("");
		},
		handleF4User: function(oEvent) {
			var oPath = oEvent.getSource().getBindingContext("oJModel").getPath();
			var oModel = this.getOwnerComponent().getModel("oJModel");
			oModel.setProperty("/TblUsersIndx", oPath);
			if (!this.onf4Userhelpdialog) {
				this.onf4Userhelpdialog = sap.ui.xmlfragment("zmm005.zsrvamd.fragment.onF4User", this);
				this.getView().addDependent(this.onf4Userhelpdialog);
			}
			this.onf4Userhelpdialog.open();
		},
		handleF4PurReq: function(oEvent) {
			var oPath = oEvent.getSource().getBindingContext("oJModel1").getPath();
			var oModel = this.getOwnerComponent().getModel("oJModel1");
			oModel.setProperty("/TblPurReqIndx", oPath);
			if (!this.onf4PurReqhelpdialog) {
				this.onf4PurReqhelpdialog = sap.ui.xmlfragment("zmm005.zsrvamd.fragment.onF4PurReq", this);
				this.getView().addDependent(this.onf4PurReqhelpdialog);
			}
			this.onf4PurReqhelpdialog.open();
		},
		handleUserClose: function(oEvent) {
			this.onf4Userhelpdialog.close();
		},
		handleApprClose: function(oEvent) {
			this.onf4Apprhelpdialog.close();
		},
		handleF4Requestor: function(oEvent) {

			// r.setProperty("/TblWorkTimeIndx", t);
			if (!this.onf4Requestorhelpdialog) {
				this.onf4Requestorhelpdialog = sap.ui.xmlfragment("zmm005.zsrvamd.fragment.onF4Requestor", this);
				this.getView().addDependent(this.onf4Requestorhelpdialog);
			}
			this.onf4Requestorhelpdialog.open();
		},
		handleRequestorClose: function(oEvent) {
			this.onf4Requestorhelpdialog.close();
		},
		handleSelectedRequestor: function(oEvent) {
			// var oRequestor = oEvent.getSource().getBindingContext().getObject().Bname;
			// var oInput = this.getView().byId('idSolReqRequestor');
			// oInput.setValue(oRequestor);
			// this.onf4Requestorhelpdialog.close();
		},
		handleSelectedUser: function(oEvent) {
			// var oRequestor = oEvent.getSource().getBindingContext().getObject();
			var oRequestorName = oEvent.getSource().getBindingContext().getObject().Bname;
			var oRequestorFName = oEvent.getSource().getBindingContext().getObject().NameFirst;
			var oRequestorLName = oEvent.getSource().getBindingContext().getObject().NameLast;
			var oRequestorTelNumber = oEvent.getSource().getBindingContext().getObject().TelNumber;
			var oRequestorEmail = oEvent.getSource().getBindingContext().getObject().SmtpAddr;
			var oIndex = this.getOwnerComponent().getModel('oJModel').getProperty('/TblUsersIndx');
			var oEmpConcern = this.getView().getModel("oJModel");
			// this.getView().getModel("oEmpConcern").setProperty(oIndex.Bname = oRequestorName;
			oEmpConcern.setProperty(oIndex + '/UserName', oRequestorName);
			oEmpConcern.setProperty(oIndex + '/NameFirst', oRequestorFName);
			oEmpConcern.setProperty(oIndex + '/NameLast', oRequestorLName);
			oEmpConcern.setProperty(oIndex + '/SmtpAddr', oRequestorEmail);
			oEmpConcern.setProperty(oIndex + '/TelNumber', oRequestorTelNumber);
			this.onf4Userhelpdialog.close();
		},
		OnPressAddApprover: function(oEvent) {

			var array = {
				"Reqno": "0000000000",
				"Mulappr": "",
				"Apprlevel": 0,
				"Apprsublevel": 0,
				"Status": "",
				"Rcvddate": null,
				"Apprdate": null,
				"Apprtime": null,
				"Apprname": "",
				"Comments": "",
				"Approvedby": "",
				"Adhoc": "X",
				"Title": "Adhoc Approver",
				"Usrchk": true
			};
			var dummyapprs = this.byId("idTableApprover").getModel("oJModel").getData();
			var index = this.byId("idTableApprover").getModel("oJModel").getData().Approvers.length;
			this.byId("idTableApprover").getModel("oJModel").getData().Approvers[index] = array;
			this.getView().byId("idTableApprover").getModel("oJModel").refresh();

		},
		onApprVHConfirm: function(oEvent) {
			var oRequestorName = oEvent.getParameters().selectedItem.mAggregations.cells[0].getText();
			var oRequestorFName = oEvent.getParameters().selectedItem.mAggregations.cells[1].getText() + ' ' + oEvent.getParameters().selectedItem
				.mAggregations.cells[2].getText();
			var oIndex = this.getOwnerComponent().getModel('oJModel').getProperty('/TblApprIndx');
			var oEmpConcern = this.getView().getModel("oJModel");
			oEmpConcern.setProperty(oIndex + '/Mulappr', oRequestorName);
			oEmpConcern.setProperty(oIndex + '/Apprname', oRequestorFName);
			this.getView().byId("idTableApprover").getModel("oJModel").refresh();
		},
		onSearchAppr: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("Bname", FilterOperator.Contains, sValue);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},
		OnPressAddPurReq: function(oEvent) {

			var array = {
				"ReqNo": "",
				"Banfn": "",
				"Bnfpo": "",
				"Knttp": "",
				"Saknr": "",
				"Descr": "",
				"Quantity": "0.00",
				"Value": "",
				"Rlwrt": "0.00",
				"AddInfo": ""

			};
			var dummyapprs = this.byId("idTablePurReq").getModel("oJModel1").getData();
			var index = this.byId("idTablePurReq").getModel("oJModel1").getData().PurReq.length;

			this.byId("idTablePurReq").getModel("oJModel1").getData().PurReq[index] = array;
			this.getView().byId("idTablePurReq").getModel("oJModel1").refresh();
			// this.calcPRAmnt();
		},
		onEdit: function(oEvent) {

			// this.getView().getModel("oEditModel").getData().Edit = true;
			// this.getView().byId("idSolReqTitle").setEditable(true);
			// this.getView().byId("idSolReqRequestDate").setEditable(true);
			// this.getView().byId("idSolReqRequestor").setEditable(true);
			this.getView().byId("idRequestNumber").setEditable(true);
			// this.getView().byId("idSolReqContractBegin").setEditable(true);
			// this.getView().byId("idSolReqContractEnd").setEditable(true);

		},

		moveUpSequence: function(evt) {
			var sPath = evt.getSource().getBindingContext("oJModel").sPath;
			sPath = sPath.slice(1);
			sPath = sPath.split("/")[1];
			var oJsonModel1 = new sap.ui.model.json.JSONModel();

			//	this.approversPath = sPath;
			if (sPath !== "0") {
				var oModel = this.getView().byId("changeSequenceTable").getModel("oJModel").getData().Approvers[sPath];

				this.getView().byId("changeSequenceTable").getModel("oJModel").getData().Approvers.splice(sPath, 1);
				this.getView().byId("changeSequenceTable").getModel("oJModel").getData().Approvers.splice(sPath - 1, 0, oModel);
				this.getView().byId("changeSequenceTable").getModel("oJModel").refresh();
			}
		},
		moveDownSequence: function(evt) {
			var sPath = evt.getSource().getBindingContext("oJModel").sPath;
			sPath = sPath.slice(1);
			sPath = sPath.split("/")[1];
			var oJsonModel1 = new sap.ui.model.json.JSONModel();

			//	this.approversPath = sPath;
			var newSPath = (this.getView().byId("changeSequenceTable").getModel("oJModel").getData().Approvers.length - 1).toString();
			if (sPath !== newSPath) {
				var oModel = this.getView().byId("changeSequenceTable").getModel("oJModel").getData().Approvers[sPath];

				var array = this.getView().byId("changeSequenceTable").getModel("oJModel").getData().Approvers.splice(sPath, 1);
				this.getView().byId("changeSequenceTable").getModel("oJModel").getData().Approvers.splice(Number(sPath) + Number(1), 0, oModel);
				this.getView().byId("changeSequenceTable").getModel("oJModel").refresh();
			}
		},

		OnChangeApprovers: function(oEvent) {
			//this.byId("idTableApprover").getModel("oJModel").getData().Approvers
			var oJsonModel = new sap.ui.model.json.JSONModel();
			var results = this.getView().byId("idTableApprover").getModel("oJModel").getData();
			oJsonModel.setData(results);

			if (!this._oResetPasswordDialog51) {
				this._oResetPasswordDialog51 = sap.ui.xmlfragment(this.getView().getId(),
					"zmm005/zsrvamd.fragment.ChangeSequence", this);
				this.getView().addDependent(this._oResetPasswordDialog51);
			}
			this._oResetPasswordDialog51.open();
			this.getView().byId("changeSequenceTable").setModel(oJsonModel, "oJModel");

		},
		changeSequenceSubmit: function(evt) {
			var oTable = this.byId("changeSequenceTable").getModel("oJModel").getData();
			var oTableOld = this.getView().byId("idTableApprover").getModel("oJModel").getData().Approvers;
			for (var i = 0; i < oTable.Approvers.length; i++) {

				var Username = oTable.Approvers[i].Mulappr;

				oTableOld.Mulappr = Username;
			}
			this.getView().byId("idTableApprover").getModel("oJModel").refresh();
			this.closeChangeSequence();
		},

		closeChangeSequence: function(evt) {
			this._oResetPasswordDialog51.close();
			// this._oResetPasswordDialog51.destroy();
			// this.__oResetPasswordDialog51 = undefined;
		},

		// onAfterRendering: function() {

		// 	if (this.getView().byId("idSolReqTitle").getValue() !== "") {
		// 		this.getView().byId("idSolReqTitle").setEditable(false);
		// 		this.getView().byId("idSolReqRequestDate").setEditable(false);
		// 		this.getView().byId("idSolReqRequestor").setEditable(false);
		// 		this.getView().byId("idRequestNumber").setEditable(false);
		// 		this.getView().byId("idSolReqContractBegin").setEditable(false);
		// 		this.getView().byId("idSolReqContractEnd").setEditable(false);
		// 	}
		// 	// this.getView().byId("idTableApprover").setEditable(false);
		// },
		onPrint: function(oEvent) {
			var reqnumber = this.getView().byId("idRequestNumber").getValue();
			var oPanel = new sap.m.Panel();

			var html = new sap.ui.core.HTML();
			// /sap/opu/odata/sap/ZMM_SERVAMND_REQ_SRV/PrintFormSet('9000000220')/$value
			var sRead = "/PrintFormSet(ReqNo='" + reqnumber + "')/$value";

			// oModel.read(sRead, null, null, true,  function(oData, oResponse) {
			var opdfViewer = new PDFViewer();
			this.getView().addDependent(opdfViewer);
			var sServiceURL = this.getView().getModel().sServiceUrl;
			var sSource = sServiceURL + sRead;
			opdfViewer.setSource(sSource);
			opdfViewer.setTitle("Print Preview");
			opdfViewer.open();
			// var pdfURL = oData.url;

			// html.setContent("<iframe src=" + pdfURL + " width='700' height='700'></iframe>");

			// oPanel.addContent(html);
			// oPanel.placeAt("content");

			// }, function() {
			// 	alert("Read failed");
			// });

		},
		onSelectIT: function(oEvent) {
			var ItSelect = this.getView().byId('SolReqIT').getSelectedIndex();
			var oModel = this.getOwnerComponent().getModel();
			var oAmount = this.getView().byId('SolReqPrjEst').getValue();
			var oValue = this.getView().byId('idUnderMWANo').getSelected();

			var l = '';
			if (oAmount !== '0.00') {
				var a = oAmount.split(',');
				for (var i = 0; i < a.length; i++) {
					l = l + a[i];
				}
				oAmount = l;
			}

			if (oValue === true) {
				var oNonMWA = false;
			} else {
				oNonMWA = true;
			}

			var ItSelect1;
			if (ItSelect === 1) {
				ItSelect1 = true;
			} else {
				ItSelect1 = false;
			}
			var req = 0;
			var req1 = '';
			req = this.getView().byId('idRequestNumber').getValue();
			if (req !== 0) {
				req1 = req;
			}
			var cost;
			if (this.getView().byId('ChkNoCst').getSelected()) {
				cost = "3";
			} else if (this.getView().byId('ChkDec').getSelected()) {
				cost = "2";
			} else {
				cost = "0";
			}
			var oURLparams = {
				"ReqNo": req1,
				"ReqAmount": oAmount,
				"ITRequired": ItSelect,
				"NonMWA": oNonMWA,
				"Cost": cost
			};
			oModel.callFunction('/GetStaticAppr', {
				method: "GET",
				urlParameters: oURLparams,
				success: jQuery.proxy(this._getApprovers, this)
			});

		},
		handleF4ApprUser: function(oEvent) {
			var oPath = oEvent.getSource().getBindingContext("oJModel").getPath();
			var oModel = this.getOwnerComponent().getModel("oJModel");
			oModel.setProperty("/TblApprIndx", oPath);
			if (!this.onf4Apprhelpdialog) {
				this.onf4Apprhelpdialog = sap.ui.xmlfragment("zmm005.zsrvamd.fragment.onF4Appr", this);
				this.getView().addDependent(this.onf4Apprhelpdialog);
			}
			this.onf4Apprhelpdialog.open();
		},
		onAmountChange: function(oEvent) {
			var oModel = this.getOwnerComponent().getModel();
			var oAmount = oEvent.getParameters().value;
			var oIT = this.getView().byId('SolReqIT').getSelectedIndex();
			var oValue = this.getView().byId('idUnderMWANo').getSelected();

			var l = '';
			if (oAmount !== '0.00') {
				var a = oAmount.split(',');
				for (var i = 0; i < a.length; i++) {
					l = l + a[i];
				}
				oAmount = l;
			}

			var ItSelect1;
			if (oIT === 1) {
				ItSelect1 = true;
			} else {
				ItSelect1 = false;
			}

			if (oValue !== undefined) {
				if (oValue === true) {
					var oNonMWA = false;
				} else {
					oNonMWA = true;
				}
			} else {
				oNonMWA = true;
			}
			var req = 0;
			var req1 = '';
			req = this.getView().byId('idRequestNumber').getValue();
			if (req !== 0) {
				req1 = req;
			}
			var cost;
			if (this.getView().byId('ChkNoCst').getSelected()) {
				cost = "3";
			} else if (this.getView().byId('ChkDec').getSelected()) {
				cost = "2";
			} else {
				cost = "0";
			}
			var oURLparams = {
				"ReqNo": req1,
				"ReqAmount": oAmount,
				"ITRequired": oIT,
				"NonMWA": oNonMWA,
				"Cost": cost
			};
			oModel.callFunction('/GetStaticAppr', {
				method: "GET",
				urlParameters: oURLparams,
				success: jQuery.proxy(this._getApprovers, this)
			});

		},
		onSearchReq: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("Bname", FilterOperator.Contains, sValue);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);

		},
		onReqVHConfirm: function(oEvent) {
			var oInput = this.byId("idSolReqRequestor");
			var oName = oEvent.getParameters().selectedItem.mAggregations.cells[1].getText() + ' ' + oEvent.getParameters().selectedItem.mAggregations
				.cells[2].getText();
			oInput.setValue(oName);
			var oVData = this.getView().getModel('oCrtSerAgr').getData();
			oVData.Requestor = oEvent.getParameters().selectedItem.mAggregations.cells[0].getText();
			//
			var oRequestorName = oEvent.getParameters().selectedItem.mAggregations.cells[0].getText();
			var oFname = oEvent.getParameters().selectedItem.mAggregations.cells[1].getText();
			var oLname = oEvent.getParameters().selectedItem.mAggregations.cells[2].getText();
			var oEmail = oEvent.getParameters().selectedItem.mAggregations.cells[3].getText();
			var oTphone = oEvent.getParameters().selectedItem.mAggregations.cells[4].getText();

			// id = "idServAgrOwn"
			// id = "idServAgrFname"
			// id = "idServAgrLname"
			// id = "idServAgrEmail"
			// id = "idServAgrTelNo"
			var a = this.getView().byId("idServAgrOwn").getValue();
			if (a === '') {
				this.getView().byId("idServAgrOwn").setValue(oRequestorName);
				this.getView().byId("idServAgrFname").setValue(oFname);
				this.getView().byId("idServAgrLname").setValue(oLname);
				this.getView().byId("idServAgrEmail").setValue(oEmail);
				this.getView().byId("idServAgrTelNo").setValue(oTphone);
			}
		},
		onSearchPurReq: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("Banfn", FilterOperator.Contains, sValue);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);

		},
		onPurReqVHConfirm: function(oEvent) {
			var oReqNum = oEvent.getParameters().selectedItem.mAggregations.cells[0].getText();
			var oReqItm = oEvent.getParameters().selectedItem.mAggregations.cells[1].getText();
			var oMenge = oEvent.getParameters().selectedItem.mAggregations.cells[2].getText();
			var oKnttp = oEvent.getParameters().selectedItem.mAggregations.cells[3].getText();
			var oGL = oEvent.getParameters().selectedItem.mAggregations.cells[4].getText();
			var oDesc = oEvent.getParameters().selectedItem.mAggregations.cells[5].getText();
			var oVal = oEvent.getParameters().selectedItem.mAggregations.cells[6].getText();
			var oValue = oEvent.getParameters().selectedItem.mAggregations.cells[2].getText() * oEvent.getParameters().selectedItem.mAggregations
				.cells[6].getText();
			if (oVal !== null) {
				oVal = oVal.substr(0, oVal.length - 1);
			}
			if (oMenge !== null) {
				oMenge = oMenge.substr(0, oMenge.length - 1);
			}
			if (oValue != null) {
				oValue = String(oValue);
			}
			var oIndex = this.getOwnerComponent().getModel('oJModel1').getProperty('/TblPurReqIndx');
			var oTable = this.getView().getModel("oJModel1").oData.PurReq;
			var flag = 0;
			for (var i = 0; i < oTable.length; i++) {
				if (oReqNum === oTable[i].Banfn && oReqItm === oTable[i].Bnfpo) {
					flag = 1;
				}
			}

			if (flag === 0) {
				var oEmpConcern = this.getView().getModel("oJModel1");
				oEmpConcern.setProperty(oIndex + '/Banfn', oReqNum);
				oEmpConcern.setProperty(oIndex + '/Bnfpo', oReqItm);
				oEmpConcern.setProperty(oIndex + '/Quantity', oMenge);
				oEmpConcern.setProperty(oIndex + '/Knttp', oKnttp);
				oEmpConcern.setProperty(oIndex + '/Descr', oDesc);
				oEmpConcern.setProperty(oIndex + '/Saknr', oGL);
				oEmpConcern.setProperty(oIndex + '/Value', oVal);
				oEmpConcern.setProperty(oIndex + '/Rlwrt', oValue);
				this.getView().byId("idTableApprover").getModel("oJModel1").refresh();
				this.calcPRAmnt();
			}
		},
		onSearchUser: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("Bname", FilterOperator.Contains, sValue);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);

		},
		onUserVHConfirm: function(oEvent) {
			var oRequestorName = oEvent.getParameters().selectedItem.mAggregations.cells[0].getText();
			var oFname = oEvent.getParameters().selectedItem.mAggregations.cells[1].getText();
			var oLname = oEvent.getParameters().selectedItem.mAggregations.cells[2].getText();
			var oEmail = oEvent.getParameters().selectedItem.mAggregations.cells[3].getText();

			var oTphone = oEvent.getParameters().selectedItem.mAggregations.cells[4].getText();
			var oIndex = this.getOwnerComponent().getModel('oJModel').getProperty('/TblUsersIndx');
			var oEmpConcern = this.getView().getModel("oJModel");

			oEmpConcern.setProperty(oIndex + '/UserName', oRequestorName);
			oEmpConcern.setProperty(oIndex + '/FirstName', oFname);
			oEmpConcern.setProperty(oIndex + '/LastName', oLname);
			oEmpConcern.setProperty(oIndex + '/Mail', oEmail);
			oEmpConcern.setProperty(oIndex + '/Telephone', oTphone);
			this.getView().byId("idTableEmpConcern").getModel("oJModel").refresh();

		},
		handleSuggestedUserSelected: function(oEvent) {
			var t = oEvent.getParameters().selectedItem.getText();
		},
		OnRemoveApprovers: function(oEvent) {

			var aSelContextPaths = this.byId("idTableApprover").getSelectedContextPaths();
			var aSelectedIndexes = [];
			var oDraftEntries = this.byId("idTableApprover").getModel("oJModel").getData();
			if (Array.isArray(aSelContextPaths) && aSelContextPaths.length > 0) {
				aSelContextPaths.forEach(function(sSelectedPath) {
					aSelectedIndexes.push(sSelectedPath.split("/")[2]);
				});

				aSelectedIndexes.sort(function(a, b) {
					return b - a;
				});

				aSelectedIndexes.forEach(function(index) {
					oDraftEntries.Approvers.splice(index, 1);
				});

				this.byId("idTableApprover").getModel("oJModel").setData(oDraftEntries);
				this._removeTableSelections();

			}

		},
		OnRemovePurReq: function(oEvent) {

			var aSelContextPaths = this.byId("idTablePurReq").getSelectedContextPaths();
			var aSelectedIndexes = [];
			var oDraftEntries = this.byId("idTablePurReq").getModel("oJModel1").getData();
			if (Array.isArray(aSelContextPaths) && aSelContextPaths.length > 0) {
				aSelContextPaths.forEach(function(sSelectedPath) {
					aSelectedIndexes.push(sSelectedPath.split("/")[2]);
				});

				aSelectedIndexes.sort(function(a, b) {
					return b - a;
				});

				aSelectedIndexes.forEach(function(index) {
					oDraftEntries.PurReq.splice(index, 1);
				});

				this.byId("idTablePurReq").getModel("oJModel1").setData(oDraftEntries);
				this.calcPRAmnt();
				this._removeTableSelectionsPurReq();

			}

		},
		handleLinkPress: function() {},
		_removeTableSelections: function() {
			this.byId("idTableApprover").removeSelections();
			this._toggleRemoveButtonEnablement(false);
		},
		_removeTableSelectionsPurReq: function() {
			this.byId("idTablePurReq").removeSelections();
			this._toggleRemoveButtonEnablement(false);
		},
		calcPRAmnt: function() {
			var oDraftEntries = this.byId("idTablePurReq").getModel("oJModel1").getData();
			var amt = 0,
				val;
			amt = parseFloat(amt);
			for (var i = 0; i < oDraftEntries.PurReq.length; i++) {
				// val = parseFloat(oDraftEntries.PurReq[i].Value);
				val = parseFloat(oDraftEntries.PurReq[i].Rlwrt);

				amt = amt + val;
			}
			this.getView().byId("idTotPRAmnt").setValue(amt);
		},
		// CostChange: function() {
		// 	var chkinc = this.getView().byId("ChkInc").getSelected();
		// 	var chkDec = this.getView().byId("ChkDec").getSelected();
		// 	var ChkNoCst = this.getView().byId("ChkNoCst").getSelected();
		// 	if (chkinc || chkDec || ChkNoCst === true) {
		// 		this.getView().byId("CstforallWrk").setEditable(true);
		// 		this.getView().byId("ExpensesPlus").setEditable(true);
		// 		this.getView().byId("ChangeSubAgrPresVal").setEditable(true);
		// 		this.getView().byId("SolReqPrjEst").setEditable(true);

		// 	} else {
		// 		this.getView().byId("CstforallWrk").setEditable(false);
		// 		this.getView().byId("ExpensesPlus").setEditable(false);
		// 		this.getView().byId("ChangeSubAgrPresVal").setEditable(false);
		// 		this.getView().byId("SolReqPrjEst").setEditable(false);
		// 	}
		// },
		noCostSel: function(oEvent) {
			if (oEvent.getParameters().selected) {
				this.getView().byId("CstforallWrk").setValue(0.00);
				this.getView().byId("ExpensesPlus").setValue(0.00);
				this.getView().byId("ChangeSubAgrPresVal").setValue(0.00);
				this.getView().byId("SolReqPrjEst").setValue(0.00);
				this.getView().byId("ChkDec").setSelected(false);
				this.getView().byId("ChkInc").setSelected(false);
			}

			var oModel = this.getOwnerComponent().getModel();
			var oAmount = this.getView().byId('SolReqPrjEst').getValue();
			var oValue = this.getView().byId('idUnderMWANo').getSelected();
			var oIT = this.getView().byId('SolReqIT').getSelectedIndex();

			var l = '';
			if (oAmount !== '0.00') {
				var a = oAmount.split(',');
				for (var i = 0; i < a.length; i++) {
					l = l + a[i];
				}
				oAmount = l;
			}

			var ItSelect1;
			if (oIT === 1) {
				ItSelect1 = true;
			} else {
				ItSelect1 = false;
			}

			if (oValue === true) {
				var oNonMWA = false;
			} else {
				oNonMWA = true;
			}
			var req = 0;
			var req1 = '';
			req = this.getView().byId('idRequestNumber').getValue();
			if (req !== 0) {
				req1 = req;
			}
			var cost;
			if (this.getView().byId('ChkNoCst').getSelected()) {
				cost = "3";
			} else if (this.getView().byId('ChkDec').getSelected()) {
				cost = "2";
			} else {
				cost = "0";
			}
			var oURLparams = {
				"ReqNo": req1,
				"ReqAmount": oAmount,
				"ITRequired": oIT,
				"NonMWA": oNonMWA,
				"Cost": cost
			};
			oModel.callFunction('/GetStaticAppr', {
				method: "GET",
				urlParameters: oURLparams,
				success: jQuery.proxy(this._getApprovers, this)
			});
		},
		onIncSel: function(oEvent) {
			this.getView().byId("ChkDec").setSelected(false);
			this.getView().byId("ChkNoCst").setSelected(false);
			this.getView().byId("idPresVal").setValue('0.00');
			// this.getView().byId("idPresVal").setEditable(false);
			var oModel = this.getOwnerComponent().getModel();
			var oAmount = this.getView().byId('SolReqPrjEst').getValue();
			var oValue = this.getView().byId('idUnderMWANo').getSelected();
			var oIT = this.getView().byId('SolReqIT').getSelectedIndex();

			var l = '';
			if (oAmount !== '0.00') {
				var a = oAmount.split(',');
				for (var i = 0; i < a.length; i++) {
					l = l + a[i];
				}
				oAmount = l;
			}

			var ItSelect1;
			if (oIT === 1) {
				ItSelect1 = true;
			} else {
				ItSelect1 = false;
			}

			if (oValue === true) {
				var oNonMWA = false;
			} else {
				oNonMWA = true;
			}
			var req = 0;
			var req1 = '';
			req = this.getView().byId('idRequestNumber').getValue();
			if (req !== 0) {
				req1 = req;
			}
			var cost;
			if (this.getView().byId('ChkNoCst').getSelected()) {
				cost = "3";
			} else if (this.getView().byId('ChkDec').getSelected()) {
				cost = "2";
			} else {
				cost = "0";
			}
			var oURLparams = {
				"ReqNo": req1,
				"ReqAmount": oAmount,
				"ITRequired": oIT,
				"NonMWA": oNonMWA,
				"Cost": cost
			};
			oModel.callFunction('/GetStaticAppr', {
				method: "GET",
				urlParameters: oURLparams,
				success: jQuery.proxy(this._getApprovers, this)
			});

		},
		onDecSel: function(oEvent) {
			this.getView().byId("ChkInc").setSelected(false);
			this.getView().byId("ChkNoCst").setSelected(false);
			this.getView().byId("idPresVal").setValue('0.00');
			// this.getView().byId("idPresVal").setEditable(false);

			var oModel = this.getOwnerComponent().getModel();
			var oAmount = this.getView().byId('SolReqPrjEst').getValue();
			var oValue = this.getView().byId('idUnderMWANo').getSelected();
			var oIT = this.getView().byId('SolReqIT').getSelectedIndex();

			var l = '';
			if (oAmount !== '0.00') {
				var a = oAmount.split(',');
				for (var i = 0; i < a.length; i++) {
					l = l + a[i];
				}
				oAmount = l;
			}

			var ItSelect1;
			if (oIT === 1) {
				ItSelect1 = true;
			} else {
				ItSelect1 = false;
			}

			if (oValue === true) {
				var oNonMWA = false;
			} else {
				oNonMWA = true;
			}
			var req = 0;
			var req1 = '';
			req = this.getView().byId('idRequestNumber').getValue();
			if (req !== 0) {
				req1 = req;
			}
			var cost;
			if (this.getView().byId('ChkNoCst').getSelected()) {
				cost = "3";
			} else if (this.getView().byId('ChkDec').getSelected()) {
				cost = "2";
			} else {
				cost = "0";
			}
			var oURLparams = {
				"ReqNo": req1,
				"ReqAmount": oAmount,
				"ITRequired": oIT,
				"NonMWA": oNonMWA,
				"Cost": cost
			};
			oModel.callFunction('/GetStaticAppr', {
				method: "GET",
				urlParameters: oURLparams,
				success: jQuery.proxy(this._getApprovers, this)
			});

		},
		addDashes: function(oEvent) {
			var a = oEvent.getParameters().newValue;
			a = a.replace(")", "");
			a = a.replace("(", "");
			a = a.replace(" ", "");
			a = a.replace("-", "");
			a = a.replace("-", "");
			var f_val = a.replace(/\D[^\.]/g, "");

			a = f_val.slice(0, 3) + "-" + f_val.slice(3, 6) + "-" + f_val.slice(6);

			this.getView().byId('idRechUs').setValue(a);

			// f_val = f.value.replace(/\D[^\.]/g, "");
			// f.value = f_val.slice(0,3)+"-"+f_val.slice(3,6)+"-"+f_val.slice(6);
		},
		addDashes1: function(oEvent) {
			var a = oEvent.getParameters().newValue;
			// a = a.replace(")", "");
			// a = a.replace("(", "");
			a = a.replace(" ", "");
			a = a.replace("-", "");
			a = a.replace("-", "");
			var f_val = a.replace(/\D[^\.]/g, "");

			a = f_val.slice(0, 3) + "-" + f_val.slice(3, 6) + "-" + f_val.slice(6);

			this.getView().byId('idVendPhon').setValue(a);

			// f_val = f.value.replace(/\D[^\.]/g, "");
			// f.value = f_val.slice(0,3)+"-"+f_val.slice(3,6)+"-"+f_val.slice(6);
		},
		addDashes2: function(oEvent) {
			var a = oEvent.getParameters().newValue;
			a = a.replace(")", "");
			a = a.replace("(", "");
			a = a.replace(" ", "");
			a = a.replace("-", "");
			a = a.replace("-", "");
			var f_val = a.replace(/\D[^\.]/g, "");

			a = f_val.slice(0, 3) + "-" + f_val.slice(3, 6) + "-" + f_val.slice(6);

			this.getView().byId('idVendFax').setValue(a);

			// f_val = f.value.replace(/\D[^\.]/g, "");
			// f.value = f_val.slice(0,3)+"-"+f_val.slice(3,6)+"-"+f_val.slice(6);
		},
		onSelectNerc: function(oEvent) {
			if (oEvent.getParameters().selectedIndex === 0) {
				this.getView().byId('idCertNo').setValue(null);
			}
		},
		onSelectExecOrd: function(oEvent) {
			if (oEvent.getParameters().selectedIndex === 0) {
				this.getView().byId('idExecOrdNo').setValue(null);
			}
		},
		onSelectSenateBill: function(oEvent) {
			if (oEvent.getParameters().selectedIndex === 0) {
				this.getView().byId('idBillNum').setValue(null);
			}
		},
		onSelectOthers: function(oEvent) {
			if (oEvent.getParameters().selectedIndex != 3) {
				this.getView().byId('idothers').setValue(null);
			}
			var oJModel1 = this.getOwnerComponent().getModel("oJModel1");
			oJModel1.setDefaultBindingMode("TwoWay");

			var oPurReq = [{
				"ReqNo": "0000000000",
				"Banfn": "",
				"Bnfpo": "",
				"Knttp": "",
				"Saknr": "",
				"Descr": "",
				"Quantity": "0.00",
				"Value": "0.00",
				"Rlwrt": "0.00",
				"AddInfo": ""

			}];
			oJModel1.setProperty("/PurReq", oPurReq);
			this.getView().byId('idTotPRAmnt').setValue('0.00');
		},
		handleF4UserHelp: function(oEvent) {
			if (!this.onf4Userhelpdialog) {
				this.onf4Userhelpdialog = sap.ui.xmlfragment("zmm005.zsrvamd.fragment.onF4User", this);
				this.getView().addDependent(this.onf4Userhelpdialog);
			}
			this.onf4Userhelpdialog.open();
		},
		onUserVHConfirm1: function(oEvent) {
			var oRequestorName = oEvent.getParameters().selectedItem.mAggregations.cells[0].getText();
			var oFname = oEvent.getParameters().selectedItem.mAggregations.cells[1].getText();
			var oLname = oEvent.getParameters().selectedItem.mAggregations.cells[2].getText();
			var oEmail = oEvent.getParameters().selectedItem.mAggregations.cells[3].getText();
			var oTphone = oEvent.getParameters().selectedItem.mAggregations.cells[4].getText();

			// id = "idServAgrOwn"
			// id = "idServAgrFname"
			// id = "idServAgrLname"
			// id = "idServAgrEmail"
			// id = "idServAgrTelNo"
			this.getView().byId("idServAgrOwn").setValue(oRequestorName);
			this.getView().byId("idServAgrFname").setValue(oFname);
			this.getView().byId("idServAgrLname").setValue(oLname);
			this.getView().byId("idServAgrEmail").setValue(oEmail);
			this.getView().byId("idServAgrTelNo").setValue(oTphone);

		},

		onMWA: function(oEvent) {
			var oModel = this.getOwnerComponent().getModel();
			var oAmount = this.getView().byId('SolReqPrjEst').getValue();
			var oValue = this.getView().byId('idUnderMWANo').getSelected();
			var oIT = this.getView().byId('SolReqIT').getSelectedIndex();

			if (!oEvent.getParameters().Selected) {
				this.getView().byId('idMwaValue').setValue(null);
			}

			var l = '';
			if (oAmount !== '0.00') {
				var a = oAmount.split(',');
				for (var i = 0; i < a.length; i++) {
					l = l + a[i];
				}
				oAmount = l;
			}

			var ItSelect1;
			if (oIT === 1) {
				ItSelect1 = true;
			} else {
				ItSelect1 = false;
			}

			if (oValue === true) {
				var oNonMWA = false;
			} else {
				oNonMWA = true;
			}
			var req = 0;
			var req1 = '';
			req = this.getView().byId('idRequestNumber').getValue();
			if (req !== 0) {
				req1 = req;
			}
			var cost;
			if (this.getView().byId('ChkNoCst').getSelected()) {
				cost = "3";
			} else if (this.getView().byId('ChkDec').getSelected()) {
				cost = "2";
			} else {
				cost = "0";
			}
			var oURLparams = {
				"ReqNo": req1,
				"ReqAmount": oAmount,
				"ITRequired": oIT,
				"NonMWA": oNonMWA,
				"Cost": cost
			};
			oModel.callFunction('/GetStaticAppr', {
				method: "GET",
				urlParameters: oURLparams,
				success: jQuery.proxy(this._getApprovers, this)
			});
		},
		onApprvAddApprover: function() {
			var oAddApprovers = new JSONModel({
				"ApproverName": ""
			});
			oAddApprovers.setDefaultBindingMode("TwoWay");
			this.getView().setModel(oAddApprovers, "oAddApprovers");
			if (!this.AddApproverFragment) {
				this.AddApproverFragment = sap.ui.xmlfragment("idAppApprFrgment1", "zmm005.zsrvamd.fragment.onF4ApproverAdd", this);
				this.getView().addDependent(this.AddApproverFragment);
			}
			this.AddApproverFragment.open();
		},
		handleF4Requestorfragment: function() {
			if (!this.ApproverDialog) {
				// Create Dialog using fragment factory
				this.ApproverDialog = sap.ui.xmlfragment("idAppApprFrgment2", "zmm005.zsrvamd.fragment.onF4AddApprover", this);
				//Connect Dialog to View
				this.getView().addDependent(this.ApproverDialog);
			}
			this.ApproverDialog.open();

		},
		onApprVHConfirmfragment: function(oEvent) {

			sap.ui.core.Fragment.byId("idAppApprFrgment1", "idApprName").setValue(oEvent.mParameters.selectedItem.mAggregations.cells[0].getText());

		},
		onAddApproverSave: function(oEvent) {

			var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZMM_WOM_ENH_INBOX_SRV/");
			var oApprName = sap.ui.core.Fragment.byId("idAppApprFrgment1", "idApprName").getValue();
			var oCrtSerAgr = this.getView().getModel('oCrtSerAgr');
			var reqNo = oCrtSerAgr.oData.ReqNo;
			var oURLparams = {
				"ReqNo": reqNo,
				"UserName": oApprName,
				"WorkItemID": "000000000000"

			};
			this.getView().setBusy(true);
			sap.ui.core.Fragment.byId("idAppApprFrgment1", "idApprName").setBusy(true);
			oModel.callFunction('/AddApprover', {
				method: "GET",
				urlParameters: oURLparams,
				success: jQuery.proxy(this._saveAddAppr, this)
			});
		},
		_saveAddAppr: function() {
			this.AddApproverFragment.close();
			sap.ui.core.Fragment.byId("idAppApprFrgment1", "idApprName").setBusy(false);
			var oModel = this.getOwnerComponent().getModel();
			var oCrtSerAgr = this.getView().getModel('oCrtSerAgr');
			var reqNo = oCrtSerAgr.oData.ReqNo;
			var ServiceRequestSet = "/ServiceRequestSet('" + reqNo + "')";
			this.getView().setBusy(false);
			var oTable = this.getView().byId("idTableApprover");
			oTable.setBusy(true);
			oModel.read(ServiceRequestSet, {
				urlParameters: {
					"$expand": ["ReqApprNav,ReqAttachNav", "ReqPRNav"]
				},
				success: jQuery.proxy(this._refreshAppr, this)
			});

		},
		onCloseAddApprover: function(oEvent) {
			this.AddApproverFragment.close();
		},
		_refreshAppr: function(oData, oResponse) {
			var oTable = this.getView().byId("idTableApprover");
			oTable.getModel("oJModel").setData({
				Approvers: oData.ReqApprNav.results
			});
			oTable.setBusy(false);

		}

	});
}, /* bExport= */ true);