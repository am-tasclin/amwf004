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
formData.entry.myNumb = 1234
formData.entry.NewDateProv = new Date()
formData.entry.Nal = -1
formData.entry.val = 'грн'
formData.entry.KassOp = 'за товар'

formData.global = {}
formData.global.firstName = 'ФОП Глобус'
formData.global.lastName = 'Сидоренко М.Н.'
formData.global.n1 = 'insert-kassa.html'
formData.global.n2 = 'table-kassa.html'

formData.seek = {}
formData.seek.StartDateProv = new Date('2021-01-01')
formData.seek.FinishDateProv = new Date('2022-02-02')
formData.seek.PrRasx = 1
formData.seek.SeekLName = ''
formData.seek.post = 'sd'

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


    OK_button_Pr = () =>
    {
        formData.seek.PrRasx = 1
        console.log(formData.seek.PrRasx)
        this.Ok_button()
    }

    OK_button_Rasx = () =>
    {
        formData.seek.PrRasx = 0
        console.log(formData.seek.PrRasx)
        this.Ok_button()
    }




    Ok_button = () => {
        console.log("Ok_button")
        this.dataFactory.httpGetSql({ sql: makeSelect() }).then(rData => {
            this.data = rData
            this.Perechet()
        })

    }

    Perechet = () => {

        this.dataFactory.httpGetSql({ sql: makeSelect('GroupKassa2') + ' GROUP BY NameVal ' }).then(rData => {
            this.SelectGrup = rData
        })
    }

    AddKassa = () => {
        let sql = sql_app.AddKassa_VB.sql.replace(':pr', formData.seek.PrRasx)
            .replace(':Ld1', "'" + formData.entry.NewDateProv.toISOString().split('T')[0] + "'")
            .replace(':ssum', formData.entry.myNumb)
            .replace(':KassOp', "'" + formData.entry.kassop + "'")
            .replace(':NameContr', "'" + formData.entry.selectedItem + "'")
            .replace(':val', "'" + formData.entry.Val + "'")
            .replace(':nal', formData.entry.Nal)
        sql = sql + '; \n\ ' + makeSelect()

        //$http.post('/r/url_sql_read_db1', { sql: sql }         ).then(responce => this.data.list = responce.data.list1)

        this.dataFactory.httpPostSql({ sql: sql }).then(responce =>
            this.rData.list = responce.data.list)

        this.Ok_button()

    }


    DeleteKassa = (a) => {

        let sql = sql_app.DeleteKassa.sql.replace(':LidNom', this.selectedRow.idnom)
        console.log('23456',this.selectedRow.idnom)

        sql = sql + '; \n\ ' + makeSelect()

        this.dataFactory.httpPostSql({ sql: sql }).then(responce =>
            this.data.list = responce.data.list)
            this.Ok_button()
    }
}





const makeSelect = sqlName => {
    if (!sqlName) sqlName = 'SelectKassa'
    let sql = replaceSql(sql_app[sqlName].sql)
    return sql
        .replace(':var.dateProv_start', "'" + formData.seek.StartDateProv.toISOString().split('T')[0] + "'")
        .replace(':var.dateProv_end', "'" + formData.seek.FinishDateProv.toISOString().split('T')[0] + "'")
        .replace(':var.p', formData.seek.PrRasx)

}

console.log()
app.controller('myCtrl', TestControl)