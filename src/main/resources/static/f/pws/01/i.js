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
        conf.ctrl = this
        console.log('HistoryProcessController')
        conf.sqlKeyName = 'EpisodeOfCare_Patient'
        let sql = this.readSql2R(conf.sqlKeyName)
        console.log(123321, sql)
        dataFactory.httpGetSql({ sql: sql })
            .then(dataSqlRequest => {
                conf.episode = dataSqlRequest
            })
        if (singlePage.UrlParamKeyValue('pt')) {
            console.log('зчитати пацієнта', singlePage.UrlParamKeyValue('pt'))
        }
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
