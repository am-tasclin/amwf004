const singlePage = {}, conf = {}, sql_app = {}

// app.controller("SqlController", SqlController)
class SqlController extends SqlAbstractController {
    sql_app = sql_app
    constructor(dataFactory, $routeParams) {
        super(dataFactory)
        conf.sqlKeyName = $routeParams.sql
        let sql = this.readSql2R(conf.sqlKeyName)
        console.log(2, 'SqlController', $routeParams, sql)
        let ctrl = this
        dataFactory.httpGetSql({ sql: sql })
            .then(dataSqlRequest => {
                console.log(13, dataSqlRequest)
                ctrl.data = dataSqlRequest
            })
    }

    
}
conf.sqlAppKeys = () => Object.keys(sql_app)

// app.factory("dataFactory", DataFactory)
class DataFactory {
    constructor($http, $q, $resource) {
        console.log(1, 'DataFactory')
        let urlSql = '/r/url_sql_read_db1'
        let dataFactory = {}
        dataFactory.httpGetSql = params => {
            let deferred = $q.defer()
            $http.get(urlSql, { params: params })
                .then(response => {
                    deferred.resolve(response.data)
                }, response => {
                    console.log(response.status)
                    // deferred.reject(response.status)
                    // https://metanit.com/web/angular/3.3.php
                })
            return deferred.promise
        }
        return dataFactory
    }
}

// app.config(RouteProviderConfig)
class RouteProviderConfig {
    constructor($routeProvider) {
        console.log(3, 'RouteProviderConfig')
        angular.forEach(conf.singlePagesUrl, (v, k) => {
            if (!v.controllerAs) v.controllerAs = 'ctrl'
            console.log(k, v)
            $routeProvider.when("/" + k, v)
        })
        $routeProvider.otherwise({
            template: "<h1>?</h1><p>Hi API</p>"
        })
    }
}
