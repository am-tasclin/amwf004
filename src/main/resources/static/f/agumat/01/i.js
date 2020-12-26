var app = angular.module('myApp', ['ngMaterial', 'ngMessages'])
app.config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('pink')
        .accentPalette('orange')
})

app.controller('FloatingLabelCtrl', class {
    constructor($timeout, $q) {
        var ctrl_fl = this

        // list of `state` value/display objects
        ctrl_fl.states = loadAll();
        ctrl_fl.selectedItem = null;
        ctrl_fl.searchText = null;
        console.log(3)
        /**
         * Search for states... use $timeout to simulate
        * remote dataservice call.
        */
        ctrl_fl.querySearch = (query) => {
            var results = query ? ctrl_fl.states.filter(createFilterFor(query)) : ctrl_fl.states;
            var deferred = $q.defer();
            console.log(deferred)
            $timeout(function () { deferred.resolve(results); }, Math.random() * 1000, false);
            return deferred.promise;
        }
    }
})

/**
     * Create filter function for a query string
     */
function createFilterFor(query) {
    var lowercaseQuery = query.toLowerCase();

    return function filterFn(state) {
        return (state.value.indexOf(lowercaseQuery) === 0);
    };

}

function loadAll() {
    var allStates = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware,\
              Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana,\
              Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana,\
              Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina,\
              North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina,\
              South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia,\
              Wisconsin, Wyoming'
    return allStates.split(/, +/g).map(function (state) {
        return {
            value: state.toLowerCase(),
            display: state
        }
    })
}

app.controller('AppCtrl', class {
    constructor() {
        var ctrl_p01 = this
        console.log(2)
        ctrl_p01.imagePath = '/f/img/f2.webp'
    }
})
