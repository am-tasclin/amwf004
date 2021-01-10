'use strict';
var app = angular.module("app", ['ngRoute', 'ngResource', 'ngSanitize']);
angular.element(() => angular.bootstrap(document, ['app']))
app.factory("dataFactory", DataFactory)
app.factory("treeFactory", TreeFactory)
app.factory("Wiki", Wiki)

const conf = {
    singlePagesUrl: {
        sql: {
            templateUrl: 'sql1.html',
            controller: 'SqlController',
            controllerAs: '$ctrl',
        },
        carePlan001: {
            templateUrl: 'carePlan001.html',
            controller: 'CarePlan001Controller'
        },
        carePlan002Rest: {
            templateUrl: 'carePlan001.html',
            controller: 'CarePlan002RestController'
        },
        wiki: {
            templateUrl: 'wiki.html',
            controller: 'Wiki001Controller'
        },
        wiki003Rest: {
            templateUrl: 'wiki.html',
            controller: 'Wiki003RestController'
        },
        'wiki004Rest/:doc_id': {
            templateUrl: 'wiki.html',
            controller: 'Wiki004RestController'
        },
        'wiki005Rest/:doc_id': {
            templateUrl: 'wiki.html',
            controller: 'Wiki005RestController'
        },
        'wiki005Rest/:doc_id/:el_id': {
            templateUrl: 'wiki.html',
            controller: 'Wiki005RestController'
        },
        wikiList: {
            templateUrl: 'wikiList.html',
            controller: 'WikiListController'
        },
    }
}

const read_wiki_id = 371357
class Wiki000AbstractController {
    constructor($scope) {
        $scope.d = d
        $scope.markdownInLine = markdownInLine
        $scope.read_wiki_id = read_wiki_id
    }
    setWiki = (data) => {
        console.log(data.elMap, data.clList)
        d.elMap = data.elMap
        d.clList = data.clList
    }
}

// app.controller("Wiki005RestController", Wiki005RestController)
class Wiki005RestController extends Wiki000AbstractController {
    constructor($scope, $routeParams, Wiki) {
        super($scope)
        d.conf.read_wiki_id = $scope.read_wiki_id = $routeParams.doc_id
        console.log($scope.read_wiki_id)
        Wiki.get({ doc_id: $scope.read_wiki_id }).$promise.then(this.setWiki);
    }
}
app.controller("Wiki005RestController", Wiki005RestController)

// app.controller("Wiki004RestController", Wiki004RestController)
class Wiki004RestController extends Wiki000AbstractController {
    constructor($scope, $routeParams, dataFactory) {
        super($scope)
        $scope.read_wiki_id = $routeParams.doc_id
        console.log($scope.read_wiki_id)
        dataFactory.httpGetRest('/r/adn/d/' + $scope.read_wiki_id).then(this.setWiki)
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
class CarePlan000AbstractController {
    constructor($scope) {
        this.scope = $scope
        $scope.d = d
        $scope.read_doc_id = read_doc_id
        conf.extraReadIds = [
            368794, // CarePlan.activity.plannedActivityReference
        ]
    }
    scope
    init(treeFactory, ctrl) {
        this.scope.ctrl = ctrl
        console.log(this.scope.ctrl.constructor.name, 1)
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

// app.config(RouteProviderConfig)
class RouteProviderConfig {
    constructor($routeProvider) {
        angular.forEach(conf.singlePagesUrl, (v, k) => {
            $routeProvider.when("/" + k, v)
        })
        $routeProvider.otherwise({
            redirectTo: '/wiki'
        })
    }
}
app.config(RouteProviderConfig)

// app.controller("FirstController", FirstController)
class FirstController {
    constructor($scope, $http) {
        // $scope.conf = conf
        $scope.dConf = d.conf
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

class SqlAbstractController {
    scope
    dataFactory
    constructor($scope, dataFactory) {
        this.scope = $scope
        this.dataFactory = dataFactory
    }
    readSql = (sqlN) => {
        let scope = this.scope
        sql_app.simpleSQLselect = scope.simpleSQLselect = sqlN
        console.log(sqlN, sql_app.simpleSQLs[sqlN].c)
        this.dataFactory.httpGet({ sql: sql_app.simpleSQLs[sqlN].c })
            .then((dataSqlRequest) => {
                scope.data = dataSqlRequest
                console.log(1, dataSqlRequest)
            })
    }
}

app.directive('amSqlHtml', ($compile) => {
    return {
        restrict: 'A',
        link: (s, e) => {
            let sqlE = sql_app.simpleSQLs[sql_app.simpleSQLselect]
            if (sqlE.sqlHtml) {
                if (sqlE.sqlHtml[s.k]!=null) {
                    e.html(sqlE.sqlHtml[s.k])
                    $compile(e.contents())(s)
                }
            }
        },
    }
})

// app.controller("WikiListController", WikiListController)
class WikiListController extends SqlAbstractController {
    constructor($scope, dataFactory) {
        super($scope, dataFactory)
        $scope.wikiListConf = 1
        if (!$scope.data) this.readSql(2)
    }
}
app.controller("WikiListController", WikiListController)

// app.controller("SqlController", SqlController)
class SqlController extends SqlAbstractController {
    constructor($scope, dataFactory) {
        super($scope, dataFactory)
        $scope.readSql = this.readSql
        $scope.simpleSQLs = sql_app.simpleSQLs
        $scope.simpleSQLselect = 1
        if (!$scope.data) this.readSql($scope.simpleSQLselect)
        this.tut = 'tutorial links'
    }
}
app.controller("SqlController", SqlController)
