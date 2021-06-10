'use strict';
var app = angular.module("app", ['ngRoute', 'ngResource', 'ngSanitize']);
angular.element(() => angular.bootstrap(document, ['app']))
app.factory("dataBeFactory", DataDBexchangeService)
app.factory("editFRFactory", EditFHIResourceService)

conf.fixForUse = () => {
    console.log(1)
}
conf.showDocJson = () => {
    let docOfPageFr = conf.fr[singlePage.FirstUrlTag()]
    let docOfPage = docOfPageFr.currEl
    angular.forEach(docOfPageFr.sql_app_children, (v) => {
        if (!docOfPage.children) docOfPage.children = {}
        docOfPage.children[v.fr] = v.list
        let el = conf.fr[v.fr]
        angular.forEach(el.sql_app_children001, (v, k) => {
            console.log(k, v.list)
            docOfPage.children[k] = v.list
        })
    })
    angular.forEach(docOfPageFr.sql_app_children001, (v, k) => {
        if (!docOfPage.children) docOfPage.children = {}
        console.log(k, v.list)
        docOfPage.children[k] = v.list
    })
    // console.log(singlePage.FirstUrlTag(), docOfPage, JSON.stringify(docOfPage, null, 1))
    return JSON.stringify(docOfPage, null, 1)
}

app.directive('amRsRow', ($compile) => {
    return {
        restrict: 'A',
        link: (s, e, a) => {
            let tag = a.tag, confEl, innerHtml
            if (!tag) tag = singlePage.LastUrlTag()
            confEl = conf.fr[tag]
            if (a.innerHtml)
                angular.forEach(a.innerHtml.split('.'),
                    (v) => innerHtml = innerHtml ? innerHtml[v] : confEl[v])
            if (a.innerHtmlRaw) innerHtml = a.innerHtmlRaw
            if (!innerHtml)
                if (confEl)
                    innerHtml = confEl.amRsRowHtml
            // console.log(tag, s, e, a, singlePage.LastUrl(), innerHtml)
            if (innerHtml) {
                e.html(innerHtml)
                $compile(e.contents())(s)
            }
        },
    }
})

// app.controller("InitFHIResourceController", InitFHIResourceController)
class InitFHIResourceController extends AbstractController {
    dataBeFactory
    editFRFactory
    constructor($scope, $routeParams, dataBeFactory, editFRFactory) {
        super()
        this.dataBeFactory = dataBeFactory
        this.editFRFactory = editFRFactory
        console.log('--InitFHIResourceController--', singlePage.Url(), singlePage.Url().split('/').length - 1, singlePage.LastUrl(), singlePage.LastUrlTag(), singlePage.LastUrlIdName())
        if (conf.fr[singlePage.LastUrlTag()].sql_app) {
            let sql = sql_app[conf.fr[singlePage.LastUrlTag()].sql_app]()
            if (sql.includes(':sql_app')) sql = sql_app.concatSql(sql)
            // console.log(1, sql)
            //read resource list
            dataBeFactory.httpGet({ sql: sql })
                .then((dataSqlRequest) => {
                    $scope.dataSqlRequest = dataSqlRequest
                    console.log(2, dataSqlRequest)
                })
        }
        angular.forEach(conf.fr[singlePage.LastUrlTag()].dates, (v) => {
            let sql = sql_app[v.sql_app]()
            console.log(v, sql)
            dataBeFactory.httpGet({ sql: sql })
                .then((dataSqlRequest) => {
                    v.dataSqlRequest = dataSqlRequest
                    console.log(2, dataSqlRequest)
                })
        })
        //read url id objects
        console.log(singlePage.UrlList())
        angular.forEach(singlePage.UrlList(), (x_Url, nr) => {
            if (x_Url && x_Url.split('_')[1]) { //tag with id
                let tag = x_Url.split('_')[0], tag_id = x_Url.split('_')[1]
                if (!conf.fr[tag].currEl || conf.fr[tag].currEl[singlePage.TagIdName(tag)] != tag_id) {
                    console.log(conf.fr[tag].sql_app)
                    let sql = sql_app.concatSql(sql_app[conf.fr[tag].sql_app]())
                    sql = 'SELECT * FROM (' + sql + ') x  WHERE ' + singlePage.TagIdName(tag) + ' = ' + tag_id
                    // console.log(tag,conf.fr[tag].sql_app, sql)
                    dataBeFactory.httpGet({ sql: sql }).then((dataSqlRequest) => {
                        conf.fr[tag].currEl = dataSqlRequest.list[0]
                        console.log(2, tag, dataSqlRequest, conf.fr[tag].currEl)
                    })
                    angular.forEach(conf.fr[tag].sql_app_children001, (sql_app_child, k) => {
                        let sql2 = sql_app[sql_app_child.sql_app]()
                        sql2 = sql_app.concatSql(sql2)
                        sql2 = 'SELECT * FROM ( ' + sql2 + ' ) x WHERE ' + sql_app_child.connect_param + ' = ' + tag_id
                        console.log(tag, tag_id, k, sql_app_child, sql2)
                        dataBeFactory.httpGet({ sql: sql2 }).then((dataSqlRequest) => {
                            sql_app_child.list = dataSqlRequest.list
                            console.log(sql_app_child)
                        })
                    })
                    angular.forEach(conf.fr[tag].sql_app_children, (sql_app_child) => {
                        let sql2 = sql_app[sql_app_child.sql_app]()
                        console.log(sql_app_child, sql_app_child.connect_param)
                        sql2 = 'SELECT * FROM ( ' + sql2 + ' ) x WHERE ' + sql_app_child.connect_param + ' = ' + tag_id
                        sql2 = sql_app.concatSql(sql2)
                        dataBeFactory.httpGet({ sql: sql2 }).then((dataSqlRequest) => {
                            console.log(2, tag, dataSqlRequest)
                            sql_app_child.list = dataSqlRequest.list
                        })
                    })
                }
            }
        })
    }

