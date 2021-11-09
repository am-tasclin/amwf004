'use strict';
var app = angular.module("app", ['ngRoute', 'ngResource', 'ngSanitize'])
angular.element(() => angular.bootstrap(document, ['app']))
const singlePage = {}, sql_app = {}
class AbstractController { singlePage = singlePage; conf = conf }

singlePage.Url = () => window.location.href.split('#!')[1]
singlePage.PseudoREST = singlePage.Url
singlePage.UrlList = () => singlePage.Url().split('/')
singlePage.PseudoRESTKey = key => singlePage.UrlList().filter(w => w.includes(key))

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

let readSql2R = sqlN => replaceSql(sql_app[sqlN].sql)
let replaceSql = sql => {
    while (sql.includes(':sql_app.')) {
        let sql_name = sql.split(':sql_app.')[1].split(' ')[0]
        let sql_inner = readSql2R(sql_name)
        sql = sql.replace(':sql_app.' + sql_name, sql_inner)
    }
    return ''+sql
}


//app.config(RouteProviderConfig)
class RouteProviderConfig {
    constructor($routeProvider) {
        console.log('RouteProviderConfig')
        let rpo = key => {
            let rpo = {
                templateUrl: 'ResourceFHIR.html',
                controllerAs: 'ctrl',
            }
            rpo.controller = 'InitFHIResourceController'
            if (conf.FHIR[key].controller)
                rpo.controller = conf.FHIR[key].controller
            return rpo
        }
        let kIdREST = (pref, k) => {
            let kElId = k + '_:' + k + '_id'
            // console.log(k, kElId)
            $routeProvider.when(pref + "/" + kElId, rpo(k))
            return kElId
        }
        angular.forEach(conf.FHIR, (v, k1) => {
            // console.log(k1)
            $routeProvider.when('/' + k1, rpo(k1))
            let k1Id = kIdREST('', k1)
            angular.forEach(conf.FHIR[k1].children, (k2) => {
                $routeProvider.when('/' + k1 + '/' + k2, rpo(k2))
                $routeProvider.when('/' + k1Id + '/' + k2, rpo(k2))
                let k12Id = kIdREST('/' + k1Id, k2)
                angular.forEach(conf.FHIR[k2].children, (k3) => {
                    $routeProvider.when("/" + k1 + '/' + k2 + '/' + k3, rpo(k3))
                    $routeProvider.when('/' + k1Id + '/' + k12Id + '/' + k3, rpo(k3))
                    let k123Id = kIdREST('/' + k1Id + '/' + k12Id, k3)
                })
            })
        })
    }
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
            httpGet: function (params) {
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
