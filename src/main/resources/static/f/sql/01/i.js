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
        conf.extraReadIds = [368794]
        conf.readExtra = function (el) {
            if(conf.extraReadIds.indexOf(el.reference)>=0){
                console.log(el.doc_id, el.reference, conf.extraReadIds.indexOf(el.reference))
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

const sql1 = 'SELECT * FROM doc \n\
LEFT JOIN string ON string_id=doc_id \n\
WHERE 371327 IN (reference2)'

// app.controller("SqlController", SqlController)
class SqlController {
    constructor($scope, dataFactory) {
        console.log(dataFactory)
        if (!$scope.data) {
            dataFactory.httpGet({ sql: sql1 })
                .then((data) => {
                    $scope.data = data
                    console.log(1, data)
                })
        }
        $scope.x = 2
    }
}
app.controller("SqlController", SqlController)
