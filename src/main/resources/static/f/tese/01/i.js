'use strict'
var app = angular.module("app", ['ngRoute', 'ngResource', 'ngSanitize'])
angular.element(() => angular.bootstrap(document, ['app']))
console.log(1, 'Start app')
app.factory("dataFactory", DataFactory)
app.controller("SqlController", SqlController)

class InitPageController extends AbstractController {
    constructor($scope, $route, $routeParams) {
        super()
        console.log(2, 'InitPageController', $routeParams)
        this.sqlKeyName = $routeParams.sql
    }
}
// app.controller("InitPageController", InitPageController)
app.controller("InitPageController", InitPageController)

conf.singlePagesUrl = {}
conf.singlePagesUrl['sql/:sql'] = {
    templateUrl: 'sql.html',
    controller: 'SqlController',
}

if (conf.singlePagesUrl) app.config(RouteProviderConfig)