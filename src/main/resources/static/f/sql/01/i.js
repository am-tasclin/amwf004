var app = angular.module("app", ['ngRoute']);
app.factory("treeFactory", TreeFactory)
app.factory("dataFactory", DataFactory)

const read_doc_id = 369927
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
        'wiki': { templateUrl: 'wiki.html' },
    }
}


// app.controller("CarePlan001Controller", CarePlan001Controller)
class CarePlan001Controller {
    constructor($scope, treeFactory) {
        $scope.d = d
        $scope.read_doc_id = read_doc_id
        conf.extraReadIds = [
            368794, // CarePlan.activity.plannedActivityReference
        ]
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
app.controller("CarePlan001Controller", CarePlan001Controller)

// app.config(RouteProviderConfig)
class RouteProviderConfig {
    constructor($routeProvider) {
        angular.forEach(conf.singlePagesUrl, (v, k) => {
            $routeProvider.when("/" + k, v)
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
