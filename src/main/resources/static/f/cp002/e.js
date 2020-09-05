app.controller('AppCtrl', class {
    constructor($scope, $http, $timeout) {
        ctrl = this
        initApp($scope, $http, $timeout)
        ctrl.page_title = 'CarePlanEdit002:'
        rw2 = new ReadWrite2($http, $timeout)
        ctrl.seek_template_list = [372146, 372307]
        initCarePlan001()
        initSqlExe($timeout)
        if (ctrl.request.parameters.id)
            readCarePlan(ctrl.request.parameters.id)
        // angular.forEach([372067, 368833, 368830], (doc_id) => {
        angular.forEach([372067], (doc_id) => {//  ☰ [372067] 17 F-eUA: CarePlan - ProgramControl
            rw2.readAll_element({ params: { doc_id: doc_id } })
        })
    }
})

var findElement = (e) => {
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

var initCarePlan001 = () => {
    ctrl.programControl = {}

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
            console.log('no insert', t.doc_id)
            let iX = ctrl.contains_child_type(t, 371928)//☰ [371928] o[]37|input 
            // console.log(iX.doc_id)
            let sE = ctrl.contains_child_type(iX, 371681)// SQL_Model.seek
            // console.log(sE.doc_id)
            let ssE = ctrl.eMap[sE.reference2]// SELECT to seek element
            console.log(ssE)
            delete ctrl.sql_exe.sql
            ctrl.sql_exe.read_select4(ssE.doc_id)
            rw2.timeout(() => {
                console.log(ctrl.sql_exe.sql)
                console.log(ctrl.sql_exe.sql_exe)
            }, 2)
        }
    }
}

var readCarePlan = (doc_id) => {
    console.log(doc_id)
    rw2.readAll_element({
        params: { doc_id: doc_id }, fn2ForEach: (o, response) => {
            if (ctrl.eMap[o.parent] && 368789 == ctrl.eMap[o.parent].reference) {//CarePlan.activity.*
                console.log(o.doc_id, o.reference2)
                rw2.readAll_element({
                    params: { doc_id: o.reference2 }, fn2ForEach: (omr) => {//*.reference -> MedicationRequest|...
                        if (371469 == omr.reference) {//MedicationRequest.medication
                            console.log('omr:', omr.doc_id)
                            rw2.readAll_element({ params: { doc_id: omr.reference2 } })
                        }
                    }
                })
            }
        }
    })
}
