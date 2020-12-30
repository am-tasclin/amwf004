var rtApp = angular.module("rtApp", ["ngRoute"]);
// rtApp.config(RouteProviderConfig)
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
rtApp.config(RouteProviderConfig)

// rtApp.controller("NamesController", NamesController)
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
rtApp.controller("NamesController", NamesController)

console.log(1, rtApp)
console.log(2, window.localStorage)
