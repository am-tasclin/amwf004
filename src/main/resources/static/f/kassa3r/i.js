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
    // to tutorial 2
    bloodgroup = bloodgroup
    formData = formData

    constructor(dataFactory) {
        this.dataFactory = dataFactory
        this.Ok_button()
    }

    selectRow = row => this.selectedRow = row

    Seek_button_Lname = () => {
        let sql = makeSelect() +
            ' AND lower(namecontr) LIKE lower(\'%' + formData.seek.SeekLName + '%\')'
        console.log(sql)

        this.Ok_button(sql)
    }

    AddKassa = () => {
        let sql = sql_app.AddKassa_VB.sql.replace(':pr', formData.seek.PrRasx)
            .replace(':Ld1', "'" + formData.entry.NewDateProv.toISOString().split('T')[0] + "'")
            .replace(':ssum', formData.entry.myNumb)
            .replace(':KassOp', "'" + formData.entry.KassOp + "'")
            .replace(':NameContr', "'" + formData.entry.LName + "'")
            .replace(':val', "'" + formData.entry.val + "'")
            .replace(':nal', formData.entry.Nal)

        sql = sql + '; \n\ ' + makeSelect()
        console.log(sql)

        this.dataFactory.httpPostSql({ sql: sql }
        ).then(responceData => this.data.list = responceData.list1)
    }

    DeleteKassa = () => {
        console.log("DeleteKassa", this.selectedRow.idnom)
        let sql = sql_app.DeleteKassa.sql.replace(':LidNom', this.selectedRow.idnom)
        sql = sql + '; \n\ ' + makeSelect()

        console.log(sql)

        this.dataFactory.httpPostSql({ sql: sql }
        ).then(responceData => this.data.list = responceData.list1)
    }

    Perechet = () =>
        this.dataFactory.httpGetSql({ sql: makeSelect('GroupKassa2') }
        ).then(responceData => this.SelectGrup = responceData.list[0])

    Ok_button = sql => {
        if (!sql) sql = makeSelect()

        this.dataFactory.httpGetSql({ sql: sql }
        ).then(responceData => this.data = responceData)
    }

}

const makeSelect = sqlName => {

    if (!sqlName) sqlName = 'SelectKassa'
    //let sql = replaceSql(sql_app[sqlName].sql + sql_app[sqlName].order)
    let sql = replaceSql(sql_app[sqlName].sql)

    sql = sql
        .replace(':var.dateProv_start', "'" + formData.seek.StartDateProv.toISOString().split('T')[0] + "'")
        .replace(':var.dateProv_end', "'" + formData.seek.FinishDateProv.toISOString().split('T')[0] + "'")
        .replace(':var.p', formData.seek.PrRasx)
    //        .replace(':var.or', formData.seek.selectgroup)


    if (sql_app[sqlName].sortColumnName)
        if (sql_app.SelectKassa.ascDesc == null)
            sql += '   '
        else sql += ' ORDER BY ' + sql_app[sqlName].sortColumnName + ' ' + sql_app[sqlName].ascDesc



    return sql

}

const makeSelectDumm = sqlName => {
    if (!sqlName) sqlName = 'SelectKassa'
    let sql = replaceSql(sql_app[sqlName].sql)
    return sql
        .replace(':d1', "'" + formData.seek.StartDateProv.toISOString().split('T')[0] + "'")
        .replace(':d2', "'" + formData.seek.FinishDateProv.toISOString().split('T')[0] + "'")
        .replace(':p', formData.seek.PrRasx)
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
