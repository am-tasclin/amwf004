const singlePage = {}, conf = {}, sql_app = {}

// app.controller("SqlController", SqlController)
class SqlController extends SqlAbstractController {
    constructor(dataFactory, $routeParams) {
        super(dataFactory)
        conf.sqlKeyName = $routeParams.sql
        let sql = this.readSql2R(conf.sqlKeyName)
        if (Object.keys($routeParams).includes('key'))
            sql = 'SELECT * FROM (' + sql + ') x WHERE ' + $routeParams.key + ' = ' + $routeParams.val
        console.log('SqlController \n', Object.keys($routeParams), sql)
        let ctrl = this
        dataFactory.httpGetSql({ sql: sql }).then(dataSqlRequest => ctrl.data = dataSqlRequest)
    }
    sql_app = sql_app
}
conf.sqlAppKeys = () => Object.keys(sql_app)

// app.factory("dataFactory", DataFactory)
class DataFactory {
    constructor($http, $q, $resource) {
        let urlSql = '/r/url_sql_read_db1'
        let dataFactory = {}
        dataFactory.httpGetSql = params => {
            let deferred = $q.defer()
            $http.get(urlSql, { params: params })
                .then(response => deferred.resolve(response.data)
                    , response => {
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
        console.log('RouteProviderConfig', Object.keys(conf.singlePagesUrl))
        angular.forEach(conf.singlePagesUrl, (v, k) => {
            if (!v.controllerAs) v.controllerAs = 'ctrl'
            $routeProvider.when("/" + k, v)
        })
        $routeProvider.otherwise({
            template: "<h1>?</h1><p>Hi API</p>"
        })
    }
}
