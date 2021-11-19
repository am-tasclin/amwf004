'use strict';
var app = angular.module("app", [])
angular.element(() => angular.bootstrap(document, ['app']))

// not for $scope
const sql_app = {}
// for|as $scope
const conf = {}/* conf page|app|content */

class AmSqlHtml {
    constructor($compile) {
        this.link = (s, e) => {
            let sqlE = sql_app[conf.sqlKeyName]
            if (sqlE.sqlHtml)
                if (sqlE.sqlHtml[s.k] != null) {
                    e.html(sqlE.sqlHtml[s.k])
                    $compile(e.contents())(s)
                }
        }
    }
    restrict = 'A'
}
