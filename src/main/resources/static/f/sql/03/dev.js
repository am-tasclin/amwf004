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
        amRsRowHtml: '<span title="mn:{{r.medication_id}}">\n\
        {{r.substance_code}}\n\
        <span title="ro:{{r.strength_id}}" data-ng-if="r.strength_id">\n\
            <span title="n_qy:{{r.n_quantity_id}}">\n\
                {{r.n_quantity_value}}\n\
                {{r.n_quantity_code}}\n\
            </span>\n\
            /\n\
            <span title="d_qy:{{r.n_quantity_id}}">\n\
                {{r.dn_quantity_value}}\n\
                {{r.dn_quantity_code}}\n\
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
            let confEl = conf.fr[singlePageLastUrl()]
            if (confEl.amRsRowHtml) {
                console.log(s, e, singlePageLastUrl(), confEl.amRsRowHtml.length)
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
        console.log(singlePageUrl(), singlePageUrl().split('/').length - 1, singlePageLastUrl())
        if (conf.fr[singlePageLastUrl()].sql_app) {
            let sql = sql_app[conf.fr[singlePageLastUrl()].sql_app]()
            if (sql.includes(':sql_app')) sql = sql_app.concatSql(sql)
            // console.log(sql)
            dataFactory.httpGet({ sql: sql })
                .then((dataSqlRequest) => {
                    $scope.dataSqlRequest = dataSqlRequest
                    console.log(2, dataSqlRequest)
                })
        }
    }
    keep2back = (r) => {
        let prevUrl = singlePageUrl().replace(singlePageLastUrl(),'')
        console.log(r, prevUrl, singlePageUrl().split('/').length)
        if(singlePageUrl().split('/').length>2){
            window.location.href = '#!'+prevUrl
        }else{
            let confEl = conf.fr[singlePageLastUrl()]
            let goUrl = prevUrl+singlePageLastUrl()+'_'+r[confEl.frn.toLowerCase()+'_id']
            console.log(1, goUrl, confEl, r[confEl.frn.toLowerCase()+'_id'])
            window.location.href = '#!'+goUrl
        }
    }
    clickAmRsRow = (r) => {
        console.log(r)
    }
}
app.controller("ResourceFHIRController", ResourceFHIRController)

// app.config(RouteProviderConfig)
class RouteProviderConfig {
    constructor($routeProvider) {
        let rpo = {
            templateUrl: 'ResourceFHIR.html',
            controller: 'ResourceFHIRController',
            controllerAs: 'ctrl',
        }
        let kIdREST = (k) => {
            let kElId = k + '_:' + k + '_id'
            console.log(k, kElId)
            $routeProvider.when("/" + kElId, rpo)
        }
        angular.forEach(conf.fr, (v, k) => {
            $routeProvider.when("/" + k, rpo)
            angular.forEach(conf.fr[k].children, (k2) => {
                let k12 = k + '/' + k2
                // console.log(2, k12)
                $routeProvider.when("/" + k12, rpo)
                angular.forEach(conf.fr[k2].children, (k3) => {
                    let k123 = k + '/' + k2 + '/' + k3
                    console.log(3, k123)
                    $routeProvider.when("/" + k123, rpo)
                })
            })
            if (k == 'mn'||k == 'mr') {
                kIdREST(k)
            }
        })
    }
}
app.config(RouteProviderConfig)

// app.controller("FirstController", FirstController)
class FirstController extends AbstractController {
    constructor($scope, $route) {
        super()
        console.log(1, $route.routes, this.singlePageUrl())
        $scope.conf = conf
    }
}
app.controller("FirstController", FirstController)
