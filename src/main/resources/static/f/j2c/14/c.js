app.controller('AppCtrl', function ($scope, $http, $timeout, $location) {
	ctrl = this
	ctrl.getURL = $location.$$absUrl;
	initApp($scope, $http, $timeout)
	ctrl.page_title = 'j2c:';
	initJ2C($http);
	ctrl.templateView = '';
	ctrl.isDisabled = 'w3-disabled';
	ctrl.isShow = false;
	ctrl.isChangeSelectParent = false;
	ctrl.isChangeSelecDocType = false;
	ctrl.selectItemId;
	ctrl.oldSelectItemParentId;
	ctrl.oldSelectItemIndex;
	ctrl.selectedItemObject1;
	ctrl.selectedItemInConstructSettings;
	ctrl.newElementObject;
	ctrl.newConfigeratorModel = {};
	ctrl.linkNewConfigurator = "";
	ctrl.docTypeArr = [];
	ctrl.NameDocTypeFnRet;
	(function () { 
		ctrl.newConfigeratorModel.name = "New"; 
		function docType_Name (){
			this.docTypeName="";
			this.getDocTypeName=function (doctype_id) {
				let tempName="";
				ctrl.docTypeArr.forEach(function (val, index, arr) 
				{ 
					if (val.doctype_id == doctype_id) 
					{ 
					tempName = val.doctype; 
						} });
						if(tempName==""){return null};
						this.docTypeName = tempName;
					return 	tempName;
			}
		};
		ctrl.NameDocTypeFnRet=new docType_Name();
	}());
	
	(ctrl.getDocTypeValueArr = () => {
		var so = {
			dataAfterSave: function (response) {
				// console.log("doc_Type", response.data)
				ctrl.docTypeArr = response.data.list0.filter(function (docType) {
					if (docType.doctype_id == 1 || docType.doctype_id == 18 || docType.doctype_id == 22 || docType.doctype_id == 23 || docType.doctype_id == 24 || docType.doctype_id == 25 || docType.doctype_id == 26 || docType.doctype_id == 28 || docType.doctype_id == 29 || docType.doctype_id == 32) {
						return docType;
					}
				});
				// console.log("ctrl.docTypeArr", ctrl.docTypeArr)

			}
		}
		so.sql = "SELECT * FROM doctype"
		// console.log("doc_Type", so.sql)
		writeSql(so)
	})();

	ctrl.getUrlWithParam = function (doc_id) {
		var p = ctrl.getURL.split('?p=')[1];
		return ctrl.getURL.replace(p, doc_id);
	}
	ctrl.cancel = function () {
		ctrl.templateView = '';
		ctrl.isChangeSelectParent = false;
		ctrl.isChangeSelecDocType = false;
	}
	ctrl.createNewConfigurator = () => {
		var so = {
			dataAfterSave: function (response) {
				console.log(response.data)
				var newE = response.data.list2[0];
				ctrl.eMap[newE.doc_id] = newE;
				if (response.data.list2[0]) {
					var p = ctrl.getURL.split('?p=')[1];
					ctrl.linkNewConfigurator = ctrl.getURL.replace(p, newE.doc_id);
					ctrl.templateView = 'refToNewConfigurator';
				}
			}
		}
		so.sql = "INSERT INTO doc (doc_id, parent,reference) VALUES (:nextDbId1, "
			+ 371855 + "," + 371830 + " ); "
		so.sql += "INSERT INTO string (string_id, value) VALUES (:nextDbId1, '" + ctrl.newConfigeratorModel.name + "' ); "
		so.sql += sql_app.SELECT_obj_with_i18n(':nextDbId1')
		console.log(so.sql)
		writeSql(so)
	}
	ctrl.nextViewOfNewElement = function () {
		ctrl.templateView = '';
	}
	ctrl.openConfigurato = function () {
		console.log('so.sql');
		var so = {
			dataAfterSave: function (response) {
				console.log(response);
			}
		}

		so.sql = "SELECT * FROM doc WHERE parent = 371855";
		console.log(so.sql);
		writeSql(so)
	}
	ctrl.save_data = function () {
		var so = {
			dataAfterSave: function (response) {
				if (response.data.update_1) {
					var oldParent = ctrl.eMap[ctrl.oldSelectItemParentId];
					var newParent = ctrl.eMap[ctrl.selectedItemInConstructSettings.parent];
					oldParent.children.splice(ctrl.oldSelectItemIndex, 1);
					newParent.children.push(ctrl.selectedItemInConstructSettings);
					newParent.children.sort();
				}
			}
		}

		so.sql = "UPDATE string SET value= '" + ctrl.selectedItemInConstructSettings.value_1_22 + "' WHERE string_id = " + ctrl.selectedItemInConstructSettings.doc_id + "; ";
		if (ctrl.isChangeSelectParent) { so.sql += "UPDATE doc SET reference= '" + ctrl.selectedItemInConstructSettings.reference + "' WHERE doc_id = " + ctrl.selectedItemInConstructSettings.doc_id + "; "; }
		if (ctrl.isChangeSelecDocType) { so.sql += "UPDATE doc SET doctype= '" + ctrl.selectedItemInConstructSettings.doctype + "' WHERE doc_id = " + ctrl.selectedItemInConstructSettings.doc_id + "; "; }
		// so.sql += sql_app.SELECT_obj_with_i18n(':nextDbId1')
		console.log(so.sql)
		writeSql(so)

	}
	ctrl.removeSelectedNode = function (e) {
		var so = {
			dataAfterSave: function (response) {
				if (response.data.update_0) {
					var ParentId = ctrl.eMap[e].parent;
					var index = ctrl.eMap[ParentId].children.indexOf(ctrl.eMap[e]);
					ctrl.eMap[ParentId].children.splice(index, 1);
					console.log(index);
					// if(document.getElementById(e)){
					// 	var elem=document.getElementById(e);
					// 	elem.parentNode.removeChild(elem);
					// }
				}
			}
		}
		so.sql = "DELETE FROM doc WHERE doc_id = " + e + "; "
		console.log(so.sql)
		writeSql(so)
	}
	ctrl.creatNewRootNodeInConfiguration = function (e) {
		var so = {
			dataAfterSave: function (response) {
				console.log(response);
				var e = ctrl.eMap[ctrl.templateEditId];
				var newE = response.data.list2[0];
				ctrl.templateView = '';
				ctrl.eMap[newE.doc_id] = newE;
				console.log(e.children, newE);
				if (e.children) {
					e.children.push(newE);
				} else {
					e.children = [];
					e.children.push(newE);
				}
			}
		}
		console.log(ctrl.newElementObject)
		let ref = ctrl.newElementObject.refEl.reference2
		so.sql = "INSERT INTO doc (doc_id, parent,reference,reference2) VALUES (:nextDbId1, "
			+ ctrl.newElementObject.parent + "," + ref + "," + ctrl.newElementObject.reference2 + " ); "
		so.sql += "INSERT INTO string (string_id, value) VALUES (:nextDbId1, '" + ctrl.newElementObject.value_1_22 + "' ); "
		so.sql += sql_app.SELECT_obj_with_i18n(':nextDbId1')
		console.log(ctrl.templateEditId, so.sql)
		writeSql(so)
	}

})


 
app.directive('workSpace', function () {
	return {
		replace: true,
		restrict: 'A',
		link: function (scope, element, attr) {
			element.on('click', function () {
				ctrl.isDisabled = 'w3-disabled';
				ctrl.isShow = false;
				if (ctrl.templateEditId)
					var previousSelectedElement = angular.element(document.getElementById(ctrl.templateEditId)).removeClass('w3-blue');
				element.addClass('w3-blue');
				ctrl.templateEditId = attr.workSpace;
				if (ctrl.templateEditId < 371832 || ctrl.templateEditId > 371847) {
					ctrl.selectedItemObject1 = ctrl.eMap[ctrl.templateEditId];
					if (!ctrl.selectedItemObject1.open_children) {
						ctrl.templateView = 'ConstructSettings';
					} else {
						ctrl.templateView = '';
					}
				} else {
					ctrl.templateView = '';
				}
				if (ctrl.eMap[ctrl.templateEditId].doctype == 37) {
					ctrl.templateView = 'tableView';
				}

			})
		}
	}
})

