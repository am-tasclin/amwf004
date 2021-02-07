console.log(1)
'use strict';
var app = angular.module("app", ['ngRoute', 'ngResource', 'ngSanitize']);
angular.element(() => angular.bootstrap(document, ['app']))
conf.fr = {
    cp: {
        frn: 'CarePlan'
    },
    mr: {
        frn: 'MedicationRequest',
        children: ['mn'],
    },
    mn: {
        frn: 'Medication',
        children: ['ro', 'qy'],
    },
    se: {
        frn: 'Substance'
    },
    ro: {
        frn: 'Ratio'
    },
    qy: {
        frn: 'Quantity'
    },
}

// app.controller("ResourceFHIRController", ResourceFHIRController)
class ResourceFHIRController extends AbstractController {
    constructor($scope, $routeParams) {
        super()
        console.log(1, this.singlePageUrl(), this.singlePageUrl().split('/'))
    }
}
app.controller("ResourceFHIRController", ResourceFHIRController)

// app.config(RouteProviderConfig)
class RouteProviderConfig {
    constructor($routeProvider) {
        let rpo = {
            templateUrl: 'ResourceFHIR.html',
            controller: 'ResourceFHIRController',
            controllerAs: 'ctrl',
        }
        angular.forEach(conf.fr, (v, k) => {
            $routeProvider.when("/" + k, rpo)
            angular.forEach(conf.fr[k].children, (k2) => {
                let k12 = k + '/' + k2
                console.log(2, k12)
                $routeProvider.when("/" + k12, rpo)
            })
            if (k == 'mn') {
                let kElId = k + '_:el_id'
                console.log(k, kElId)
                $routeProvider.when("/" + kElId, rpo)
            }
        })
    }
}
app.config(RouteProviderConfig)

// app.controller("FirstController", FirstController)
class FirstController extends AbstractController {
    constructor($scope, $route) {
        super()
        console.log(1, $route.routes, this.singlePageUrl())
        $scope.conf = conf
    }
}
app.controller("FirstController", FirstController)
