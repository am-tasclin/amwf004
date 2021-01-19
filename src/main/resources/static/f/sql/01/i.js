'use strict';
var app = angular.module("app", ['ngRoute', 'ngResource', 'ngSanitize']);
angular.element(() => angular.bootstrap(document, ['app']))
app.factory("dataFactory", DataFactory)
app.factory("treeFactory", TreeFactory)

const conf = {
    singlePagesUrl: {
        sql: {
            templateUrl: 'sql1.html',
            controller: 'SqlController',
            controllerAs: 'ctrl',
        },
        wikiList: {
            templateUrl: 'wikiList.html',
            controller: 'WikiListController',
            controllerAs: 'ctrl',
        },
        carePlan001: {
            templateUrl: 'carePlan001.html',
            controller: 'CarePlan001Controller',
            controllerAs: 'ctrlCarePlan',
        },
        carePlan002Rest: {
            templateUrl: 'carePlan001.html',
            controller: 'CarePlan002RestController',
            controllerAs: 'ctrlCarePlan',
        },
        wiki: {
            templateUrl: 'wiki.html',
            controller: 'Wiki001Controller',
            controllerAs: 'ctrl',
        },
        wiki003Rest: {
            templateUrl: 'wiki.html',
            controller: 'Wiki003RestController',
            controllerAs: 'ctrl',
        },
        'wiki004Rest/:doc_id': {
            templateUrl: 'wiki.html',
            controller: 'Wiki004RestController',
            controllerAs: 'ctrl',
        },
        'wiki005Rest/:doc_id': {
            templateUrl: 'wiki.html',
            controller: 'Wiki005RestController',
            controllerAs: 'ctrl',
        },
        'wiki005Rest/:doc_id/:el_id': {
            templateUrl: 'wiki.html',
            controller: 'Wiki005RestController',
            controllerAs: 'ctrl',
        },
        'wiki005Rest/:doc_id/:el_id/:crud': {
            templateUrl: 'wiki.html',
            controller: 'Wiki005RestController',
            controllerAs: 'ctrl',
        },
    }
}

d.conf.wiki = {
    cl: {//допустимі children елементи для елементів.
        root: ['h1', 'p', 'h2', 'ol'],
        h2: ['h3', 'p', 'ol'],
        h3: ['p', 'ol'],
    },
    menu: ['h2', 'h3', 'p', 'ol'],
    ref: {
        h1: 1,
        h2: 371364,
        h3: 371363,
        p: 371359,
        ol: 371367,
    }
}

const read_wiki_id = 371357
class Wiki000AbstractController extends AmDocAbstractController {
    constructor($scope) {
        super($scope)
        $scope.markdownInLine = markdownInLine
    }
    setWiki = (data) => {
        console.log(1, data.elMap, data.clList)
        d.elMap = data.elMap
        d.clList = data.clList
    }
}

// app.controller("Wiki005RestController", Wiki005RestController)
class Wiki005RestController extends Wiki000AbstractController {
    constructor($scope, $routeParams, dataFactory, edTextFactory) {
        super($scope)
        console.log(d.conf)
        d.conf.$routeParams = $routeParams
        d.conf.read_wiki_id = $routeParams.doc_id
        console.log(d.conf.read_wiki_id)
        dataFactory.adn_d.get({ doc_id: d.conf.read_wiki_id }).$promise.then(this.setWiki);
        return {
            wikiItemAddEl: edTextFactory.wikiItemAddEl,
            hideChildren: edTextFactory.hideChildren,
        }
    }
}
app.controller("Wiki005RestController", Wiki005RestController)

// app.controller("Wiki004RestController", Wiki004RestController)
class Wiki004RestController extends Wiki000AbstractController {
    constructor($scope, $routeParams, dataFactory) {
        super($scope)
        d.conf.read_wiki_id = $routeParams.doc_id
        console.log(d.conf.read_wiki_id)
        dataFactory.httpGetRest('/r/adn/d/' + d.conf.read_wiki_id).then(this.setWiki)
    }
}
app.controller("Wiki004RestController", Wiki004RestController)

// app.controller("Wiki003RestController", Wiki003RestController)
class Wiki003RestController extends Wiki000AbstractController {
    constructor($scope, dataFactory) {
        super($scope)
        dataFactory.httpGetRest('/r/adn/d/' + read_wiki_id).then(this.setWiki)
    }
}
app.controller("Wiki003RestController", Wiki003RestController)
// app.controller("Wiki001Controller", Wiki001Controller)
class Wiki001Controller extends Wiki000AbstractController {
    constructor($scope, treeFactory) {
        super($scope)
        conf.getListChildren = 'getListChildrenSql'
        treeFactory.readElement(read_wiki_id)
            .then((el) => treeFactory.readChildrenDeep([el.doc_id], 4))
    }
}
app.controller("Wiki001Controller", Wiki001Controller)

