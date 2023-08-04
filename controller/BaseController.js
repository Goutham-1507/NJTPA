sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/message/Message",
	"sap/ui/core/routing/History"
], function (Controller, Message, History) {
	"use strict";
	return Controller.extend("zmm005.zsrvamd.controller.BaseController", {
		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		getModel: function (sName) {
			return this.getView().getModel(sName);
		},
		getOModel: function () {
			return this.getOwnerComponent().getModel();
		},
		setModel: function (oModel, sName) {
			return (this.getModel(sName) === undefined) ? this.getView().setModel(oModel, sName) : this.getModel(sName);
		},
		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},
		onNavBack: function () {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("main", true);
			}
		}
	});
});