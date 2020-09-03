app.controller('AppCtrl', class {
    constructor($scope, $http, $timeout) {
        ctrl = this
        initApp($scope, $http, $timeout)
        ctrl.page_title = 'CarePlanEdit001:'
        rw2 = new ReadWrite2($http)
        initCarePlan001()
        initSqlExe($timeout)
        ctrl.seek_template_list = [372146]
    }
})

var testFunction = (p)=>{
    ctrl.sql_exe.read_select3 (p)
}

findElement = (e) => {
    let els = [], fEl = (e) => {
        if (371968 == e.reference2)//Element
            els.push(e)
    }
    angular.forEach(e.children, (e1) => {
        fEl(e1)
        angular.forEach(e1.children, (e2) => {
            fEl(e2)
        })
    })
    return els
}

initCarePlan001 = () => {
    ctrl.programControl = {}
    ctrl.programControl.openDialogName

    ctrl.programControl.fromToDo = ()=>{
        console.log(ctrl.programControl.fromTo, ctrl.programControl.selectedParentEl)
    }

    ctrl.programControl.setFrom = (e) => {
        if (!ctrl.programControl.fromTo)
            ctrl.programControl.fromTo = {}
        ctrl.programControl.fromTo.from = e
    }

    ctrl.programControl.clickSelect = (e) => {
        ctrl.programControl.selectedParentEl = e
    }

    ctrl.programControl.isForSelected = (e) => {
        let isForSelected = false
        if (ctrl.programControl.selectedParentEl)
            angular.forEach(e.children, (e1) => {
                if (!isForSelected) {
                    if (ctrl.programControl.selectedParentEl.reference == e1.reference2) {
                        if (371969 == ctrl.eMap[e1.parent].reference) {//Element.parent
                            isForSelected = true
                        }
                    } else {
                        isForSelected = ctrl.programControl.isForSelected(e1)
                    }
                }
            })
        return isForSelected
    }

    ctrl.programControl.exeTask = (t) => {
        ctrl.programControl.selectedTaskEl = t
        let els = findElement(t)
        console.log(t, els)
        if (!ctrl.programControl.selectedParentEl) {//not to/source/parent element
            // console.log(t.doc_id, els)
            angular.forEach(els.children, (elAttEl) => {
                if (371969 == elAttEl.reference) {//parent
                    // console.log(elAttEl)
                    angular.forEach(elAttEl.children, (elAttEl2) => {
                        if (371971 == elAttEl2.reference) {//reference2
                            // console.log(elAttEl2.reference, elAttEl2.reference2, ctrl.programControl.select_id, ctrl.eMap[ctrl.programControl.select_id])
                            if (elAttEl2.reference2 == ctrl.eMap[ctrl.programControl.select_id].reference2) {
                                ctrl.programControl.selectedParentEl = ctrl.eMap[ctrl.programControl.select_id]
                            }
                        }
                    })
                }
            })
        }
        let sql_insert = ''
        angular.forEach(els, (el, i) => {
            createInsertFromElement(el, i + 1)
            sql_insert += el.sql_insert + '\n'
            // console.log(el.doc_id, el.sql_insert)
        })
        // console.log(sql_insert)
        // return
        if (sql_insert) {
            rw2.write({
                then_fn: (response) => {
                    console.log(response.data, sql_insert)
                }, params: { data: { sql: sql_insert } },
                error_fn: (response) => {
                    console.log(response)
                }
            })
        } else {
            console.log('no insert', t)
            let iX = ctrl.contains_child_type(t, 371928)//☰ [371928] o[]37|input 
            console.log(iX.doc_id)
            let sE = ctrl.contains_child_type(iX, 371681)// SQL_Model.seek
            console.log(sE.doc_id)
            let ssE = ctrl.eMap[sE.reference2]// SELECT to seek element
            console.log(ssE)
            ctrl.sql_exe.read_select3(ssE.doc_id)
        }
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

    ctrl.programControl.deleteElement = () => {
        console.log(ctrl.programControl.selectedParentEl)
        let sql_delete = "DELETE FROM doc WHERE doc_id=:doc_id"
        rw2.write({
            then_fn: (response) => {
                console.log(response.data)
            }, params: { data: { sql: sql_delete, doc_id: ctrl.programControl.selectedParentEl.doc_id } }
        })
    }

    ctrl.programControl.openDialogFn = (name) => {
        ctrl.programControl.openDialogName = ctrl.programControl.openDialogName == name ? null : name
        console.log(name)
        if (ctrl.programControl.openDialog[name])
            ctrl.programControl.openDialog[name]()
    }
    let doc_id = ctrl.request.parameters.id
    ctrl.programControl.select_id = doc_id
    console.log(doc_id)
    rw2.readAll_element({
        params: { doc_id: doc_id }, fn2ForEach: (o, response) => {
            if (ctrl.eMap[o.parent] && 368789 == ctrl.eMap[o.parent].reference) {//activity
                console.log(o.doc_id, o.reference2)
                //MedicationRequest|...
                rw2.readAll_element({
                    fn2ForEach: (om) => {
                        if (371469 == om.reference) {//medication
                            console.log(om.doc_id, om.reference2, om.reference)
                            rw2.readAll_element({ params: { doc_id: om.reference2 } })
                        }
                    }, params: { doc_id: o.reference2 }
                })
            }
            if (o.reference2) {
                rw2.readAll_element({
                    params: { doc_id: o.reference2 }, fn2ForEach: (o2) => {
                        // if ([368789, 368794].indexOf(o2.doc_id) >= 0)
                        // if (o2.reference2)
                    }
                })
            }
        }
    })
    angular.forEach([372067, 368833, 368830], (doc_id) => {
        rw2.readAll_element({ params: { doc_id: doc_id } })
    })
}
