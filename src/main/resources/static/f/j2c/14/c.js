app.controller('AppCtrl', function ($scope, $http, $timeout) {
	ctrl = this
	initApp($scope, $http, $timeout)
	ctrl.page_title = 'j2c:'
	initJ2C()
	ctrl.templateView = '';
	ctrl.isShow = false;
	ctrl.selectItemId;
	ctrl.selectedItemObject1;
	ctrl.selectedItemObject2;
	ctrl.newElementObject;
	ctrl.save_data = function(){
		console.log(123, ctrl.selectedItemObject1, ctrl.selectedItemObject2)
		var so = {
			dataAfterSave: function (response) {
				console.log(response)
			}
		}
		so.sql = "UPDATE string SET value= '"+ctrl.selectedItemObject2.value_1_22+"' WHERE string_id = "+ctrl.selectedItemObject2.doc_id+"; "
		// so.sql += sql_app.SELECT_obj_with_i18n(':nextDbId1')
		console.log(so.sql)
		writeSql(so)
	}
})

app.directive('workConstruct', function () {
	return {
		replace: true,
		restrict: 'AE',
		link: function (scope, element, attr) {
			element.on('click', function () {
				ctrl.isShow = false;
				ctrl.templateEditId = attr.workConstruct;
				ctrl.selectedItemObject1 = ctrl.eMap[ctrl.templateEditId];
					ctrl.templateView = 'ConstructSettings';
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
				ctrl.selectedItemObject2 = ctrl.eMap[ctrl.selectItemId];
				console.log(ctrl.selectedItemObject2);
				var listItems = element.parent().parent().parent().children().children();
				listItems = Object.values(listItems);
				listItems.pop();
				listItems.forEach(arrElement => {
					angular.element(arrElement).children().removeClass('w3-blue');
				});
				angular.element(element).addClass('w3-blue');
			})
		}
	}
})
app.directive('newElement',function(){
	return{
		restrict: 'A',
		link: function(scope, element, attr){
				element.on('click',function(){
						
				})
		}
	}
})
