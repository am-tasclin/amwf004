app.controller('AppCtrl', function ($scope, $http, $timeout, $location) {
	ctrl = this
	ctrl.getURL=$location;
	console.log($location);
	initApp($scope, $http, $timeout)
	ctrl.page_title = 'j2c:'
	initJ2C()
	ctrl.templateView = '';
	ctrl.isDisabled='w3-disabled';
	ctrl.isShow = false;
	ctrl.isChangeSelectParent=false;
	ctrl.selectItemId;
	ctrl.oldSelectItemParentId;
	ctrl.oldSelectItemIndex;
	ctrl.selectedItemObject1;
	ctrl.selectedItemInConstructSettings;
	ctrl.newElementObject;
	ctrl.cancel=function(){
		ctrl.templateView = '';
		ctrl.isChangeSelectParent=false;
	}
	ctrl.nextViewOfNewElement=function(){
		ctrl.templateView = '';
	}
	ctrl.save_data = function(){
		var so = {
			dataAfterSave: function (response) {
			if(response.data.update_1){
				if(ctrl.isChangeSelectParent){
				var oldParent = ctrl.eMap[ctrl.oldSelectItemParentId];
				var newParent = ctrl.eMap[ctrl.selectedItemInConstructSettings.parent];
				 oldParent.children.splice(ctrl.oldSelectItemIndex,1);
				 newParent.children.push(ctrl.selectedItemInConstructSettings);
				 newParent.children.sort();}
			}
			}
		}

		so.sql = "UPDATE string SET value= '"+ctrl.selectedItemInConstructSettings.value_1_22+"' WHERE string_id = "+ctrl.selectedItemInConstructSettings.doc_id+"; "+
		"UPDATE doc SET parent= '"+ctrl.selectedItemInConstructSettings.parent+"' WHERE doc_id = "+ctrl.selectedItemInConstructSettings.doc_id+"; ";
		// so.sql += sql_app.SELECT_obj_with_i18n(':nextDbId1')
		console.log(so.sql)
		writeSql(so)

	}
	ctrl.removeSelectedNode= function(){
		var so = {
			dataAfterSave: function (response) {
				if(response.data.update_0){
					var Parent = ctrl.eMap[ctrl.selectedItemInConstructSettings.parent];
					 Parent.children.splice(ctrl.oldSelectItemIndex,1);
				}
			}
		}
		so.sql = "DELETE FROM doc WHERE doc_id = "+ctrl.selectedItemInConstructSettings.doc_id+"; "
		console.log(so.sql)
		writeSql(so)
	}
	ctrl.creatNewRootNodeInConfiguration = function (e) {
		var so = {
			dataAfterSave: function (response) {
				console.log(response)
				var e = ctrl.eMap[ctrl.templateEditId];
				var newE = response.data.list2[0];
				ctrl.templateView='';
		console.log(e.children, newE)
		e.children.push(newE) 
			}
		}
		so.sql = "INSERT INTO doc (doc_id, parent,reference2) VALUES (:nextDbId1, " + ctrl.newElementObject.parent + ","+ctrl.newElementObject.reference2+" ); "
		so.sql += "INSERT INTO string (string_id, value) VALUES (:nextDbId1, "+ctrl.newElementObject.value_1_22+"); "
		so.sql += sql_app.SELECT_obj_with_i18n(':nextDbId1')
		console.log(ctrl.templateEditId, so.sql)
		writeSql(so)
	}
	
})

app.directive('workSpace', function () {
	return {
		replace: true,
		restrict: 'AE',
		link: function (scope, element, attr) {
			element.on('click', function () {
				ctrl.isDisabled='w3-disabled';
				ctrl.isShow = false;
				if(ctrl.templateEditId)
				 var previousSelectedElement = angular.element(document.getElementById(ctrl.templateEditId)).removeClass('w3-blue');
				element.addClass('w3-blue');
				ctrl.templateEditId = attr.workSpace;
				if(ctrl.templateEditId<371832||ctrl.templateEditId>371847)
				{ctrl.selectedItemObject1 = ctrl.eMap[ctrl.templateEditId];
					if(!ctrl.selectedItemObject1.open_children){
					ctrl.templateView = 'ConstructSettings';}else{
						ctrl.templateView = '';
					}
				} else{
					ctrl.templateView = '';
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
				ctrl.newElementObject=null;
				ctrl.isDisabled	='';
				ctrl.isChangeSelectParent=false;
				ctrl.selectItemId = attr.selectItem;
				ctrl.selectedItemInConstructSettings = ctrl.eMap[ctrl.selectItemId];
				ctrl.oldSelectItemParentId=ctrl.selectedItemInConstructSettings.parent;
				ctrl.oldSelectItemIndex=ctrl.eMap[ctrl.oldSelectItemParentId].children.indexOf(ctrl.selectedItemInConstructSettings);
				console.log(ctrl.oldSelectItemIndex);
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
app.directive('newElement',function(){
	return{
		replace: true,
		restrict: 'A',
		link: function(scope, element, attr){
				element.on('click',function(){
					var p=ctrl.getURL.$$absUrl.split('?p=')[1];
						ctrl.templateView = 'newElementConstructor';
						ctrl.templateEditId=attr.newElement;
						ctrl.selectedItemInConstructSettings=null;
						ctrl.newElementObject={};
						ctrl.newElementObject.value_1_22="Новий";
						ctrl.newElementObject.parent=p;
						ctrl.newElementObject.reference2=attr.newElement;
						ctrl.newElementObject.r2value=ctrl.eMap[attr.newElement].value_1_22;
						console.log(ctrl.eMap[attr.newElement].doc_id);
				})
		}
	}
})