const read_doc_id = 369927
// app.controller("CarePlan001Controller", CarePlan001Controller)
class CarePlan000AbstractController extends AmDocAbstractController {
    constructor($scope) {
        super($scope)
        d.conf.read_doc_id = read_doc_id
        conf.extraReadIds = [
            368794, // CarePlan.activity.plannedActivityReference
        ]
    }
    scope
    init(treeFactory) {
        console.log(this.constructor.name, 1)
        conf.readExtra = (el) => {
            if (conf.extraReadIds.indexOf(el.reference) >= 0) {
                console.log(el.doc_id, el.reference, conf.extraReadIds.indexOf(el.reference))
                console.log(el.reference2,)
                treeFactory[conf.readElement](el.reference2)
                    .then((el) => treeFactory.readChildrenDeep([el.doc_id], 3))
            }
        }
        treeFactory[conf.readElement](read_doc_id)
            .then((el) => treeFactory.readChildrenDeep([el.doc_id], 3))
    }
}

// app.controller("CarePlan002RestController", CarePlan002RestController)
class CarePlan002RestController extends CarePlan000AbstractController {
    constructor($scope, treeFactory) {
        super($scope)
        conf.getListChildren = 'getListChildrenRest'
        conf.readElement = 'readElementRest'
        this.init(treeFactory, this)
        $scope.morEventFn = ($event) => {
            console.log($event)
        }
    }
}
app.controller("CarePlan002RestController", CarePlan002RestController)

// app.controller("CarePlan001Controller", CarePlan001Controller)
class CarePlan001Controller extends CarePlan000AbstractController {
    constructor($scope, treeFactory) {
        super($scope)
        conf.getListChildren = 'getListChildrenSql'
        conf.readElement = 'readElement'
        this.init(treeFactory, this)
    }
}
app.controller("CarePlan001Controller", CarePlan001Controller)

// app.controller("FirstController", FirstController)
class FirstController extends AmDocAbstractController {
    constructor($scope) {
        super($scope)
    }
}
app.controller("FirstController", FirstController)

sql_app.simpleSQLs = {
    SQL_from_DB: {
        c: 'SELECT doc_id, value sql_select FROM doc \n\
    LEFT JOIN string ON string_id=doc_id \n\
    WHERE 371327 IN (reference2)'
    },
    FHIR_DomainResource: {
        c: 'SELECT value FHIR_DomainResource, d.* FROM doc d \n\
    LEFT JOIN string ON string_id=doc_id \n\
    WHERE 369789 IN (reference)'
    },
    WikiList: {
        c: 'SELECT doc_id, value, cnt_child, parent FROM doc d \n\
        LEFT JOIN string ON string_id=doc_id \n\
        LEFT JOIN ( \n\
            SELECT count(parent) cnt_child, parent child FROM doc GROUP BY parent \n\
            ) cnt ON cnt.child=d.doc_id \n\
        WHERE 369940 IN (reference, doc_id, reference2)',
        newDocMenu: {},
        wikiReference: 369940,
        wikiFolderId: 371645,
        sqlHtml: { doc_id: '<a href="#!/wiki005Rest/{{r[k]}}">{{r[k]}}</a>', },
    },
}
console.log(1)

