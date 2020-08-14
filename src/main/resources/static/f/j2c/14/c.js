app.controller('AppCtrl', function ($scope, $http, $timeout) {
	ctrl = this
	initApp($scope, $http, $timeout)
	ctrl.page_title = 'j2c:'
	initJ2C()
	ctrl.templateView = '';
	ctrl.isShow = false;
	ctrl.selectItemId;
	ctrl.oldSelectItemParentId;
	ctrl.oldSelectItemIndex;
	ctrl.selectedItemObject1;
	ctrl.selectedItemInConstructSettings;
	ctrl.newElementObject;
	ctrl.cancel=function(){
		ctrl.templateView = '';
	}
	ctrl.nextViewOfNewElement=function(){
		ctrl.templateView = '';
	}
	ctrl.save_data = function(){
		var so = {
			dataAfterSave: function (response) {
			if(response.data){
				var oldParent = ctrl.eMap[ctrl.oldSelectItemParentId];
				console.log("newPar", newParent);
				var newParent = ctrl.eMap[ctrl.selectedItemInConstructSettings.parent];
				console.log("oldPar",oldParent);
				oldParent.children.splice(oldParent.children.indexOf(ctrl.oldSelectItemIndex),1);
				// newParent.children.push(ctrl.selectedItemInConstructSettings);
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
				console.log(response)
			}
		}
		so.sql = "DELETE FROM doc WHERE doc_id = "+ctrl.selectedItemInConstructSettings.doc_id+"; "
		console.log(so.sql)
		writeSql(so)
	}
})

app.directive('workSpace', function () {
	return {
		replace: true,
		restrict: 'AE',
		link: function (scope, element, attr) {
			element.on('click', function () {
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
					console.log(element);
						ctrl.templateView = 'General';
						ctrl.newElementObject={};
				})
		}
	}
})
