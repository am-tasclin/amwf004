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



        this.click_spcontragent_seek = () => {
            this.iewList = true
            let sql = sql_app.SpContragents.sql
            sql += ' WHERE namecontr LIKE (\'%' + formData.seek.SeekLName + '%\')' + sql_app.SpContragents.order
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

        this.AddKassa = () => {
            let sql = sql_app.AddKassa_VB.sql.replace(':pr', formData.seek.PrRasx)
                .replace(':Ld1', "'" + formData.entry.NewDateProv.toISOString().split('T')[0] + "'")
                .replace(':ssum', formData.entry.myNumb)
                .replace(':KassOp', "'" + formData.entry.kassop + "'")
                .replace(':NameContr', "'" + formData.entry.selectedItem + "'")
                .replace(':val', "'" + formData.entry.val + "'")
                .replace(':nal', formData.entry.Nal)

            sql = sql + '; \n\ ' + makeSelect()
            console.log(sql)

            $http.post('/r/url_sql_read_db1', { sql: sql }
            ).then(responce => this.data.list = responce.data.list1)
        }

        this.DeleteKassa = (a) => {
            console.log("DeleteKassa", this.selectedRow.idnom)
            let sql = sql_app.DeleteKassa.sql.replace(':LidNom', this.selectedRow.idnom)
            sql = sql + '; \n\ ' + makeSelect()

            console.log(sql)
            $http.post('/r/url_sql_read_db1', { sql: sql }
            ).then(responce => {
                console.log(responce.data)
                this.data.list = responce.data.list1
            })
            console.log('DeleteKassa')
        }

        this.Perechet = () => {

            let sql = makeSelect('GroupKassa2')

            $http.get('/r/url_sql_read_db1', { params: { sql: sql } }
            ).then(responce => {
                this.SelectGrup = responce.data.list[0]

                console.log(this.SelectGrup.idnom)

            })
        }

        this.Ok_button = () => {
            console.log("Ok_button")
            $http.get('/r/url_sql_read_db1', { params: { sql: makeSelect() } }
            ).then(responce => {
                this.data = responce.data
            })
        }
        this.Ok_button()
    }
}

const makeSelect = sqlName => {
    if (!sqlName) sqlName = 'SelectKassa'
    let sql = replaceSql(sql_app[sqlName].sql)
    return sql
        .replace(':d1', "'" + formData.seek.StartDateProv.toISOString().split('T')[0] + "'")
        .replace(':d2', "'" + formData.seek.FinishDateProv.toISOString().split('T')[0] + "'")
        .replace(':p', formData.seek.PrRasx)
}

app.controller('myCtrl', TestControl)