'use strict'
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

class PWSDataFactory extends DataFactory {
    constructor($http, $q, $timeout, $resource) {
        super($http, $q)
    }
    readPatient = () => {
        console.log(conf, conf.patient)
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
