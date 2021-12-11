'use strict';
var app = angular.module("app", [])
angular.element(() => angular.bootstrap(document, ['app']))

class List2Controller {
    bloodgroup = bloodgroup
}

class List1Controller extends List2Controller {
    constructor() { super() }
    seek = 'sl1'
}
app.controller('L1Ctrl', List1Controller)
app.controller('L2Ctrl', List2Controller)

// to tutorial 2
const bloodgroup = {
    list: [
        { "Id": "1", "Name": "O+" },
        { "Id": "2", "Name": "O-" },
        { "Id": "3", "Name": "A+" },
        { "Id": "4", "Name": "A-" },
        { "Id": "5", "Name": "B+" },
        { "Id": "6", "Name": "B-" },
        { "Id": "7", "Name": "AB+" },
        { "Id": "8", "Name": "AB-" }],
    value: '8',
}
console.log(bloodgroup)

