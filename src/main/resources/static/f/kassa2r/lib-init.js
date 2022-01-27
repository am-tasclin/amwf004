'use strict';
var app = angular.module("app", ['ngRoute', 'ngResource', 'ngSanitize'])
angular.element(() => angular.bootstrap(document, ['app']))

// not for $scope
const sql_app = {}
// for|as $scope
const singlePage = {}/* $route fn */
    , conf = { eMap: {}, parentChild: {}, }/* conf page|app|content */
class AbstractController {
    singlePage = singlePage; conf = conf;
    getSql = sqlName => sql_app[sqlName]
    getConf = confName => conf[confName]
}

const add_eMap = v => conf.eMap[v.doc_id] = v
const getSetList = (o, n) => o[n] ? o[n] : o[n] = []
const getSetParentChild = v => getSetList(conf.parentChild, v.parent)
// const getSetParentChild = v => conf.parentChild[v.parent] ?
//     conf.parentChild[v.parent] : conf.parentChild[v.parent] = []
const addParentChild = v => !getSetParentChild(v).includes(v.doc_id) ?
    getSetParentChild(v).push(v.doc_id) : null

conf.modalDisplay = { display: null }

// Get sql from our name
const readSql2R = sqlN => replaceSql(sql_app[sqlN].sql)
// Named structured SQL to native SQL
const replaceSql = sql => {
    while (sql.includes(':sql_app.')) {
        let sql_name = sql.split(':sql_app.')[1].split(' ')[0]
        let sql_inner = readSql2R(sql_name)
        sql = sql.replace(':sql_app.' + sql_name, sql_inner)
    }
    return '' + sql
}

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

app.factory("dataFactory", RWDataFactory)
