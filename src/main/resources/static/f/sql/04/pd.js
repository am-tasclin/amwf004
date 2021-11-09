'use strict'
app.factory("dataBeFactory", DataDBexchangeService)
app.factory("editFRFactory", EditFHIResourceService)
app.config(RouteProviderConfig)
app.controller("InitFHIResourceController", InitFHIResourceController)
app.directive('amSqlHtml', AmSqlHtml)

// app.controller("PlanDefinitionController", PlanDefinitionController)
class PlanDefinitionController extends InitFHIResourceController {
    constructor($scope, $routeParams, dataBeFactory, editFRFactory) {
        super($scope, $routeParams, dataBeFactory, editFRFactory)
        if (singlePage.PseudoRESTKey('pd_').length) {
            let tag = 'pd', tag_id = 1 * singlePage.PseudoRESTKey('pd_')[0].split('_')[1]
            console.log(tag, tag_id)
            let sqlOt = sql_app[conf.FHIR.pd.sqlName]
            let sql = 'SELECT * FROM (' + sqlOt.sql + ') x  WHERE ' + conf.FHIR_app.TagIdName(tag) + ' = ' + tag_id
            // console.log(123, singlePage.Url(), conf.FHIR.pd.sqlName, sql)
            dataBeFactory.httpGet({ sql: sql }).then(dataSqlRequest => {
                // console.log(dataSqlRequest, 1)
                conf.FHIR[tag].currEl = dataSqlRequest.list[0]
                console.log(conf.FHIR[tag].currEl, tag, 1)
                // conf.buildDocJson()
                angular.forEach(conf.FHIR.pd.sql_app_children, (vSql, k) => {
                    let sql = replaceSql(vSql).replace(':pd_id', tag_id)
                    console.log(sql)
                    conf.FHIR[tag].currEl.sql_app_children = {}
                    dataBeFactory.httpGet({ sql: sql }).then(dataSqlRequest => {
                        console.log(dataSqlRequest, 1)
                        conf.FHIR[tag].currEl.sql_app_children[k] = dataSqlRequest.list
                    })
                })
            })
        }
    }
    clickActionTitle = (at) => {
        console.log(at)
    }
}
app.controller("PlanDefinitionController", PlanDefinitionController)

// app.controller("InitPageController", InitPageController)
class InitPageController extends AbstractController {
    constructor($scope, $route, $routeParams) {
        super()
        // console.log(singlePage.Url(), Object.keys($route.routes))
    }
}
app.controller("InitPageController", InitPageController)
