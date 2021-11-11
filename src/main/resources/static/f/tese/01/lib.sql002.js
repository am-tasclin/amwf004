const singlePage = {}, conf = {}, sql_app = {}

var app = angular.module("app", ['ngRoute', 'ngResource', 'ngSanitize'])
angular.element(() => angular.bootstrap(document, ['app']))

class AbstractController {
    singlePage = singlePage; conf = conf
    getSql = sql => sql_app[sql]
}

let readSql2R = sqlN => replaceSql(sql_app[sqlN].sql)
let replaceSql = sql => {
    while (sql.includes(':sql_app.')) {
        let sql_name = sql.split(':sql_app.')[1].split(' ')[0]
        let sql_inner = readSql2R(sql_name)
        sql = sql.replace(':sql_app.' + sql_name, sql_inner)
    }
    return '' + sql
}

class SqlAbstractController extends AbstractController {
    dataFactory
    constructor(dataFactory) {
        super()
        this.dataFactory = dataFactory
    }
    getChoisedListItem = () => !sql_app.simpleSQLselect ? '' :
        sql_app.simpleSQLs[sql_app.simpleSQLselect].choisedListItem
}

// app.controller("SqlController", SqlController)
class SqlController extends SqlAbstractController {
    constructor(dataFactory, $routeParams) {
        super(dataFactory)
        conf.sqlKeyName = $routeParams.sql
        console.log(conf.sqlKeyName, sql_app[conf.sqlKeyName].limit)
        let sql = readSql2R(conf.sqlKeyName)
        if (Object.keys($routeParams).includes('key'))
            sql = 'SELECT * FROM (' + sql + ') x WHERE ' + $routeParams.key + ' = ' + $routeParams.val
        // console.log('SqlController \n', Object.keys($routeParams), sql)
        conf.sql = sql
        let ctrl = this
        dataFactory.httpGetSql({ sql: sql, limit: sql_app[conf.sqlKeyName].limit })
            .then(dataSqlRequest => ctrl.data = dataSqlRequest)
    }
    sql_app = sql_app
}

// app.factory("dataFactory", DataFactory)
class DataFactory {
    urlSql = '/r/url_sql_read_db1'
    constructor($http, $q, $resource) {
        this.httpGetSql = params => {
            let deferred = $q.defer()
            let limit = 50
            if (params.limit) limit = params.limit
            params.sql = params.sql + ' LIMIT ' + limit
            $http.get(this.urlSql, { params: params })
                .then(response => deferred.resolve(response.data)
                    , response => {
                        console.log(response.status)
                        // deferred.reject(response.status)
                        // https://metanit.com/web/angular/3.3.php
                    })
            return deferred.promise
        }
        return this
    }
}

// app.config(RouteProviderConfig)
class RouteProviderConfig {
    constructor($routeProvider) {
        // console.log('RouteProviderConfig', Object.keys(singlePage))
        angular.forEach(singlePage, (v, k) => {
            if (!v.controllerAs) v.controllerAs = 'ctrl'
            $routeProvider.when("/" + k, v)
        })
        $routeProvider.otherwise({ template: "<h1>?</h1><p>Hi API</p>" })
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

singlePage.Url = () => window.location.href.split('#!')[1]
singlePage.PseudoREST = singlePage.Url
singlePage.UrlParams = () => singlePage.Url().includes('?') ? singlePage.Url().split('?')[1].split('&') : []
singlePage.UrlParamKey = (key) => singlePage.UrlParams().filter(word => word.includes(key + '='))
singlePage.UrlParamKeyValue = (key) => singlePage.UrlParamKey(key).length > 0 ? singlePage.UrlParamKey(key)[0].split('=')[1] : ''

singlePage.UrlList = () => singlePage.Url().split('/')

singlePage.FirstUrl = () => singlePage.Url() ? singlePage.Url().split('/')[1] : ''
singlePage.FirstUrlTag = () => singlePage.FirstUrl().split('_')[0]
singlePage.FirstUrlId = () => singlePage.FirstUrl().split('_')[1]

singlePage.LastUrl = () => singlePage.Url() ? singlePage.Url().split('/')[singlePage.Url().split('/').length - 1] : ''
singlePage.LastUrlTag = () => singlePage.LastUrl().split('_')[0]
singlePage.LastUrlId = () => singlePage.LastUrl().split('_')[1]

singlePage.UrlOnOff = (s, p) => singlePage.Url().includes(s) ? singlePage.UrlList().slice(0,p).join('/') : singlePage.UrlList().slice(0,p).concat([s]).join('/')
// singlePage.UrlOnOff = s => singlePage.Url().includes(s)?singlePage.Url().replace(s,''):(singlePage.Url()+s)

conf.sqlAppToLink = text =>
    !text ? '' : ('' + text).replace(new RegExp(':(sql_app\\.)(\\w+)', 'gi'), ':<b>$1<a href="#!/sql/$2">$2</a></b>')

conf.sqlAppKeys = () => Object.keys(sql_app)
conf.modalDisplay = { display: null }
