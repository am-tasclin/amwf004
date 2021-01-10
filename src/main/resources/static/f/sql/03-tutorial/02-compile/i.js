'use strict'
var app = angular.module('app', [], function ($compileProvider) {
    // Configure new 'compile' directive by passing a directive
    // factory function. The factory function injects '$compile'.
    $compileProvider.directive('compile', ($compile) => {
        // The directive factory creates a link function.
        return {
            // transclude: true,
            link: (scope, e, a) => {
                scope.$watch(
                    (scope) => {
                        // Watch the 'compile' expression for changes.
                        console.log(scope, a.compile, scope.$eval(a.compile))
                        return scope.$eval(a.compile)
                    },
                    (value) => {
                        console.log(2, value)
                        // When the 'compile' expression changes
                        // assign it into the current DOM.
                        e.html(value)

                        // Compile the new DOM and link it to the current scope.
                        // NOTE: we only compile '.childNodes' so that we
                        // don't get into an infinite loop compiling ourselves.
                        $compile(e.contents())(scope)
                    }
                )
            }
        }
    })
})
angular.element(() => angular.bootstrap(document, ['app']))
app.controller('ExampleController', ['$scope', ($scope) => {
    $scope.name = 'AngularJS'
    $scope.x = 2
    $scope.y = 2
    $scope.html = 'Hello {{name}}'
}])

function createDirective(name) {
    return function () {
        return {
            restrict: 'E',
            transclude:true,
            template: '<span ng-transclude></span>',
            compile: (tElem, tAttrs) =>{
                console.log(name + ': compile', tElem.html().toString());
                return {
                    pre: function (scope, iElem, iAttrs) {
                        console.log(name + ': pre link', iElem.html().toString());
                    },
                    post: function (scope, iElem, iAttrs) {
                        console.log(name + ': post link', iElem.html().toString());
                    },
                }
            },
        }
    }
}

app.directive('levelOne', createDirective('levelOne'));
app.directive('levelTwo', createDirective('levelTwo'));
app.directive('levelThree', createDirective('levelThree'));

