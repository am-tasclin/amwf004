'use strict'
app.factory("dataFactory", DataFactory)
app.directive('amSqlHtml', AmSqlHtml)

conf.pws = {}//Physition Work Station
conf.pws.topMenu = {
    pl: 'Пацієнт',
    hy: 'Історія',
    tp: 'Лікувальний процес',
    emz: 'ЕМЗ-документація'
}

// app.controller("InitPageController", InitPageController)
class InitPageController extends AbstractController {
    constructor($scope, $route, $routeParams) {
        super()
        // console.log(Object.keys($route.routes)) // NOT DELETE
    }
}
app.controller("InitPageController", InitPageController)

// app.controller("HistoryProcessController", HistoryProcessController)
class HistoryProcessController extends SqlAbstractController {
    constructor(dataFactory, $routeParams) {
        super(dataFactory)
        console.log('HistoryProcessController', singlePage.FirstUrlId() || singlePage.UrlParamKeyValue('pt'))
        if (singlePage.FirstUrlId() || singlePage.UrlParamKeyValue('pt')) {
            if(!conf.patient){
                this.read('Patient_family_name', 'patient')
                this.read('EpisodeOfCare_Patient', 'episodes')
                this.read('Encounter_Patient', 'encounters')
                this.read('encounter_MedicationRequest_sc_doseQuantityTimingPeriod', 'mrEncounter')
            }else{
                console.log('patient_id = ', conf.patient[0].patient_id)
            }
        }
    }

    f1 = (sql2Name) => this.sqlForOnePatient.replace(':sql ', readSql2R(sql2Name))
        .replace(':patient_id', patient_id)

    read = (sql2Name, confKey) => this.dataFactory.httpGetSql(
        {
            sql: this.sqlForOnePatient.replace(':sql ', readSql2R(sql2Name))
                .replace(':patient_id', singlePage.FirstUrlId() || singlePage.UrlParamKeyValue('pt'))
        }
    ).then(dataSqlRequest => conf[confKey] = dataSqlRequest.list)

    sqlForOnePatient = 'SELECT * FROM (:sql ) p WHERE patient_id = :patient_id'
    clicEpisode = (ee) => {
        console.log(ee)
        conf.clickedElement = ee
    }
    clicEncounter = (er) => {
        console.log(er)
        conf.clickedElement = er
    }
    clicDiagnose = (er) => {
        console.log(er.dgcondition_id, er.dgcondition_code_id, er)
    }
    clicReason = (er) => {
        console.log(er.reason_id, er.reason_code_id, er)
    }
}
app.controller("HistoryProcessController", HistoryProcessController)

angular.forEach(['hy', 'hy_:pt_id','hy_:pt_id/emr_:emr_id'], element => {
    singlePage[element] = {
        templateUrl: 'hy.html',
        controller: 'HistoryProcessController',
    }
})

// app.controller("EMRProcessController", EMRProcessController)
class EMRProcessController extends SqlAbstractController {
    constructor(dataFactory, $routeParams) {
        super(dataFactory)
        console.log('EMRProcessController')
    }
}
app.controller("EMRProcessController", EMRProcessController)
singlePage['emz'] = {
    templateUrl: 'emz.html',
    controller: 'EMRProcessController',
}

// app.controller("TherapyProcessController", TherapyProcessController)
class TherapyProcessController extends SqlAbstractController {
    constructor(dataFactory, $routeParams) {
        super(dataFactory)
        conf.ctrl = this
        console.log('TherapyProcessController')
    }
}
app.controller("TherapyProcessController", TherapyProcessController)
singlePage['tp'] = {
    templateUrl: 'tp.html',
    controller: 'TherapyProcessController',
}

// app.controller("PatientListController", PatientListController)
class PatientListController extends SqlAbstractController {
    constructor(dataFactory, $routeParams) {
        super(dataFactory)
        conf.sqlKeyName = 'Patient_family_name'
        console.log(conf.sqlKeyName)
        let ctrl = this
        dataFactory.httpGetSql({ sql: readSql2R(conf.sqlKeyName) })
            .then(dataSqlRequest => ctrl.data = dataSqlRequest)
    }
    clickPatient = (r) => {
        conf.patient = r
    }
    // sql_app = sql_app
}
app.controller("PatientListController", PatientListController)
singlePage['pl'] = {
    templateUrl: '/f/tese/01/sql.html',
    controller: 'PatientListController',
}

app.config(RouteProviderConfig)

sql_app.Patient_family_name.sqlHtml = {
    patient_id: '<a data-ng-click="ctrl.clickPatient(r)" href="#!/hy_{{r.patient_id}}"> {{r[k]}} </a>',
}
