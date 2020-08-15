app.controller('AppCtrl', function ($scope, $http, $timeout) {
    ctrl = this
    initApp($scope, $http, $timeout)
    ctrl.page_title = 'CarePlanEdit001:'
    read2 = new Read2($http)
    initCarePlan001()
})

initCarePlan001 = () => {
    console.log(123, read2)
    
    ctrl.programVontrol = {}
    ctrl.programVontrol.openDialogName
}
