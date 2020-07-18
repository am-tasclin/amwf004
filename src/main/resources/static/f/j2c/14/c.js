app.controller('AppCtrl', function($scope, $http, $timeout) {
	ctrl = this
	initApp($scope, $http, $timeout)
	ctrl.page_title = 'j2c:'
	initJ2C()
	ctrl.templateView='';
	ctrl.isShow=false;
})

app.directive('workSpace',function () {
	return{
		replace:true,
		restrict:'AE',
		link:function (scope,element,attr) {
			element.on('click',function () {
				if(attr.workSpace>=371833&&attr.workSpace<=371847){
					ctrl.templateView='Construct';
					console.log(ctrl.templateView);
				}else if(attr.workSpace==371832){
					ctrl.templateView='General';
				}else {
					ctrl.templateView='ConstructSettings';
				}
				console.log(ctrl.templateView);
			})

		}
	}
})

