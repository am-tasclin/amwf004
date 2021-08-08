//app.controller('AppCtrl', function($scope, $http, $timeout) {
app.controller('AppCtrl', function($scope, $http) {
	ctrl = this
//	initApp($scope, $http, $timeout)
	initApp($scope, $http)
	ctrl.page_title = 'j2c:'
	initJ2C()
})
