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

conf.singlePagesUrl = {}
conf.singlePagesUrl['sql/:sql'] = {
    templateUrl: 'sql.html',
    controller: 'SqlController',
}

conf.singlePagesUrl['sql/:sql/:key/:val'] = {
    templateUrl: 'sql.html',
    controller: 'SqlController',
}

if (conf.singlePagesUrl) app.config(RouteProviderConfig)