// app.factory("edTextFactory", EdTextFactory)
class EdTextFactory {
    constructor($timeout, $q, dataFactory) {
        let timeoutChangeToSave, timeoutSecToSave
        //повтореня DWCS та запис
        let repeatDWCStoSave = (o) => {
            if (o.s.runSec > 0) {
                if (o.s.runSec < 10) {
                    console.log(o.s.runSec)
                    deferWaitChangeSave(o).then(repeatDWCStoSave)
                } else {
                    console.log('goto save', o.s.runSec)
                    o.save()
                }
            } else {
                console.error('repeatDWCS ERROR:')
            }
        }
        //deferWaitChangeSave DWCS - відкласти очікування після змін для збереження
        let deferWaitChangeSave = (o) => {
            let deferred = $q.defer()
            if (o.s.cntChange > 0) {
                if (!o.startTime) o.startTime = new Date()
                if (timeoutSecToSave) $timeout.cancel(timeoutSecToSave)
                timeoutSecToSave = $timeout(() => {
                    if (o.startTime)
                        o.s.runSec = Math.round((new Date() - o.startTime.getTime()) / 1000)
                    deferred.resolve(o)
                }, 2000)
            } else {
                // deferred.resolve(o) // endless
            }
            return deferred.promise
        }
        let o = {
            deleteEndEl: (id) => {
                let clList = d.clList[id]
                if (!clList) {
                    console.log(1, id, { delete_doc: { doc_id: id, } })
                    dataFactory.adn_delete.save({ delete_doc: { doc_id: id, } }).$promise.then((map) => {
                        console.log(1, map)
                    })
                }
            },
            sortDownElement: (id) => {
                let so = upDowntElement(id, 1)
                dataFactory.url_sql_read_db1.save(so).$promise.then((map) => {
                    console.log(map)
                })
            },
            sortUpElement: (id) => {
                let so = upDowntElement(id, -1)
                dataFactory.url_sql_read_db1.save(so).$promise.then((map) => {
                    console.log(map)
                })
            },
            hideChildren: (id) => {
                let el = d.elMap[id]
                el.hidedChildren = !el.hidedChildren
                console.log(id, el)
            },
            wikiItemAddEl: (newTagName, id) => {
                let elParent = d.elMap[id]
                let parentId = elParent.doc_id
                /**
                 * коррекція parent елемента для нового вузла даних
                 */
                if ('p|ol'.indexOf(elParent.r1value) >= 0) {//parent елемент кінцевий елемент
                    elParent = d.elMap[elParent.parent]
                }
                if ('h2' == newTagName && 'h2' == elParent.r1value) {
                    elParent = d.elMap[elParent.parent]
                } else if ('h3' == newTagName && 'h3' == elParent.r1value) {
                    elParent = d.elMap[elParent.parent]
                }
                let sqlCmdMap = {
                    next_doc_ids: 1,
                    insert_doc: {
                        calc_doc_id: 0,
                        reference: d.conf.wiki.ref[newTagName],
                        parent: elParent.doc_id,
                        insert_string: {},
                    }
                }
                console.log(newTagName, d.conf.wiki.ref[newTagName], id, elParent.r1value, elParent, sqlCmdMap)
                dataFactory.adn_insert.save(sqlCmdMap).$promise.then((map) => {
                    console.log(1, map)
                })
            },
            onChange: function () {
                let o = this
                if (timeoutChangeToSave) $timeout.cancel(timeoutChangeToSave)
                timeoutChangeToSave = $timeout(() => {
                    if (d.elMap[o.s.elEdId].value_1_22 != o.s.value_1_edit) {
                        o.s.cntChange++
                        d.elMap[o.s.elEdId].value_1_22 = o.s.value_1_edit
                        console.log('goto deferWaitChangeSave', o)
                        deferWaitChangeSave(o).then(repeatDWCStoSave)
                        if (o.s.cntChange > 3) {
                            console.log('goto save', o.s.cntChange > 3)
                            o.save()
                        }
                    }
                    console.log(o.s.cntChange, o.s.value_1_edit == d.elMap[o.s.elEdId].value_1_22)
                }, 500)
            },
            save: function () {
                let o = this
                // console.log('run save', o)
                console.log('run save', d.elMap[o.s.elId])
                o.s.cntChange = 0
                delete o.startTime
                delete o.s.runSec
                console.log(o.s.cntChange, o.s.value_1_edit)
                const paramDefaults = { doc_id: o.s.elEdId, value: o.s.value_1_edit }
                dataFactory.adn_d.save(paramDefaults).$promise.then((map) => {
                    console.log(1, map)
                })
            },
            initElEdId: function (s) {
                let o = this
                console.log(o)
                o.s = s
                o.s.d = d
                o.s.value_1_edit = d.elMap[s.elEdId].value_1_22
                console.log(s.elEdId, d.elMap[s.elEdId], s)
                o.s.cntChange = 0
                // secToSave(o)
            },
        }
        return o
    }
}
app.factory("edTextFactory", EdTextFactory)

app.directive('amEdText', () => {
    return {
        restrict: 'A',
        transclude: true,
        templateUrl: 'amEdText.html',
        controller: ['edTextFactory', EdTextController],
        controllerAs: 'ctrl',
        scope: { id: '<elEdId', },
        link: (s, e, a, c) => {
            if (d.conf.$routeParams.el_id == s.id) {
                s.elEdId = s.id
                c.edTextFactory.initElEdId(s)
            }
        },
    }
})

class EdTextController {
    edTextFactory
    constructor(edTextFactory) {
        return {
            edTextFactory: edTextFactory,
            wikiItemAddEl: edTextFactory.wikiItemAddEl,
            sortUpElement: edTextFactory.sortUpElement,
            sortDownElement: edTextFactory.sortDownElement,
            deleteEndEl: edTextFactory.deleteEndEl,
        }
    }
}

