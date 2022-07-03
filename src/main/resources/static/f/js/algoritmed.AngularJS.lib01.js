/**
 * @license Algoritmed.AngularJS v0.1.021
 * (c) 2021-2022 Algoritmed Ltd. http://algoritmed.com
 * License: Apache-2.0 license 
 */
'use strict'

const ar = angular
const session = {}, conf = {}, singlePage = {}, sql_app = {}
conf.eMap = {}
var app = angular.module("app", ['ngRoute', 'ngResource', 'ngSanitize'])
angular.element(() => angular.bootstrap(document, ['app']))

class AbstractController { constructor(dataFactory) { this.dataFactory = dataFactory } }

class PageLogic0Factory {
    constructor(dataFactory) { this.dataFactory = dataFactory }
    getSqlApp = name => sql_app[name]
    conf = conf; session = session
}

class RWData0Factory {
    constructor($http, $q) { this.$http = $http; this.$q = $q }
    urlSql = '/r/url_sql_read_db1'
    sqlRowLimit = 50

    httpPostSql = params => {
        let deferred = this.$q.defer()
        this.$http.post(this.urlSql, params)
            .then(response => deferred.resolve(response.data)
                , response => console.error(response.status))
        return deferred.promise
    }

    httpGetSql = params => {
        let deferred = this.$q.defer()
        if (params.sql) {
            if (params.limit) sqlRowLimit = params.limit
            params.sql = params.sql + ' LIMIT ' + this.sqlRowLimit
            this.$http.get(this.urlSql, { params: params })
                .then(response => deferred.resolve(response.data)
                    , response => console.error(response.status))
        } else deferred.resolve({ hello: 'Hello World! no SQL' })
        return deferred.promise
    }
    // deferred.reject(response.status)
    // https://metanit.com/web/angular/3.3.php

    readSql = (sql, fn) => this.httpGetSql({ sql: sql }).then(fn)
    writeSql = (sql, fn) => this.httpPostSql({ sql: sql }).then(fn)
}//; app.factory('dataFactory', RWDataFactory)


let urlMap = {}
singlePage.Url = () => window.location.href.split('#!')[1]
singlePage.UrlMap = () => {
    if (Object.keys(urlMap).length === 0) singlePage.Url().split('/').forEach(v => {
        if (v) urlMap[v.split('_')[0]] = v.replace(v.split('_')[0] + '_', '')
    })
    return urlMap
}

const route01Controller = (controllerClass, pseudoRestList, templateUrl) => {
    const controllerName = controllerClass.toString().split(' ')[1]
    app.controller(controllerName, controllerClass)
    ar.forEach(pseudoRestList, pseidoRest => singlePage[pseidoRest] = {
        controller: controllerName, templateUrl: (templateUrl || singlePage.index_template), })
}
class RouteProviderConfig {
    constructor($routeProvider) {
        console.log('RouteProviderConfig', Object.keys(singlePage))
        angular.forEach(singlePage, (v, k) => (
            v.controller && $routeProvider.when("/" + k, v)))
        if (singlePage.index_template)
            $routeProvider.otherwise({ templateUrl: singlePage.index_template })
        else
            $routeProvider.otherwise({ template: "<h1>?</h1><p>Hey You, API</p>" })
    }
}; app.config(RouteProviderConfig)
