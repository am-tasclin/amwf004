class RouteProviderConfig {
    constructor($routeProvider) {
        console.log(2, $routeProvider)
        $routeProvider
        .when('/', {
            templateUrl: "02main.html"
        })
        .when("/red", {
            templateUrl: "02red.html"
        })
    }
}

class NamesController {
    constructor() {
        var nc = this
        nc.names = [{
            username: "Nitin"
        }, {
            username: "Mukesh"
        }]
    }
}

var rtApp = angular.module("rtApp", ["ngRoute"]);
console.log(1, rtApp)
rtApp.config(RouteProviderConfig)
rtApp.controller("NamesController", NamesController)
