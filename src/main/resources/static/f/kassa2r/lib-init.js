'use strict';
var app = angular.module("app", ['ngRoute'])
angular.element(() => angular.bootstrap(document, ['app']))

// not for $scope
const sql_app = {}
// for|as $scope
const singlePage = {}/* $route fn */
    , conf = {}/* conf page|app|content */
class AbstractController { singlePage = singlePage; conf = conf; getSql = sqlName => sql_app[sqlName] }

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