class CreateDocController {
    constructor() {
    }
    createWikiDocDialog = () => this.openedCreateWikiDoc = !this.openedCreateWikiDoc
}

app.directive('amCreateDoc', () => {
    return {
        restrict: 'A',
        templateUrl: 'newDocMenu.html',
        controllerAs: 'ctrl',
        controller: [CreateDocController],
    }
})

app.directive('amSqlHtml', ($compile) => {
    return {
        restrict: 'A',
        link: (s, e) => {
            let sqlE = sql_app.simpleSQLs[sql_app.simpleSQLselect]
            if (sqlE.sqlHtml) {
                if (sqlE.sqlHtml[s.k] != null) {
                    e.html(sqlE.sqlHtml[s.k])
                    $compile(e.contents())(s)
                }
            }
        },
    }
})

class SqlAbstractController {
    dataFactory
    constructor(dataFactory) {
        this.dataFactory = dataFactory
    }
    readSql = (sqlN) => {
        let ctrlSql = this
        sql_app.simpleSQLselect = this.simpleSQLselect = sqlN
        console.log(sqlN, sql_app.simpleSQLs[sqlN].c)
        this.dataFactory.httpGet({ sql: sql_app.simpleSQLs[sqlN].c })
            .then((dataSqlRequest) => {
                ctrlSql.data = dataSqlRequest
                console.log(dataSqlRequest)
            })
    }
    choiseListItem = (r) => {
        delete this.noDeletable
        this.choisedListItem = r.doc_id
    }
}

// app.controller("WikiListController", WikiListController)
class WikiListController extends SqlAbstractController {
    constructor(dataFactory) {
        super(dataFactory)
        if (!this.data) this.readSql('WikiList')
        this.wikiConfigData = sql_app.simpleSQLs['WikiList']
        //this.simpleSQLs = sql_app.simpleSQLs // :)
    }
    wikiConfigData
    createWikiDoc = () => {
        let sqlCmdMap = {
            next_doc_ids: 1,
            insert_doc: {
                calc_doc_id: 0,
                reference: this.wikiConfigData.wikiReference,
                parent: this.wikiConfigData.wikiFolderId,
                insert_string: {
                    value: this.nameNewWikiDoc,
                },
            }
        }
        console.log(2, this.nameNewWikiDoc, this.wikiConfigData.wikiFolderId, this.wikiConfigData, sqlCmdMap)
        this.dataFactory.adn_insert.save(sqlCmdMap).$promise.then((map) => {
            console.log(map)
        })
    }
    createWikiDocDialog = () => this.openedCreateWikiDoc = !this.openedCreateWikiDoc
    deleteWikiDoc = () => {
        let ctrl = this
        console.log(this.choisedListItem, ctrl.wikiConfigData.wikiFolderId)
        ctrl.noDeletable = []
        angular.forEach(this.data.list, (li) => {
            if (li.doc_id == this.choisedListItem) {
                if (li.parent != ctrl.wikiConfigData.wikiFolderId) {
                    ctrl.noDeletable.push('Файл в спеціалізованій папці, не видаляється в цьому діалозі')
                }
                if (li.cnt_child) {
                    ctrl.noDeletable.push('Файл не пустий, видаляються тільки пусті файли')
                }
                console.log(li.doc_id, li.parent != ctrl.wikiConfigData.wikiFolderId, li, ctrl.noDeletable, ctrl.noDeletable.length)
            }
        })
        if (ctrl.noDeletable.length == 0) {//delete element - empty wiki doc
            this.dataFactory.adn_delete.save({ delete_doc: { doc_id: this.choisedListItem, } }).$promise.then((map) => {
                console.log(map)
            })
        }
    }

}
app.controller("WikiListController", WikiListController)

// app.controller("SqlController", SqlController)
class SqlController extends SqlAbstractController {
    constructor(dataFactory) {
        super(dataFactory)
        this.simpleSQLs = sql_app.simpleSQLs
        this.simpleSQLselect = 'SQL_from_DB'
        if (!this.data) this.readSql(this.simpleSQLselect)
        this.tut = 'tutorial links'
    }
}
app.controller("SqlController", SqlController)

// app.config(RouteProviderConfig)
class RouteProviderConfig {
    constructor($routeProvider) {
        angular.forEach(conf.singlePagesUrl, (v, k) => {
            $routeProvider.when("/" + k, v)
        })
        $routeProvider.otherwise({
            redirectTo: '/wikiList'
        })
    }
}
app.config(RouteProviderConfig)

