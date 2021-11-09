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
    }
}
app.controller("InitPageController", InitPageController)

// app.controller("HistoryProcessController", HistoryProcessController)
class HistoryProcessController extends SqlAbstractController {
    constructor(dataFactory, $routeParams) {
        super(dataFactory)
        // conf.ctrl = this
        console.log('HistoryProcessController')
        if (singlePage.UrlParamKeyValue('pt')) {

            this.read('Patient_family_name', 'patient')
            this.read('EpisodeOfCare_Patient', 'episodes')
            this.read('Encounter_Patient', 'encounters')
            this.read('encounter_MedicationRequest_sc_doseQuantityTimingPeriod', 'mrEncounter')

            // sql2Name = 'Encounter_Patient'
            // sql2 = this.sqlForOnePatient.replace(':sql ', this.readSql2R(sql2Name))
            //	 .replace(':patient_id', singlePage.UrlParamKeyValue('pt'))
            // dataFactory.httpGetSql({ sql: sql2 })
            //	 .then(dataSqlRequest => conf.encounters = dataSqlRequest.list)

        }
    }
    f1 = (sql2Name) => this.sqlForOnePatient.replace(':sql ', readSql2R(sql2Name))
        .replace(':patient_id', singlePage.UrlParamKeyValue('pt'))
    read = (sql2Name, confKey) =>
        this.dataFactory.httpGetSql(
            {
                sql: this.sqlForOnePatient.replace(':sql ', readSql2R(sql2Name))
                    .replace(':patient_id', singlePage.UrlParamKeyValue('pt'))
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
singlePage['hy'] = {
    templateUrl: 'hy.html',
    controller: 'HistoryProcessController',
}

// app.controller("EMRProcessController", EMRProcessController)
class EMRProcessController extends SqlAbstractController {
    constructor(dataFactory, $routeParams) {
        super(dataFactory)
        conf.ctrl = this
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
        conf.ctrl = this
        conf.sqlKeyName = 'Patient_family_name'
        let sql = this.readSql2R(conf.sqlKeyName)
        console.log(123321, sql)
        dataFactory.httpGetSql({ sql: sql })
            .then(dataSqlRequest => conf.ctrl.data = dataSqlRequest)
        console.log(123)
    }
    clickPatient = (r) => {
        conf.patient = r
        console.log(123, conf.patient)
    }

    sql_app = sql_app
}
app.controller("PatientListController", PatientListController)
singlePage['pl'] = {
    templateUrl: '/f/tese/01/sql.html',
    controller: 'PatientListController',
}

app.config(RouteProviderConfig)
