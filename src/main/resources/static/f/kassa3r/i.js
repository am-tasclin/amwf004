'use strict';
//var app = angular.module('myApp', []); // see lib-init.js
app.directive('amSqlHtml', AmSqlHtml)
app.config(RouteProviderConfig)

let formData = {}

formData.entry = {}
formData.entry.LName = 'Iванов'
formData.entry.myNumb = 1234
formData.entry.NewDateProv = new Date()
formData.entry.Nal = -1
formData.entry.val = 'грн'
formData.entry.KassOp = 'за товар'

formData.global = {}
formData.global.firstName = 'ФОП Глобус'
formData.global.lastName = 'Сидоренко М.Н.'
formData.global.n1 = '/f/kassa2r/insert-kassa.html'
formData.global.n2 = '/f/kassa2r/table-kassa.html'

formData.seek = {}
formData.seek.StartDateProv = new Date('2021-01-01')
formData.seek.FinishDateProv = new Date('2022-02-02')
formData.seek.PrRasx = 1
formData.seek.SeekLName = ''

conf.sqlKeyName = 'SelectKassa'
console.log(formData.global.firstName)

class TestControl {
    constructor(dataFactory) {

        // to tutorial 2
        this.bloodgroup = bloodgroup

        this.formData = formData
        this.selectRow = row => this.selectedRow = row

        this.Seek_button_Lname = () => {
            let sql = makeSelect() +
                ' AND lower(namecontr) LIKE lower(\'%' + formData.seek.SeekLName + '%\')'
            console.log(sql)

            dataFactory.httpGetSql({ sql: sql })
                .then(responceData => this.data = responceData)

        }

        this.AddKassa = () => {
            let sql = sql_app.AddKassa_VB.sql.replace(':pr', formData.seek.PrRasx)
                .replace(':Ld1', "'" + formData.entry.NewDateProv.toISOString().split('T')[0] + "'")
                .replace(':ssum', formData.entry.myNumb)
                .replace(':KassOp', "'" + formData.entry.KassOp + "'")
                .replace(':NameContr', "'" + formData.entry.LName + "'")
                .replace(':val', "'" + formData.entry.val + "'")
                .replace(':nal', formData.entry.Nal)

            sql = sql + '; \n\ ' + makeSelect()
            console.log(sql)

            dataFactory.httpPostSql({ sql: sql })
                .then(responceData => this.data.list = responceData.list1)
        }

        this.DeleteKassa = () => {
            console.log("DeleteKassa", this.selectedRow.idnom)
            let sql = sql_app.DeleteKassa.sql.replace(':LidNom', this.selectedRow.idnom)
            sql = sql + '; \n\ ' + makeSelect()

            console.log(sql)

            dataFactory.httpPostSql({ sql: sql })
                .then(responceData => this.data.list = responceData.list1)
        }

        this.Perechet = () =>
            dataFactory.httpGetSql({ sql: makeSelect('GroupKassa2') })
                .then(responceData => this.SelectGrup = responceData.list[0])

        this.Ok_button = () =>
            dataFactory.httpGetSql({ sql: makeSelect() })
                .then(responceData => this.data = responceData)

        this.Ok_button()
    }
}

class RWDataFactory {
    constructor($http, $q) { this.$http = $http; this.$q = $q }
    urlSql = '/r/url_sql_read_db1'
    sqlRowLimit = 50

    httpPostSql = params => {
        let deferred = this.$q.defer()

        this.$http.post(this.urlSql, params)
            .then(response => deferred.resolve(response.data))

        return deferred.promise
    }

    httpGetSql = params => {
        let deferred = this.$q.defer()
        if (params.limit) sqlRowLimit = params.limit
        params.sql = params.sql + ' LIMIT ' + this.sqlRowLimit

        this.$http.get(this.urlSql, { params: params }
        ).then(response => deferred.resolve(response.data)
            , response => console.error(response.status)
        )

        return deferred.promise
    }
    // deferred.reject(response.status)
    // https://metanit.com/web/angular/3.3.php

}

const makeSelect = sqlName => {
    if (!sqlName) sqlName = 'SelectKassa'
    let sql = replaceSql(sql_app[sqlName].sql)
    return sql
        .replace(':d1', "'" + formData.seek.StartDateProv.toISOString().split('T')[0] + "'")
        .replace(':d2', "'" + formData.seek.FinishDateProv.toISOString().split('T')[0] + "'")
        .replace(':p', formData.seek.PrRasx)
}

// Get sql from our name
const readSql2R = sqlN => replaceSql(sql_app[sqlN].sql)
// Named structured SQL to native SQL
const replaceSql = sql => {
    while (sql.includes(':sql_app.')) {
        let sql_name = sql.split(':sql_app.')[1].split(' ')[0]
        let sql_inner = readSql2R(sql_name)
        sql = sql.replace(':sql_app.' + sql_name, sql_inner)
    }
    return '' + sql
}

app.factory("dataFactory", RWDataFactory)
app.controller('myCtrl', TestControl)

// to tutorial 1
singlePage.lr = {
    templateUrl: 'lr.html',
    controller: 'LRLController',
}
singlePage.rl = {
    templateUrl: 'rl.html',
    controller: 'LRLController',
}

class LRLController extends AbstractController {
    constructor($scope, $route, $routeParams) {
        super()
        console.log(123)
    }
}
app.controller("LRLController", LRLController)

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
