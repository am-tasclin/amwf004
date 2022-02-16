'use strict'

sql_app.group.gp_ADN02.add()
sql_app.group.gp_EmrAutoSql01.add()
sql_app.group.gp_PWS.add()
app.config(RouteProviderConfig)
/*
angular.forEach({
    amSqlHtml: AmSqlHtml,
    amEmrLink: AmEmrLink,
}, (v, k) => app.directive(k, v))
*/

conf.pws = {}//Physition Work Station
conf.pws.topMenu = {
    pl: 'Пацієнт',
    hy: 'Історія',
    tp: 'Лікувальний процес',
    emz: 'ЕМЗ-документація'
}

const contentDoc = {}
contentDoc.readEMR = {
    patient: { sql: 'PatientHumanName' },
    episode: { sql: 'PatientEpisodeOfCare' },
    encounter: { sql: 'EncounterEpisodeOfCare' },
    imEncounter: { sql: 'ImmunusationEncounterPatient' },
    mrEncounter: { sql: 'encounter_MedicationRequest_sc_doseQuantityTimingPeriod' },
}

const sqlForOnePatient = 'SELECT * FROM (:sql ) p WHERE :patientIdName = :patient_id'

let timeoutMs = 0
class PWSDataFactory extends DataFactory {
    constructor($http, $q, $timeout, $resource) { super($http, $q) }

    read = (sql2Name, confKey) => this.httpGetSql({
        sql: sqlForOnePatient.replace(':sql ', readSql2R(sql2Name))
            .replace(':patientIdName', sql_app[sql2Name].patientIdName || 'patient_id')
            .replace(':patient_id', singlePage.FirstUrlId() || singlePage.UrlParamKeyValue('pt'))
    }).then(dataSqlRequest => {
        conf[confKey] = dataSqlRequest.list
        addEMap(conf[confKey], confKey)
        angular.forEach(contentDoc.readEMR[confKey].emr
            , v => addEMap(conf[confKey], v))
    })

    readPatient = () => {
        // console.log(conf, conf.patient)
        if (!conf.patient) {
            // console.log(55, singlePage.UrlMap()['hy'], contentDoc.readEMR)
            angular.forEach(contentDoc.readEMR, (v, k) => {
                console.log(57, k, v.sql)
                if ('EncounterEpisodeOfCare' == v.sql) {
                    // console.log(singlePage.FirstUrlId(), sql_app[v.sql].patientIdName, k, v, v.sql, '\n', readSql2R(v.sql))
                }
                this.read(v.sql, k)
            })
        }
    }
}; app.factory("dataFactory", PWSDataFactory)

// app.controller("PlanDefinitionController", PlanDefinitionController)
class PlanDefinitionController extends AbstractController {
    constructor(dataFactory, $timeout) {
        super()
        console.log(dataFactory)
        dataFactory.readPatient()
        console.log('PlanDefinitionController', singlePage.UrlMap(), singlePage.UrlMap()['hy'])
    }
}; angular.forEach(['hy_:pt_id/emr_:emr_id/pd_:pd_id', 'hy_:pt_id/emr_:emr_id/pd_:pd_id/pda_:pda_id']
    , pseudoRestApiPath => singlePage[pseudoRestApiPath] = {
        templateUrl: 'hy.html', controller: 'PlanDefinitionController',
    })

class InitPageController extends AbstractController {
    dataFactory
    constructor($route, dataFactory) {
        super()
        this.dataFactory = dataFactory
        console.log(123)
    }
}

app.controller("InitPageController", InitPageController)
app.controller("PlanDefinitionController", PlanDefinitionController)
