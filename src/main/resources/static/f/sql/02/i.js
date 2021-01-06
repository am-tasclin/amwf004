// Instantiate the app, the 'myApp' parameter must match what is in ng-app
// Source:
// https://embed.plnkr.co/plunk/DNFp0b
var myApp = angular.module('myApp', ['ngRoute', 'ngResource'])

/**
 * This is the configuration for the routes
 * Maps a URL fragment to a template and controller
 */
myApp.config(function ($routeProvider) {
    $routeProvider.
        when('/adults', {
            templateUrl: 'adult-list.html',
            controller: 'PersonCtrl'
        }).
        when('/adults/:adultId', {
            templateUrl: 'adult-detail.html',
            controller: 'PersonDetailCtrl'
        }).
        otherwise({
            redirectTo: '/adults'
        })
})

/**
 * Adult is a service that calls a REST API
 * It's not really a REST API, but just calling our local .json file as an example
 * If you call Adult.query(), it will GET adults.json
 * If you call Adult.get({}, {aid: 1}) it will GET adults/1.json
 */
myApp.factory('Adult', function ($resource) {
    return $resource('adults/:adultId.json', { adultId: '@aid' })
})

/**
 * Create the controller that lists
 * Using route it is hooked into DOM using ng-view directive
 */
myApp.controller('PersonCtrl', function ($scope, Adult) {
    $scope.adults = Adult.query()
})

/**
 * Create the controller for the detail view
 * Using route it is hooked into DOM using ng-view directive
 */
myApp.controller('PersonDetailCtrl', function ($scope, $routeParams, Adult) {
    $scope.adultId = $routeParams.adultId
    $scope.adult = Adult.get({ adultId: $routeParams.adultId })

    $scope.saveAdult = function (adult) {
        adult.$save()
    }

})