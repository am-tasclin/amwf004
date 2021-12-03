'use strict'
app.config(RouteProviderConfig)
angular.forEach({
    amSqlHtml: AmSqlHtml,
    amEmrLink: AmEmrLink,
}, (v, k) => app.directive(k, v))

conf.pws = {}//Physition Work Station
conf.pws.topMenu = {
    pl: 'Пацієнт',
    hy: 'Історія',
    tp: 'Лікувальний процес',
    emz: 'ЕМЗ-документація'
}

const contentDoc = {}
contentDoc.readEMR = {
    patient: { sql: 'Patient_family_name' },
    episode: { sql: 'EpisodeOfCare_Patient' },
    encounter: {
        sql: 'Encounter_Patient',
        emr: ['reason', 'dgcondition'],
    },
    mrEncounter: { sql: 'encounter_MedicationRequest_sc_doseQuantityTimingPeriod' },
}
contentDoc.readPlanDefinitionElements = {
    pd_action: { sql: 'PlanDefinition_action_title' },
    pd_action_ad: { sql: 'pd_action_ActivityDefinition_title_name' },
}
sql_app.actuelEMR_PD_Trigger_DataRequirement_type_path = {
    name: 'ЕМЗ елемент > Сценарії-плани > tригери > необхідні дані тип шлях',
    sql: 'SELECT * FROM (:sql_app.PD_Trigger_DataRequirement_type_path ) x \n\
    WHERE dr_type_def_id=:x AND codefilter_path_def_id=:y',
}

const sqlForOnePatient = 'SELECT * FROM (:sql ) p WHERE patient_id = :patient_id'
let timeoutMs = 0
class PWSDataFactory extends DataFactory {
    $timeout
    constructor($http, $q, $timeout) { super($http, $q); this.$timeout = $timeout }
    read = (sql2Name, confKey) => this.httpGetSql({
        sql: sqlForOnePatient.replace(':sql ', readSql2R(sql2Name))
            .replace(':patient_id', singlePage.FirstUrlId() || singlePage.UrlParamKeyValue('pt'))
    }).then(dataSqlRequest => {
        conf[confKey] = dataSqlRequest.list
        addEMap(conf[confKey], confKey)
        angular.forEach(contentDoc.readEMR[confKey].emr
            , v => addEMap(conf[confKey], v))
    })
    readPatient = () => {
        if (!conf.patient) {
            console.log(singlePage.UrlMap()['hy'], 111)
            angular.forEach(contentDoc.readEMR, (v, k) => this.read(v.sql, k))
            timeoutMs = 200
        } else if (conf.patient[0].patient_id == singlePage.UrlMap()['hy']) {
            timeoutMs = 0
            console.log(timeoutMs, conf.patient[0].patient_id == singlePage.UrlMap()['hy'])
        }
    }
    runPlanDefinition = (pd) => {
        console.log(pd)
    }
    runTrigger = () => {
        this.$timeout(() => {
            let emrEl = conf.eMap[singlePage.UrlMap()['emr']]
            console.log(emrEl, timeoutMs)
            if (emrEl && emrEl.el_def_id && emrEl.el_att_def_id) {//triggered by FHIR.path
                let sql = readSql2R('actuelEMR_PD_Trigger_DataRequirement_type_path')
                    .replace(':x', emrEl.el_def_id).replace(':y', emrEl.el_att_def_id)
                // console.log(sql)
                this.httpGetSql({ sql: sql })
                    .then(dataSqlRequest => {
                        conf['plandefinition'] = dataSqlRequest.list
                        // angular.forEach(dataSqlRequest.list, pd => this.runPlanDefinition(pd))
                    })
            } else {
                delete conf['plandefinition']
            }
        }, timeoutMs)
    }
}
angular.forEach(['hy_:pt_id/emr_:emr_id/pd_:pd_id', 'hy_:pt_id/emr_:emr_id/pd_:pd_id/pda_:pda_id']
    , element => {
        singlePage[element] = {
            templateUrl: 'hy.html',
            controller: 'PlanDefinitionController',
        }
    })
angular.forEach(['hy', 'hy_:pt_id', 'hy_:pt_id/emr_:emr_id'], element => {
    singlePage[element] = {
        templateUrl: 'hy.html',
        controller: 'HistoryProcessController',
    }
})
singlePage['tp'] = {
    templateUrl: 'tp.html',
    controller: 'TherapyProcessController',
}
singlePage['pl'] = {
    templateUrl: '/f/tese/01/sql.html',
    controller: 'PatientListController',
}
// app.controller("PlanDefinitionController", PlanDefinitionController)
class PlanDefinitionController extends AbstractController {
    constructor(dataFactory, $timeout) {
        super()
        console.log(singlePage.UrlMap(), singlePage.UrlMap()['hy'])
        dataFactory.readPatient()
        dataFactory.runTrigger()
        console.log(singlePage.UrlMap()['pd'])
        angular.forEach(contentDoc.readPlanDefinitionElements,
            (v, k) => {
                console.log(1, k, 1, v.sql)
                console.log(readSql2R(v.sql))
                dataFactory.httpGetSql({ sql: readSql2R(v.sql) })
                    .then(dataSqlRequest => conf[k] = dataSqlRequest.list)
            })
    }
}
class HistoryProcessController extends AbstractController {
    constructor(dataFactory) {
        super()
        console.log('HistoryProcessController', singlePage.FirstUrlId() || singlePage.UrlParamKeyValue('pt'))
        dataFactory.readPatient()
        dataFactory.runTrigger()
    }
    clickedId = (id) => conf.clickedId = id
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
class TherapyProcessController extends AbstractController {
    constructor(dataFactory) {
        super()
        console.log('TherapyProcessController')
    }
}
class PatientListController extends AbstractController {
    constructor(dataFactory) {
        super()
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
sql_app.Patient_family_name.sqlHtml = {
    patient_id: '<a data-ng-click="ctrl.clickPatient(r)" href="#!/hy_{{r.patient_id}}"> {{r[k]}} </a>',
}
class InitPageController extends AbstractController {
    constructor($route) {
        super()
        // console.log(Object.keys($route.routes)) // NOT DELETE
    }
}

app.factory("dataFactory", PWSDataFactory)
app.controller("InitPageController", InitPageController)
app.controller("PlanDefinitionController", PlanDefinitionController)
app.controller("HistoryProcessController", HistoryProcessController)
app.controller("TherapyProcessController", TherapyProcessController)
app.controller("PatientListController", PatientListController)
