'use strict'
var app = angular.module("app", ['ngRoute', 'ngResource', 'ngSanitize'])
angular.element(() => angular.bootstrap(document, ['app']))
app.factory("dataFactory", DataFactory)
app.controller("SqlController", SqlController)

class InitPageController extends AbstractController {
    constructor($scope, $route, $routeParams) {
        super()
        this.sqlKeyName = $routeParams.sql
    }
}
// app.controller("InitPageController", InitPageController)
app.controller("InitPageController", InitPageController)

app.directive('amSqlHtml', $compile => {
    return {
        restrict: 'A',
        link: (s, e) => {
            let sqlE = sql_app[conf.sqlKeyName]
            if (sqlE.sqlHtml) {
                if (sqlE.sqlHtml[s.k] != null) {
                    e.html(sqlE.sqlHtml[s.k])
                    $compile(e.contents())(s)
                }
            }
        },
    }
})

conf.singlePagesUrl = {}
angular.forEach(['sql/:sql', 'sql/:sql/:key/=/:val'], v => {
    conf.singlePagesUrl[v] = {
        templateUrl: 'sql.html',
        controller: 'SqlController',
    }
})

if (conf.singlePagesUrl) app.config(RouteProviderConfig)