app.controller('AppCtrl', function($scope, $http, $timeout) {
	ctrl = this
	initApp($scope, $http, $timeout)
	ctrl.page_title = 'j2c:'
	initJ2C()
	ctrl.click_id=371858;

	ctrl.getDocId=function (docId) {
		ctrl.click_id=docId;
		console.log('is worked');
	}
})

app.directive('workSpace',function () {
	return{
		replace:true,
		restrict:'AE',
		scope:{docId:'=docId'},
		templateUrl:'templates/switchTemplates.html',
		link:function (scope,element,attributes) {
			console.log(scope.docId);
		}
	}
})

