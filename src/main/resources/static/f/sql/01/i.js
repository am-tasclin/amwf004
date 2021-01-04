var app = angular.module("app", ['ngRoute', 'ngSanitize']);
app.factory("treeFactory", TreeFactory)
app.factory("dataFactory", DataFactory)

const conf = {
    singlePagesUrl: {
        'sql': {
            templateUrl: 'sql.html',
            controller: 'SqlController'
        },
        'carePlan001': {
            templateUrl: 'carePlan001.html',
            controller: 'CarePlan001Controller'
        },
        'carePlan002Rest': {
            templateUrl: 'carePlan001.html',
            controller: 'CarePlan002RestController'
        },
        'wiki': {
            templateUrl: 'wiki.html',
            controller: 'Wiki001Controller'
        },
    }
}

const read_wiki_id = 371357
// app.controller("Wiki001Controller", Wiki001Controller)
class Wiki001Controller {
    constructor($scope, treeFactory) {
        console.log(read_wiki_id)
        $scope.d = d
        $scope.markdownInLine = markdownInLine
        $scope.read_wiki_id = read_wiki_id
        treeFactory.readElement(read_wiki_id)
            .then((el) => treeFactory.readChildrenDeep([el.doc_id], 3))

        treeFactory.dataFactory.httpGetRest('/r/adn/el/' + read_wiki_id)
            .then((data) => {
                console.log(data.doc_id, data.sqlName, data.list)
            })
    }
}
app.controller("Wiki001Controller", Wiki001Controller)

const read_doc_id = 369927
// app.controller("CarePlan001Controller", CarePlan001Controller)
class CarePlan000AbstractController {
    constructor($scope) {
        $scope.d = d
        $scope.read_doc_id = read_doc_id
        conf.extraReadIds = [
            368794, // CarePlan.activity.plannedActivityReference
        ]
    }
    init($scope, treeFactory, ctrl) {
        $scope.ctrl = ctrl
        console.log($scope.ctrl.constructor.name, 1)
        conf.readExtra = (el) => {
            if (conf.extraReadIds.indexOf(el.reference) >= 0) {
                console.log(el.doc_id, el.reference, conf.extraReadIds.indexOf(el.reference))
                console.log(el.reference2,)
                treeFactory.readElement(el.reference2)
                    .then((el) => treeFactory.readChildrenDeep([el.doc_id], 3))
            }
        }
        treeFactory.readElement(read_doc_id)
            .then((el) => treeFactory.readChildrenDeep([el.doc_id], 3))
    }
}
// app.controller("CarePlan002RestController", CarePlan002RestController)
class CarePlan002RestController extends CarePlan000AbstractController {
    constructor($scope, treeFactory) {
        super($scope)
        conf.getListChildren = 'getListChildrenRest'
        this.init($scope, treeFactory, this)
    }
}
app.controller("CarePlan002RestController", CarePlan002RestController)

// app.controller("CarePlan001Controller", CarePlan001Controller)
class CarePlan001Controller extends CarePlan000AbstractController {
    constructor($scope, treeFactory) {
        super($scope)
        conf.getListChildren = 'getListChildrenSql'
        this.init($scope, treeFactory, this)
    }
}
app.controller("CarePlan001Controller", CarePlan001Controller)

/**
 * 
 return
 treeFactory.readChildren(el.doc_id)
     .then((children_ids) => {
         angular.forEach(children_ids, (parent_id) => {
             console.log(parent_id)
             treeFactory.readChildren(parent_id)
         })
     })
*/

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
        $scope.conf = conf
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
    WHERE 369789 in (reference)'
    },
]

// app.controller("SqlController", SqlController)
class SqlController {
    constructor($scope, dataFactory) {
        let readSql = (sqlN) => {
            $scope.simpleSQLselect = sqlN
            console.log(sqlN, sql_app.simpleSQLs[sqlN].c)
            dataFactory.httpGet({ sql: sql_app.simpleSQLs[sqlN].c })
                .then((dataSqlRequest) => {
                    $scope.data = dataSqlRequest
                    console.log(1, dataSqlRequest)
                })

        }
        $scope.readSql = readSql
        $scope.simpleSQLs = sql_app.simpleSQLs
        $scope.simpleSQLselect = 1
        if (!$scope.data) readSql($scope.simpleSQLselect)
    }
}
app.controller("SqlController", SqlController)

