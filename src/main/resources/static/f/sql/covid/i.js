'use strict'
var app = angular.module("app", ['ngRoute', 'ngResource', 'ngSanitize'])
angular.element(() => angular.bootstrap(document, ['app']))
app.factory("dataFactory", DataFactory)


conf.singlePagesUrl = {
    sql: {
        templateUrl: '/f/sql/01/sql1.html',
        controller: 'SqlController',
        controllerAs: 'ctrl',
    },
    'sql/:sql': {
        templateUrl: '/f/sql/01/sql1.html',
        controller: 'SqlController',
        controllerAs: 'ctrl',
    },
}
console.log(321)

// app.controller("SqlController", SqlController)
class SqlController extends SqlAbstractController {
    constructor(dataFactory, $routeParams) {
        super(dataFactory)
        console.log(2345)
        this.simpleSQLs = sql_app.simpleSQLs
        if ($routeParams.sql)
            d.conf.simpleSQLselect = sql_app.simpleSQLselect = $routeParams.sql
        if (!sql_app.simpleSQLselect) {
            // sql_app.simpleSQLselect = 'SQL_from_DB'
            d.conf.simpleSQLselect = sql_app.simpleSQLselect = 'WikiList'
        }
        this.choisedListItem = 0
        if (!this.data) this.readSql(sql_app.simpleSQLselect)
        this.tut = 'tutorial links'
        this.sqlAppToLink = conf.sqlAppToLink
    }
    getSelectSql = () => {
        return sql_app.simpleSQLs[sql_app.simpleSQLselect].c
    }
}
app.controller("SqlController", SqlController)

// app.controller("FirstController", FirstController)
class FirstController extends AmDocAbstractController {
    constructor($scope) {
        super($scope)
        this.singlePage = singlePage
    }
}
app.controller("FirstController", FirstController)


// app.config(RouteProviderConfig)
class RouteProviderConfig {
    constructor($routeProvider) {
        angular.forEach(conf.singlePagesUrl, (v, k) => {
            console.log(k, v)
            $routeProvider.when("/" + k, v)
        })
        $routeProvider.otherwise({
            redirectTo: '/wikiList'
        })
    }
}
app.config(RouteProviderConfig)
