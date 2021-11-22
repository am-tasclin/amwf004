'use strict'
app.config(RouteProviderFHIRConfig)
app.factory("dataBeFactory", DataDBexchangeService)
class InitPageController extends AbstractController {
    constructor($route) {
        super()
        // console.log(Object.keys($route.routes)) // NOT DELETE
    }
}
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
        console.log(conf.FHIR.pd)
        dataBeFactory.httpGet({
            sql: replaceSql(sql_app.PlanDefinitionById
                .buildSql(conf.FHIR.pd.sqlName, singlePage.UrlMap()['pd']))
        }).then(dataSqlRequest => {
            conf.FHIR.pd.currEl = dataSqlRequest.list[0]
            angular.forEach(conf.FHIR.pd.sql_app_children, (v, sqlName) => {
                dataBeFactory.httpGet({
                    sql: replaceSql(sql_app.PlanDefinitionById
                        .buildSql(sqlName, singlePage.UrlMap()['pd']))
                }).then(dataSqlRequest => {
                    if (!conf.FHIR.pd.currEl.sql_app_children)
                        conf.FHIR.pd.currEl.sql_app_children = {}
                    conf.FHIR.pd.currEl.sql_app_children[sqlName] = dataSqlRequest.list
                })
            })
        })
    }
}
app.controller("InitPageController", InitPageController)
app.controller("PlanDefinitionController", PlanDefinitionController)
