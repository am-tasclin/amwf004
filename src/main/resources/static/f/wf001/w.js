app.controller('AppCtrl', function($scope, $http, $timeout) {
	ctrl = this
	initApp($scope, $http, $timeout)
	ctrl.page_title = 'wf_ed001: '
	read2 = new Read2($http)
	initWF001()
})
