'use strict'
// app.controller("InitFHIResourceController", InitFHIResourceController)
class InitFHIResourceController extends AbstractController {
    dataBeFactory; editFRFactory
    constructor($scope, $routeParams, dataBeFactory, editFRFactory) {
        super()
        this.dataBeFactory = dataBeFactory
        this.editFRFactory = editFRFactory
        // console.log(singlePage.Url())
    }
    readPlanDefinition = () => {
        let tag = 'pd', tag_id = 1 * singlePage.PseudoRESTKey('pd_')[0].split('_')[1]
        console.log(tag, tag_id)
        let sqlOt = sql_app[conf.FHIR.pd.sqlName]

        console.log(conf.FHIR.pd, conf.FHIR.pd.sqlName)
        let sql = 'SELECT * FROM (' + sqlOt.sql
            + ') x  WHERE ' + sql_app.FHIR.TagIdName(tag) + ' = ' + tag_id
        console.log(sql)
        console.log(123, singlePage.Url(), conf.FHIR.pd.sqlName)
        this.dataBeFactory.httpGet({ sql: sql }).then(dataSqlRequest => {
            // console.log(dataSqlRequest, 1)
            conf.FHIR[tag].currEl = dataSqlRequest.list[0]
            console.log(conf.FHIR[tag].currEl, tag, 1)
            // conf.buildDocJson()
            angular.forEach(conf.FHIR.pd.sql_app_children, (vSql, k) => {
                let sql = replaceSql(vSql.sql).replace(':pd_id', tag_id)
                // console.log(sql)
                conf.FHIR[tag].currEl.sql_app_children = {}
                this.dataBeFactory.httpGet({ sql: sql }).then(dataSqlRequest => {
                    console.log(dataSqlRequest, 1)
                    conf.FHIR[tag].currEl.sql_app_children[k] = dataSqlRequest.list
                })
            })
        })
    }
}

//app.factory("editFRFactory", EditFHIResourceFactory)
class EditFHIResourceService {
    dataBeFactory
    constructor(dataBeFactory) {
        this.dataBeFactory = dataBeFactory
    }
}

//app.config(RouteProviderConfig)
//app.config(RouteProviderFHIRConfig) // new Name

