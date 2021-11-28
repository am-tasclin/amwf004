'use strict'
app.config(RouteProviderFHIRConfig)
class PlDefDataFactory extends DataDBexchangeService {
    constructor($http, $q, $resource) { super($http, $q, $resource) }
    readPlanDefinition = () => {
        console.log(conf.FHIR.pd, singlePage.UrlMap()['pd'])
        let makeSql = sqlName => replaceSql(
            sql_app.PlanDefinitionById.buildSql(sqlName, singlePage.UrlMap()['pd']))
        this.httpGet({ sql: makeSql(conf.FHIR.pd.sqlName) }).then(dataSqlRequest => {
            conf.FHIR.pd.currEl = dataSqlRequest.list[0]
            angular.forEach(conf.FHIR.pd.sql_app_children, (v, sqlName) => {
                this.httpGet({ sql: makeSql(sqlName) }).then(dataSqlRequest => {
                    if (!conf.FHIR.pd.currEl.sql_app_children)
                        conf.FHIR.pd.currEl.sql_app_children = {}
                    conf.FHIR.pd.currEl.sql_app_children[sqlName] = dataSqlRequest.list
                })
            })
        })
    }
    readActivityDefinition = () => {
        console.log(conf.FHIR.ad, singlePage.UrlMap()['ad'])
    }
}
app.factory("dataBeFactory", PlDefDataFactory)

sql_app.PlanDefinitionById = {
    name: 'План/сценарій по Id',
    sql: 'SELECT * FROM (:sql_app.sql_x ) x \n\
    WHERE pd_id=:pd_id',
    buildSql: (sqlName, pd_id) => sql_app
        .PlanDefinitionById.sql.replace(':pd_id', pd_id)
        .replace(':sql_app.sql_x', ':sql_app.' + sqlName)
    ,
}
class PlanDefinitionController extends AbstractController {
    constructor(dataBeFactory) {
        super()
        if (singlePage.UrlMap()['pd']) dataBeFactory.readPlanDefinition()
    }
}
class ActivityDefinitionController extends AbstractController {
    constructor(dataBeFactory) {
        super()
        console.log(123)
        if (singlePage.UrlMap()['pd']) dataBeFactory.readPlanDefinition()
        if (singlePage.UrlMap()['ad']) dataBeFactory.readActivityDefinition()
    }
}
class InitPageController extends AbstractController {
    constructor($route) {
        super()
        // console.log(Object.keys($route.routes)) // NOT DELETE
    }
}

app.controller("PlanDefinitionController", PlanDefinitionController)
app.controller("ActivityDefinitionController", ActivityDefinitionController)
app.controller("InitPageController", InitPageController)
