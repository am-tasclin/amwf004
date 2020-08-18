app.controller('AppCtrl', class {
    constructor($scope, $http, $timeout) {
        ctrl = this
        initApp($scope, $http, $timeout)
        ctrl.page_title = 'CarePlanEdit001:'
        rw2 = new ReadWrite2($http)
        initCarePlan001()
    }
})

findElement = (e) => {
    let el, fEl = (e) =>{ if (371968 == e.reference2) el = e}
    angular.forEach(e.children, (e1) => {
        fEl(e1)
        angular.forEach(e1.children, (e2) => {
            fEl(e2)
        })
    })
    return el
}

initCarePlan001 = () => {
    ctrl.programControl = {}
    ctrl.programControl.openDialogName
    ctrl.programControl.exeTask = (t) => {
        let el = findElement(t)
        console.log(t.doc_id, el)
        createInsertFromElement(el)
        console.log(t.sql_insert)
    }
    ctrl.programControl.openDialog = {}
    ctrl.programControl.openDialog.open = () => {
        let lCP_sql = ctrl.eMap[372069].value_1_22
        console.log(lCP_sql, ctrl.eMap[372069])
        rw2.sql1({
            fnThen: (response) => {
                ctrl.listCarePlan = response.data.list
                console.log(ctrl.listCarePlan)
            }, params: { sql: lCP_sql }
        })
    }
    ctrl.programControl.openDialogFn = (name) => {
        ctrl.programControl.openDialogName = ctrl.programControl.openDialogName == name ? null : name
        console.log(name)
        if (ctrl.programControl.openDialog[name])
            ctrl.programControl.openDialog[name]()
    }
    let doc_id = ctrl.request.parameters.id
    console.log(doc_id)
    rw2.readAll_element({
        params: { doc_id: doc_id }, fn2ForEach: (o, response) => {
            // console.log(o.doc_id, o.reference2, o.r2value)
            if (o.reference2) {
                console.log(o.reference2, o.r2value)
                rw2.readAll_element({
                    params: { doc_id: o.reference2 }, fn2ForEach: (o2) => {
                        // if ([368789, 368794].indexOf(o2.doc_id) >= 0)
                        if (o2.reference2)
                            console.log(o2.doc_id, o2.reference2, o2.r2value)
                    }
                })
            }
        }
    })
    angular.forEach([372067, 368833, 368830], (doc_id) => {
        console.log(doc_id)
        rw2.readAll_element({ params: { doc_id: doc_id } })
    })
}
