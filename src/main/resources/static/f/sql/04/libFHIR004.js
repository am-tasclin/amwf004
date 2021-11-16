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
        let sql = 'SELECT * FROM (' + sqlOt.sql + ') x  WHERE ' + conf.FHIR_app.TagIdName(tag) + ' = ' + tag_id
        // console.log(123, singlePage.Url(), conf.FHIR.pd.sqlName, sql)
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
class RouteProviderConfig {
    constructor($routeProvider) {
        console.log('RouteProviderConfig')
        let rpo = key => {
            let rpo = {
                templateUrl: 'ResourceFHIR.html',
                controllerAs: 'ctrl',
            }
            rpo.controller = 'InitFHIResourceController'
            if (conf.FHIR[key].controller)
                rpo.controller = conf.FHIR[key].controller
            return rpo
        }
        let kIdREST = (pref, k) => {
            let kElId = k + '_:' + k + '_id'
            // console.log(k, kElId)
            $routeProvider.when(pref + "/" + kElId, rpo(k))
            return kElId
        }
        angular.forEach(conf.FHIR, (v, k1) => {
            // console.log(k1)
            $routeProvider.when('/' + k1, rpo(k1))
            let k1Id = kIdREST('', k1)
            angular.forEach(conf.FHIR[k1].children, (k2) => {
                $routeProvider.when('/' + k1 + '/' + k2, rpo(k2))
                $routeProvider.when('/' + k1Id + '/' + k2, rpo(k2))
                let k12Id = kIdREST('/' + k1Id, k2)
                angular.forEach(conf.FHIR[k2].children, (k3) => {
                    $routeProvider.when("/" + k1 + '/' + k2 + '/' + k3, rpo(k3))
                    $routeProvider.when('/' + k1Id + '/' + k12Id + '/' + k3, rpo(k3))
                    let k123Id = kIdREST('/' + k1Id + '/' + k12Id, k3)
                })
            })
        })
    }
}


