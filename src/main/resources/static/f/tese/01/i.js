'use strict'
app.factory("dataFactory", DataFactory)
app.controller("SqlController", SqlController)
app.directive('amSqlHtml', AmSqlHtml)

// app.controller("InitPageController", InitPageController)
class InitPageController extends AbstractController {
    constructor($scope, $route, $routeParams) {
        super()
        this.sqlKeyName = $routeParams.sql
    }
    keyDownEsc = () => { if (conf.modalDisplay.display == 'block') conf.modalDisplay.display = null }
}
app.controller("InitPageController", InitPageController)

angular.forEach(['sql/:sql', 'sql/:sql/:key/=/:val'], v => {
    singlePage[v] = {
        templateUrl: 'sql.html',
        controller: 'SqlController',
    }
})
app.config(RouteProviderConfig)