app.directive('selectItem', function () {
	return {
		replace: true,
		restrict: 'A',
		link: function (scope, element, attr) {
			element.on('click', function () {
				ctrl.newElementObject = null;
				ctrl.isDisabled = '';
				ctrl.isChangeSelectParent = false;
				ctrl.isChangeSelecDocType = false;
				ctrl.selectItemId = attr.selectItem;
				console.log(ctrl.selectItemId);
				ctrl.selectedItemInConstructSettings = ctrl.eMap[ctrl.selectItemId];
				console.log(ctrl.selectedItemInConstructSettings);
				ctrl.oldSelectItemParentId = ctrl.selectedItemInConstructSettings.parent;
				ctrl.oldSelectItemIndex = ctrl.eMap[ctrl.oldSelectItemParentId].children.indexOf(ctrl.selectedItemInConstructSettings);
				var listItems = element.parent().parent().parent().children().children();
				listItems = Object.values(listItems);
				listItems.pop();
				listItems.forEach(arrElement => {
					angular.element(arrElement).children().removeClass('w3-blue');
				});
				element.addClass('w3-blue');
			})
		}
	}
})
app.directive('newElement', function () {
	return {
		replace: true,
		restrict: 'A',
		link: function (scope, element, attr) {
			element.on('click', function () {
				var p = ctrl.getURL.split('?p=')[1];
				ctrl.templateView = 'newElementConstructor';
				ctrl.templateEditId = attr.newElement;
				ctrl.selectedItemInConstructSettings = null;
				ctrl.newElementObject = {};
				ctrl.newElementObject.value_1_22 = "Новий";
				ctrl.newElementObject.parent = p;
				ctrl.newElementObject.reference2 = attr.newElement;
				ctrl.newElementObject.r2value = ctrl.eMap[attr.newElement].value_1_22;
				console.log(ctrl.eMap[attr.newElement].doc_id);
				ctrl.newElementObject.refEl

				angular.forEach(ctrl.eMap[372091].children, (e) => {//Element
					angular.forEach(e.children, (a1) => {
						angular.forEach(a1.children, (a2) => {
							if (371971 == a2.reference) {//reference2
								if (attr.newElement == a2.reference2) {
									ctrl.newElementObject.refEl = a1
								}
							}
						})
					})
				})
				console.log(ctrl.newElementObject.refEl)
			})
		}
	}
})
