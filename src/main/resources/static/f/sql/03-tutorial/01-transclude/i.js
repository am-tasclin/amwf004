'use strict';
var app = angular.module('docsAgjsExample', [])
angular.element(() => angular.bootstrap(document, ['docsAgjsExample']))

app.controller('ExampleController', ['$scope', ($scope) => {
    $scope.title = 'Lorem Ipsum'
    $scope.text = 'Neque porro quisquam est qui dolorem ipsum quia dolor...'
    $scope.customer = {
        name: 'Naomi',
        address: '1600 Amphitheatre'
    }
    $scope.naomi = { name: 'Naomi', address: '1600 Amphitheatre' };
    $scope.igor = { name: 'Igor', address: '123 Somewhere' };
    $scope.format = 'M/d/yy h:mm:ss a';
    // console.log($scope)
}])

app.directive('pane', () => {
    return {
        restrict: 'A',
        transclude: true,
        scope: { title: '@' },
        templateUrl: 'pane.html'
    }
})

app.directive('myCustomer', () => {
    return {
        restrict: 'A',
        templateUrl: (e, attr) => {
            // console.log(e, attr)
            return 'customer-' + attr.myCustomer + '.html'
        }
    }
})

app.directive('myCustomer2', () => {
    return {
        restrict: 'A',
        scope: {
            customerInfo: '=info'
        },
        templateUrl: 'my-customer2-iso.html'
    }
})

app.directive('myCurrentTime', ['$interval', 'dateFilter', ($interval, dateFilter) => {
    let link = ($scope, element, attrs) => {
        var format, timeoutId
        let updateTime = () => element.text(dateFilter(new Date(), format))
        $scope.$watch(attrs.myCurrentTime, (value) => {
            format = value
            updateTime()
        })
        element.on('$destroy', () => $interval.cancel(timeoutId))
        timeoutId = $interval(() => updateTime(), 1330)
    }
    return {
        restrict: 'A',
        link: link,
    }
}])

class My03TabsController {
    constructor($scope) {
        var panes = $scope.panes = []
        $scope.select = (pane) => {
            angular.forEach(panes, (pane) => pane.selected = false)
            pane.selected = true
        }
        this.addPane = (pane) => {
            if (panes.length === 0) $scope.select(pane)
            panes.push(pane);
        }
        console.log($scope.panes)
    }
}

app.directive('my03Tabs', () => {
    return {
        restrict: 'A',
        transclude: true,
        scope: {},
        controller: ['$scope', My03TabsController],
        templateUrl: '03/my-tabs.html'
    }
})

app.directive('my03Pane', () => {
    return {
        restrict: 'A',
        transclude: true,
        scope: {
            title: '@'
        },
        require: '^^my03Tabs',
        link: ($scope, e, a, tabsCtrl) => {
            console.log($scope)
            tabsCtrl.addPane($scope)
        },
        templateUrl: '03/my-pane.html',
    }
})
