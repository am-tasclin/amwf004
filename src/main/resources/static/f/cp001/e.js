app.controller('AppCtrl', class {
    constructor($scope, $http, $timeout) {
        ctrl = this
        initApp($scope, $http, $timeout)
        ctrl.page_title = 'CarePlanEdit001:'
        rw2 = new ReadWrite2($http)
        initCarePlan001()
    }
})

initCarePlan001 = () => {
    let doc_id = ctrl.request.parameters.id
    console.log(doc_id, rw2)
    rw2.readAll_element({ params: { doc_id: doc_id } })
    ctrl.programControl = {}
    ctrl.programControl.openDialogName
    ctrl.programControl.openDialogFn = (name) => {
        ctrl.programControl.openDialogName = ctrl.programControl.openDialogName == name ? null : name
    }
}
