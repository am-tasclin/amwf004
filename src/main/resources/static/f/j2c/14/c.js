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
})

app.directive('workSpace', function () {
	return {
		replace: true,
		restrict: 'AE',
		link: function (scope, element, attr) {
			element.on('click', function () {
				ctrl.isShow = false;
				ctrl.templateEditId = attr.workSpace;
				ctrl.selectedItemObject1 = ctrl.eMap[ctrl.templateEditId];
				if (attr.workSpace >= 371833 && attr.workSpace <= 371847) {
					ctrl.templateView = 'Construct';
				} else if (attr.workSpace == 371832) {
					ctrl.templateView = 'General';
				} else {
					ctrl.templateView = 'ConstructSettings';
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

