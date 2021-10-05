'use strict'
app.factory("dataFactory", DataFactory)
conf.pws = {}//Physition Work Station
conf.pws.topMenu = ['Список пацієнтів', 'ЕМЗ-документація', 'Лікувальний процес']
conf.pws.topMenu = {
    pl: 'Пацієнт', tp: 'Лікувальний процес'
    , emz: 'ЕМЗ-документація'
}

// app.controller("InitPageController", InitPageController)
class InitPageController extends AbstractController {
    constructor($scope, $route, $routeParams) {
        super()
    }
}
app.controller("InitPageController", InitPageController)

// app.controller("PatientListController", PatientListController)
class PatientListController extends SqlAbstractController {
    constructor(dataFactory, $routeParams) {
        super(dataFactory)
        conf.ctrl = this
        conf.sqlKeyName = 'HumanName_family_name'
        let sql = sql_app[conf.sqlKeyName].sql
        console.log(123321,sql)
        dataFactory.httpGetSql({ sql: sql })
            .then(dataSqlRequest => conf.ctrl.data = dataSqlRequest)
    }
    sql_app = sql_app
}
app.controller("PatientListController", PatientListController)

singlePage['pl'] = {
    templateUrl: '/f/tese/01/sql.html',
    controller: 'PatientListController',
}
app.config(RouteProviderConfig)
