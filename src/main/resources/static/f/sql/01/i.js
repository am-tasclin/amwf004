var app = angular.module("app", ['ngRoute']);
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

app.factory("treeFactory", TreeFactory)

// app.controller("CarePlan001Controller", CarePlan001Controller)
class CarePlan001Controller {
    constructor($scope, treeFactory) {
        treeFactory.readChildrenDeep(read_doc_id, 2)
        treeFactory.readElement(read_doc_id)
            .then(function (el) {
                treeFactory.readChildren(el.doc_id)
                .then(function(children_ids){
                    angular.forEach(children_ids, function(parent_id){
                        console.log(parent_id)
                        treeFactory.readChildren(parent_id)
                    })
                })
            })
    }
}
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

app.factory("dataFactory", DataFactory)

const sql1 = 'SELECT * FROM doc \n\
LEFT JOIN string ON string_id=doc_id \n\
WHERE 371327 IN (reference2)'

// app.controller("SqlController", SqlController)
class SqlController {
    constructor($scope, dataFactory) {
        console.log(dataFactory)
        if (!$scope.data) {
            dataFactory.httpGet({ sql: sql1 })
                .then(function (data) {
                    $scope.data = data
                    console.log(1, data)
                })
        }
        $scope.x = 2
    }
}
app.controller("SqlController", SqlController)