    keep2back = (r) => {
        let prevUrl = singlePage.Url().replace(singlePage.LastUrl(), '')
        conf.fr[singlePage.LastUrlTag()].currEl = r
        console.log(r, singlePage.LastUrlTag(), conf.fr[singlePage.LastUrlTag()])
        // console.log(r, prevUrl, singlePage.Url().split('/').length)
        if (singlePage.Url().split('/').length > 2) {
            window.location.href = '#!' + prevUrl
        } else {
            let goUrl = prevUrl + singlePage.LastUrlTag() + '_' + r[singlePage.LastUrlIdName()]
            console.log(1, goUrl, r[singlePage.LastUrlIdName()])
            window.location.href = '#!' + goUrl
        }
    }

    clickAmRsRow = (r) => {
        console.log(r)
    }

    // відктрити діалог вузла даних і перейти на його singlePage.Url
    rsEdPart = (r, part) => {
        console.log(r, part)
    }
    rsEdPart2 = (r, part, prefix) => {
        let frs1 = singlePage.FirstUrlTag()
        let frnPart = conf.fr[part].frn
        let idName = frnPart.toLowerCase() + '_id'
        if (prefix) idName = prefix + idName
        console.log(1, part, frnPart, idName, r[idName])
        let k2 = part + '_' + r[idName]
        if (conf.fr[frs1].ed_frs_idName != idName)
            conf.fr[frs1].ed_frs_idName = idName
        else
            delete conf.fr[frs1].ed_frs_idName
        console.log(singlePage.Url(), frs1, idName, conf.fr[frs1], r)
        if (r[idName]) {
            if (singlePage.TagPosition(part)) {
                console.log(frnPart, r[idName], k2, singlePage.TagPosition(part))
            } else {
                let newUrl = singlePage.Url() + '/' + k2
                console.log(newUrl, frnPart, r[idName], k2, singlePage.TagPosition(part))
                window.location.href = '#!' + newUrl
            }
        }
    }

}
app.controller("InitFHIResourceController", InitFHIResourceController)

// app.config(RouteProviderConfig)
class RouteProviderConfig {
    constructor($routeProvider) {
        let rpo = {
            templateUrl: 'ResourceFHIR.html',
            controller: 'InitFHIResourceController',
            controllerAs: 'ctrl',
        }
        let kIdREST = (pref, k) => {
            let kElId = k + '_:' + k + '_id'
            // console.log(k, kElId)
            $routeProvider.when(pref + "/" + kElId, rpo)
            return kElId
        }
        angular.forEach(conf.fr, (v, k1) => {
            $routeProvider.when('/' + k1, rpo)
            let k1Id = kIdREST('', k1)
            angular.forEach(conf.fr[k1].children, (k2) => {
                $routeProvider.when('/' + k1 + '/' + k2, rpo)
                $routeProvider.when('/' + k1Id + '/' + k2, rpo)
                let k12Id = kIdREST('/' + k1Id, k2)
                angular.forEach(conf.fr[k2].children, (k3) => {
                    $routeProvider.when("/" + k1 + '/' + k2 + '/' + k3, rpo)
                    $routeProvider.when('/' + k1Id + '/' + k12Id + '/' + k3, rpo)
                    let k123Id = kIdREST('/' + k1Id + '/' + k12Id, k3)
                })
            })
        })
    }
}
app.config(RouteProviderConfig)

// app.controller("InitPageController", InitPageController)
class InitPageController extends AbstractController {
    constructor($scope, $route) {
        super()
        console.log(singlePage.Url(), Object.keys($route.routes))
    }
}
app.controller("InitPageController", InitPageController)
