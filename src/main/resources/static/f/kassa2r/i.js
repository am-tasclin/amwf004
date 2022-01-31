'use strict';
//var app = angular.module('myApp', []); // see lib-init.js
app.directive('amSqlHtml', AmSqlHtml)
app.config(RouteProviderConfig)
app.factory("dataFactory", RWDataFactory)

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

let formData = {}

formData.entry = {}
formData.entry.LName = 'Iванов'
formData.entry.myNumb = 155
formData.entry.NewDateProv = new Date()
formData.entry.Nal = -1
formData.entry.SNal = ''
formData.entry.Val = -1
formData.entry.SVal = ''
formData.entry.KassOp = 'за товар'

formData.global = {}
formData.global.firstName = 'ФОП- Глобус'
formData.global.lastName = 'Сидоренко М.Н.'
formData.global.n1 = 'insert-kassa.html'
formData.global.n2 = 'table-kassa.html'

formData.seek = {}
formData.seek.StartDateProv = new Date('2021-01-01')
formData.seek.FinishDateProv = new Date('2022-02-02')
formData.seek.PrRasx = 1
formData.seek.SeekLName = ''
formData.seek.post = 'sd'
formData.seek.selectgroup = 'idNom'

conf.sqlKeyName = 'SelectKassa'

class TestControl {
    constructor($http, dataFactory) {
        this.dataFactory = dataFactory
        this.$http = $http

        console.log(dataFactory)
        this.bloodgroup = {
            list: [],
            value: '8',
            clickCount: 0,
        }
        this.listop = this.bloodgroup

        let ctrl = this
        let sql = makeSelect('SpContragents')
        dataFactory.httpGetSql({ sql: sql }).then(rData => {
            ctrl.bloodgroup = rData
            console.log(ctrl.bloodgroup)
        })
        this.BloodGroup_List = ctrl.bloodgroup.list

        sql = makeSelect('SpKassOp')
        dataFactory.httpGetSql({ sql: sql }).then(rData => {
            ctrl.listop = rData
            console.log(this.listop)
        })

        //Cправочник валют
        sql = "SELECT IdNomVal, NameVal FROM kassa.SpValut"
        dataFactory.httpGetSql({ sql: sql }).then(rData => {
            ctrl.listVal = rData
            console.log(this.listVal)
        })


        this.click_spcontragent_seek = (selectName) => {
            this.iewList = true
            selectName = 'SpContragents'
            let sql = sql_app[selectName].sql
            sql += ' WHERE namecontr LIKE (\'%' + formData.seek.SeekLName + '%\')' + sql_app[selectName].order
            this.dataFactory.httpGetSql({ sql: sql }
            ).then(responceData => {
                this.dataSeek = responceData
            })
        }

        this.click_kassop_seek = () => {
            this.iewList = true
            let sql = sql_app.SpKassOp.sql
            sql += ' WHERE NameKassOp LIKE (\'%' + formData.entry.KassOp + '%\')' + sql_app.SpKassOp.order
            this.dataFactory.httpGetSql({ sql: sql }
            ).then(responceData => {
                this.dataSeek = responceData
            })
        }

        this.formData = formData
        this.selectRow = row => this.selectedRow = row

        this.Seek_button_Lname = () => {
            let sql = makeSelect() +
                ' AND (namecontr) LIKE (\'%' + formData.seek.SeekLName + '%\')'
            console.log(sql)
            $http.get('/r/url_sql_read_db1', { params: { sql: sql } }
            ).then(responce => {
                this.data = responce.data
            })
        }

        this.Ok_button()

    }

    getSql = sqlName => sql_app[sqlName]

    OK_button_Pr = () => {
        formData.seek.PrRasx = 1
        this.Ok_button()
    }

    OK_button_Rasx = () => {
        formData.seek.PrRasx = 0
        this.Ok_button()
    }

    Ok_button = () => {
        console.log("Ok_button")
        let sql = makeSelect()
        let sqlDist = sql_app.SelectKassa.dist
        sqlDist = sqlDist
            .replace(':var.dateProv_start', "'" + formData.seek.StartDateProv.toISOString().split('T')[0] + "'")
            .replace(':var.dateProv_end', "'" + formData.seek.FinishDateProv.toISOString().split('T')[0] + "'")
            .replace(':var.p', formData.seek.PrRasx)

        sql += '; ' + makeSelect('GroupKassa2') + ' GROUP BY NameVal '
        console.log(sql)

        sql += '; ' + sqlDist

        this.dataFactory.httpPostSql({ sql: sql }).then(rData => {
            if (!this.data) this.data = {}
            if (!this.SelectGroup) this.SelectGroup = {}
            if (!this.poisk) this.poisk = {}

            this.data.list = rData.list0
            this.SelectGroup.list = rData.list1
            this.poisk.list = rData.list2

            console.log('zzzz', rData.list2)

        })
    }


    Snal = () => { formData.entry.SNal = "нал" }
    SBeznal = () => { formData.entry.SNal = "Безнал" }

    AddKassa = () => {

        let sql = sql_app.AddKassa_VB.sql.replace(':pr', formData.seek.PrRasx)
            .replace(':Ld1', "'" + formData.entry.NewDateProv.toISOString().split('T')[0] + "'")
            .replace(':ssum', formData.entry.myNumb)
            .replace(':KassOp', "'" + formData.entry.kassop + "'")
            .replace(':NameContr', "'" + formData.entry.selectedItem + "'")
            .replace(':sval', "'" + formData.entry.SVal + "'")
            .replace(':svalz', "'" + formData.entry.SVal + "'")
            .replace(':nal', formData.entry.Nal)
            .replace(':snal', "'" + formData.entry.SNal + "'")

        this.dataFactory.httpPostSql({ sql: sql }).then(responce => {
            console.log(responce)
            this.data.list = responce.list1

            this.Ok_button()
        })
    }

    Seek_post = () => {
        console.log('Seek')
    }


    DeleteKassa = (a) => {

        let sql = sql_app.DeleteKassa.sql.replace(':LidNom', this.selectedRow.idnom)
        console.log('23456', this.selectedRow.idnom)

        sql = sql + '; \n\ ' + makeSelect()

        this.dataFactory.httpPostSql({ sql: sql }).then(responce => {
            console.log(responce)
            this.data.list = responce.list1
            this.Ok_button()
        })
    }

    SortSelect = (sortColumnName) => {

        if (sql_app.SelectKassa.sortColumnName != sortColumnName) {
            sql_app.SelectKassa.sortColumnName = sortColumnName
            sql_app.SelectKassa.ascDesc = null
        }

        if (sql_app.SelectKassa.sortColumnName == sortColumnName) {
            if (sql_app.SelectKassa.ascDesc == null)
                sql_app.SelectKassa.ascDesc = "DESC"
            else if (sql_app.SelectKassa.ascDesc == "DESC")
                sql_app.SelectKassa.ascDesc = " "
            else sql_app.SelectKassa.ascDesc = null
        }

        console.log('B1', sortColumnName, sql_app.SelectKassa.sortColumnName, sql_app.SelectKassa.ascDesc)

        formData.seek.selectgroup = sortColumnName
        this.Ok_button()
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


app.controller('myCtrl', TestControl)