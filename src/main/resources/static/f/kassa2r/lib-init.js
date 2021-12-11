'use strict';
var app = angular.module("app", ['ngRoute'])
angular.element(() => angular.bootstrap(document, ['app']))

// not for $scope
const sql_app = {}
// for|as $scope
const singlePage = {}/* $route fn */
    , conf = {}/* conf page|app|content */
class AbstractController { singlePage = singlePage; conf = conf; getSql = sqlName => sql_app[sqlName] }

class AmSqlHtml {
    constructor($compile) {
        this.link = (s, e) => {
            let sqlE = sql_app[conf.sqlKeyName]
            if (sqlE.sqlHtml)
                if (sqlE.sqlHtml[s.k] != null) {
                    e.html(sqlE.sqlHtml[s.k])
                    $compile(e.contents())(s)
                }
        }
    }
    restrict = 'A'
}

class RWDataFactory {
    constructor($http, $q) {
        this.$http = $http; this.$q = $q
    }
    urlSql = '/r/url_sql_read_db1'
    sqlRowLimit = 50

    httpPostSql = params => {
        let deferred = this.$q.defer()

        this.$http.post(this.urlSql, params
        ).then(response => deferred.resolve(response.data)
            , response => console.error(response.status)
        )

        return deferred.promise
    }

    httpGetSql = params => {
        let deferred = this.$q.defer()
        if (params.limit) sqlRowLimit = params.limit
        params.sql = params.sql + ' LIMIT ' + this.sqlRowLimit

        this.$http.get(this.urlSql, { params: params }
        ).then(response => deferred.resolve(response.data)
            , response => console.error(response.status)
        )

        return deferred.promise
    }
    // deferred.reject(response.status)
    // https://metanit.com/web/angular/3.3.php

}

console.log(123)
app.factory("dataFactory", RWDataFactory)
console.log(123)
