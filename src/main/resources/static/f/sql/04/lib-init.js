'use strict';
var app = angular.module("app", ['ngRoute', 'ngResource', 'ngSanitize'])
//app - angylar module to root Element <HTML>
angular.element(() => angular.bootstrap(document, ['app']))
// not for $scope
const sql_app = {}
// for|as $scope
const singlePage = {}/* $route fn */
    , conf = {}/* conf page|app|content */
class AbstractController {
    singlePage = singlePage; conf = conf;
    getSql = sqlName => sql_app[sqlName]
}
// Element_id to element map.
conf.eMap = {}

//MeTaL Medical, Math and Model Task Language
const metal = {}
metal.init = (metalInit) => {
    // console.log(metalInit)
    let txt = metalInit.replace(/\n|\r/g, "")
    let sqlCmdMapVar = JSON.parse(txt)
    sqlCmdMapVar.init = eval('(' + sqlCmdMapVar.init + ')')
    // console.log('sqlCmdMap2 from DB = ', sqlCmdMapVar,)
    return sqlCmdMapVar
}

// FHIR element name to FHIR element_id
// const name2id = n => n.toLowerCase() + '_id'
// Add element to element_id to element map.
// const addEMap = (l, n) => l.forEach(e => conf.eMap[e[name2id(n)]] = e)
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

singlePage.Url = () => window.location.href.split('#!')[1]
singlePage.PseudoREST = singlePage.Url
singlePage.UrlList = () => singlePage.Url().split('/')
singlePage.PseudoRESTKey = key => singlePage.UrlList().filter(w => w.includes(key))
singlePage.UrlMap = () => {
    const m = {}
    singlePage.UrlList().forEach(v => { if (v) m[v.split('_')[0]] = v.split('_')[1] })
    return m
}

singlePage.FirstUrl = () => singlePage.Url() ? singlePage.Url().split('/')[1] : ''
singlePage.FirstUrlTag = () => singlePage.FirstUrl().split('_')[0]
singlePage.FirstUrlId = () => singlePage.FirstUrl().split('_')[1]

singlePage.LastUrl = () => singlePage.Url() ? singlePage.Url().split('/')[singlePage.Url().split('/').length - 1] : ''
singlePage.LastUrlTag = () => singlePage.LastUrl().split('_')[0]
singlePage.LastUrlId = () => singlePage.LastUrl().split('_')[1]

singlePage.X_Url = (nr) => nr ? singlePage.UrlList()[nr] : ''
singlePage.X_UrlTag = (nr) => singlePage.UrlList()[nr].split('_')[0]
singlePage.X_UrlId = (nr) => nr && singlePage.UrlList().length > nr ? singlePage.UrlList()[nr].split('_')[1] : null//0

singlePage.TagPosition = (tag) => singlePage.Url().includes(tag) ? singlePage.Url().split('/' + tag)[0].split('/').length : null

singlePage.ClickTagHref = (tag, id) => {
    let newUrl = '', tagId = tag + (id ? ('_' + id) : '')
    // console.log(tag, singlePage.Url().includes(tag), singlePage.UrlList(), tagId)
    if (singlePage.Url().includes(tag))
        for (let i = 1; i < singlePage.TagPosition(tag); i++) newUrl += '/' + singlePage.X_Url(i)
    else angular.forEach(singlePage.UrlList(), (t, i) => {
        if (t && !newUrl.includes(tag))
            if (conf.FHIR[singlePage.X_UrlTag(i)].children)
                newUrl += '/' + t +
                    (conf.FHIR[singlePage.X_UrlTag(i)].children.includes(tag) ? '/' + tagId : '')
    })
    return newUrl
}

// app.factory("dataDBexchangeService", DataDBexchangeService)
class DataDBexchangeService {
    constructor($http, $q, $resource) {
        return {
            adn_d: $resource('/r/adn/d/:doc_id', { doc_id: '@doc_id', value: '@value' }),
            adn_insert: $resource('/r/adn/insert', { sqlCmdMap: '@sqlCmdMap' }),
            adn_delete: $resource('/r/adn/delete', { sqlCmdMap: '@sqlCmdMap' }),
            adn_deletes: $resource('/r/adn/deletes', { sqlCmdListMap: '@sqlCmdListMap' }),
            url_sql_read_db1: $resource('/r/url_sql_read_db1', { data: '@data' }),
            url: '/r/url_sql_read_db1',
            httpGetSql: function (params) {
                var deferred = $q.defer()
                $http.get(this.url, { params: params })
                    .then((response) => {
                        deferred.resolve(response.data)
                    }, (response) => {
                        console.log(response.status)
                        // deferred.reject(response.status)
                        // https://metanit.com/web/angular/3.3.php
                    })
                return deferred.promise
            },
            httpGetRest: function (url) {
                var deferred = $q.defer()
                // console.log(url, 1)
                $http.get(url)
                    .then((response) => {
                        deferred.resolve(response.data)
                    }, (response) => {
                        console.log(response.status)
                        // deferred.reject(response.status)
                        // https://metanit.com/web/angular/3.3.php
                    })
                return deferred.promise
            },
        }
    }
}

class AmAttDirection { restrict = 'A' }
class AmSqlHtml extends AmAttDirection {
    constructor($compile) {
        super()
        this.link = (s, e) => {
            let sqlE = sql_app[conf.sqlKeyName]
            if (sqlE.sqlHtml && sqlE.sqlHtml[s.k] != null) {
                e.html(sqlE.sqlHtml[s.k])
                $compile(e.contents())(s)
            }
        }
    }
}

class AmEmrLink extends AmAttDirection {
    constructor($compile) {
        super()
        this.link = (s, e, a) => {
            let innerHtml
            if (a.emrid) {
                innerHtml = '<a  class="w3-hover-shadow am-0u" \n\
                data-ng-click="ctrl.clickedId('+ a.emrid + ')" \n\
                data-ng-class="{\'w3-green\':' + a.emrid
                    + '==ctrl.singlePage.UrlMap()[\'emr\']}" \n\
                href="#!{{ctrl.singlePage.UrlOnOff(\'emr_' + a.emrid + '\', 2)}}" >'
                    + e[0].innerHTML + ' </a>'
            }
            if (innerHtml) {
                e.html(innerHtml)
                $compile(e.contents())(s)
            }
        }
    }
}

class RWDataFactory {
    constructor($http, $q) { this.$http = $http; this.$q = $q }
    urlSql = '/r/url_sql_read_db1'
    sqlRowLimit = 100
    // sqlRowLimit = 50

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
