'use strict';
var app = angular.module("app", ['ngRoute', 'ngResource', 'ngSanitize']);
angular.element(() => angular.bootstrap(document, ['app']))
app.factory("dataFactory", DataFactory)
app.factory("treeFactory", TreeFactory)
app.factory("wikiResourceFactory", WikiResourceFactory)

const conf = {
    singlePagesUrl: {
        sql: {
            templateUrl: 'sql1.html',
            controller: 'SqlController',
            controllerAs: 'ctrlSql',
        },
        wikiList: {
            templateUrl: 'wikiList.html',
            controller: 'WikiListController',
            controllerAs: 'ctrlSql',
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

const read_wiki_id = 371357
class Wiki000AbstractController extends AmDocAbstractController {
    constructor($scope) {
        super($scope)
        $scope.markdownInLine = markdownInLine
    }
    setWiki = (data) => {
        console.log(data.elMap, data.clList)
        d.elMap = data.elMap
        d.clList = data.clList
    }
}

// app.controller("Wiki005RestController", Wiki005RestController)
class Wiki005RestController extends Wiki000AbstractController {
    constructor($scope, $routeParams, wikiResourceFactory) {
        super($scope)
        console.log(d.conf)
        d.conf.$routeParams = $routeParams
        d.conf.read_wiki_id = $routeParams.doc_id
        console.log(d.conf.read_wiki_id)
        wikiResourceFactory.get({ doc_id: d.conf.read_wiki_id }).$promise.then(this.setWiki);
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

sql_app.simpleSQLs = [
    {
        n: 'SQL from DB',
        c: 'SELECT doc_id, value sql_select FROM doc \n\
    LEFT JOIN string ON string_id=doc_id \n\
    WHERE 371327 IN (reference2)'
    },
    {
        n: 'FHIR.DomainResource',
        c: 'SELECT value FHIR_DomainResource, d.* FROM doc d \n\
    LEFT JOIN string ON string_id=doc_id \n\
    WHERE 369789 IN (reference)'
    },
    {
        n: 'WikiList',
        c: 'SELECT doc_id, value FROM doc d \n\
        LEFT JOIN string ON string_id=doc_id \n\
        WHERE 369940 IN (reference, doc_id, reference2)',
        sqlHtml: { doc_id: '<a href="#!/wiki005Rest/{{r[k]}}">{{r[k]}}</a>', },
    },
]

class EdTextController {
    edTextFactory
    constructor(edTextFactory) { this.edTextFactory = edTextFactory }
}

// app.factory("edTextFactory", EdTextFactory)
class EdTextFactory {
    constructor($timeout, $q) {
        let toChangeToSave, toSecToSave
        let secToSave = (o) => {
            if (toSecToSave) $timeout.cancel(toSecToSave)
            toSecToSave = $timeout(() => {
                if (o.s.cntChange > 0) {
                    if (!o.startTime)
                        o.startTime = new Date()
                    o.s.runSec = Math.round((new Date() - o.startTime.getTime())/1000)
                    console.log(1, o.s.runTime, $q)
                    if(o.s.runSec>30){
                        o.save()
                    }
                }
                secToSave(o)
            }, 2000)
        }
        let o = {
            initElEdId: (s) => {
                let o = this
                o.s = s
                o.s.d = d
                o.s.value_1_edit = d.elMap[s.elEdId].value_1_22
                console.log(s.elEdId, d.elMap[s.elEdId], s)
                o.s.cntChange = 0
                secToSave(o)
            },
            save: () => {
                let o = this
                o.s.cntChange = 0
                delete o.startTime
                console.log(o.s.cntChange, o.s.value_1_edit)
            },
            onChange: () => {
                let o = this
                if (toChangeToSave) $timeout.cancel(toChangeToSave)
                toChangeToSave = $timeout(() => {
                    if (d.elMap[o.s.elEdId].value_1_22 != o.s.value_1_edit) {
                        o.s.cntChange++
                        d.elMap[o.s.elEdId].value_1_22 = o.s.value_1_edit
                    }
                    console.log(o.s.cntChange, o.s.value_1_edit == d.elMap[o.s.elEdId].value_1_22)
                }, 500)
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
        controllerAs: 'ctrlEdText',
        scope: { elId: '<elEdId', },
        link: (s, e, a, c) => {
            if (d.conf.$routeParams.el_id == s.elId) {
                s.elEdId = s.elId
                c.edTextFactory.initElEdId(s)
            }
        },
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
}

// app.controller("WikiListController", WikiListController)
class WikiListController extends SqlAbstractController {
    constructor(dataFactory) {
        super(dataFactory)
        if (!this.data) this.readSql(2)
    }
}
app.controller("WikiListController", WikiListController)

// app.controller("SqlController", SqlController)
class SqlController extends SqlAbstractController {
    constructor(dataFactory) {
        super(dataFactory)
        this.simpleSQLs = sql_app.simpleSQLs
        this.simpleSQLselect = 1
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
