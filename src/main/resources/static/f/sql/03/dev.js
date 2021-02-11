'use strict';
var app = angular.module("app", ['ngRoute', 'ngResource', 'ngSanitize']);
angular.element(() => angular.bootstrap(document, ['app']))
app.factory("dataFactory", DataFactory)

conf.fr = {
    cp: {
        frn: 'CarePlan',
        children: ['mr'],
    },
    mr: {
        frn: 'MedicationRequest',
        children: ['mn'],
        sql_app: 'tableOfFHIR_MedicationRequest_sc',
    },
    mn: {
        frn: 'Medication',
        children: ['se', 'ro', 'qy'],
        sql_app: 'tableOfFHIR_Medication_sc',
        amRsRowHtml: '<span title="mn:{{r.medication_id}}"> {{r.substance_code}}\n\
        <span title="ro:{{r.strength_id}}" data-ng-if="r.strength_id">\n\
            <span title="n_qy:{{r.n_quantity_id}}">\n\
                {{r.n_quantity_value}} {{r.n_quantity_code}}\n\
            </span>\n\
            / \n\
            <span title="d_qy:{{r.n_quantity_id}}">\n\
                {{r.dn_quantity_value}} {{r.dn_quantity_code}}\n\
        </span></span></span>',
    },
    se: {
        frn: 'Substance',
        sql_app: 'tableOfFHIR_Substance_code',
        amRsRowHtml: '<span>{{r.substance_code}}</span>',
    },
    ro: {
        frn: 'Ratio',
        children: ['qy'],
        sql_app: 'tableOfFHIR_Ratio',
    },
    qy: {
        frn: 'Quantity',
        sql_app: 'tableOfFHIR_Quantity',
    },
}

app.directive('amRsRow', ($compile) => {
    return {
        restrict: 'A',
        link: (s, e) => {
            let confEl = conf.fr[singlePage.LastUrlTag()]
            if (confEl.amRsRowHtml) {
                console.log(s, e, singlePage.LastUrl(), confEl.amRsRowHtml.length)
                e.html(confEl.amRsRowHtml)
                $compile(e.contents())(s)
            }
        },
    }
})

// app.controller("ResourceFHIRController", ResourceFHIRController)
class ResourceFHIRController extends AbstractController {
    dataFactory
    constructor($scope, $routeParams, dataFactory) {
        super()
        this.dataFactory = dataFactory
        console.log('--ResourceFHIRController--', singlePage.Url()
            , singlePage.Url().split('/').length - 1
            , singlePage.LastUrl()
            , singlePage.LastUrlTag()
            , singlePage.LastUrlIdName())
        if (conf.fr[singlePage.LastUrlTag()].sql_app) {
            let sql = sql_app[conf.fr[singlePage.LastUrlTag()].sql_app]()
            if (sql.includes(':sql_app')) sql = sql_app.concatSql(sql)
            // console.log(sql)
            //read resource list
            dataFactory.httpGet({ sql: sql })
                .then((dataSqlRequest) => {
                    $scope.dataSqlRequest = dataSqlRequest
                    console.log(2, dataSqlRequest)
                })
        }
        //read url id objects
        angular.forEach(singlePage.Url().split('/'), (v) => {
            if (v) {
                if (v.split('_')[1]) {
                    let tag = v.split('_')[0], id = v.split('_')[1]
                    if (!conf.fr[tag].currEl||conf.fr[tag].currEl[singlePage.LastUrlIdName()]!=singlePage.LastUrlId()) {
                        let sql = sql_app.concatSql(sql_app[conf.fr[tag].sql_app]())
                        sql = 'SELECT * FROM (' + sql + ') x  WHERE ' + singlePage.LastUrlIdName() + ' = ' + singlePage.LastUrlId()
                        console.log(1, conf.fr[tag].sql_app, singlePage.LastUrlIdName(), singlePage.LastUrlId(), 1)
                        dataFactory.httpGet({ sql: sql })
                            .then((dataSqlRequest) => {
                                conf.fr[tag].currEl = dataSqlRequest.list[0]
                                console.log(2, dataSqlRequest, conf.fr[tag].currEl)
                            })
                    }
                }
            }
        })
    }
    keep2back = (r) => {
        let prevUrl = singlePage.Url().replace(singlePage.LastUrl(), '')
        conf.fr[singlePage.LastUrlTag()].currEl = r
        console.log(r, singlePage.LastUrlTag(), conf.fr[singlePage.LastUrlTag()])
        // console.log(r, prevUrl, singlePage.Url().split('/').length)
        if (singlePage.Url().split('/').length > 2) {
            window.location.href = '#!' + prevUrl
        } else {
            let goUrl = prevUrl + singlePage.LastUrlTag() + '_' + r[singlePage.LastUrlIdName()]
            console.log(1, goUrl, r[singlePage.LastUrlIdName()])
            window.location.href = '#!' + goUrl
        }
    }
    clickAmRsRow = (r) => {
        console.log(r)
    }
    rsEdPart = (r, idName)=>{
        console.log(r, idName)
    }
}
app.controller("ResourceFHIRController", ResourceFHIRController)

// app.controller("FirstController", FirstController)
class FirstController extends AbstractController {
    constructor($scope, $route) {
        super()
        console.log(singlePage.Url(), Object.keys($route.routes))
    }
}
app.controller("FirstController", FirstController)

// app.config(RouteProviderConfig)
class RouteProviderConfig {
    constructor($routeProvider) {
        let rpo = {
            templateUrl: 'ResourceFHIR.html',
            controller: 'ResourceFHIRController',
            controllerAs: 'ctrl',
        }
        let kIdREST = (pref, k) => {
            let kElId = k + '_:' + k + '_id'
            // console.log(k, kElId)
            $routeProvider.when("/" + kElId, rpo)
            return kElId
        }
        angular.forEach(conf.fr, (v, k1) => {
            $routeProvider.when("/" + k1, rpo)
            let k1Id = kIdREST('', k1)
            angular.forEach(conf.fr[k1].children, (k2) => {
                let k12 = k1 + '/' + k2
                let k12Id = k1Id + '/' + k2
                //console.log(1, k12, k1Id)
                $routeProvider.when("/" + k12, rpo)
                $routeProvider.when("/" + k12Id, rpo)
                angular.forEach(conf.fr[k2].children, (k3) => {
                    let k123 = k1 + '/' + k2 + '/' + k3
                    // console.log(3, k123)
                    $routeProvider.when("/" + k123, rpo)
                })
            })
        })
    }
}
app.config(RouteProviderConfig)
