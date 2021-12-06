'use strict';
//var app = angular.module('myApp', []); // see lib-init.js
app.directive('amSqlHtml', AmSqlHtml)
app.config(RouteProviderConfig)

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
formData.posting = {}
formData.posting.LName = 'Iванов'
formData.posting.myNumb = 1234
formData.posting.firstName = 'ФОП Глобус'
formData.posting.lastName = 'Сидоренко М.Н.'
formData.posting.d1 = new Date('2021-01-01')
formData.posting.d2 = new Date('2022-02-02')
formData.posting.d3 = new Date()
formData.posting.Nal = -1
formData.posting.val = 'грн'
formData.posting.KassOp = 'за товар'
formData.posting.n1 = 'insert-kassa.html'
formData.posting.n2 = 'table-kassa.html'
formData.posting.Vrec = 0
formData.posting.Vsum = 0
formData.posting.PrRasx = 1

conf.sqlKeyName = 'SelectKassa'
console.log(formData.firstName)


class TestControl {
    constructor($scope, $http) {

        this.formData = formData

        this.selectRow = (row) => {
            console.log(123, row)
            this.selectedRow = row
        }

        this.AddKassa = () => {
            console.log("AddKassa", this.formData.Val)
            sql = sql_app.AddKassa_VB.sql.replace(':pr', formData.posting.PrRasx)
                .replace(':Ld1', "'" + formData.posting.d3.toISOString().split('T')[0] + "'")
                .replace(':ssum', formData.posting.myNumb)
                .replace(':KassOp', "'" + formData.posting.KassOp + "'")
                .replace(':NameContr', "'" + formData.posting.LName + "'")
                .replace(':val', "'" + formData.posting.Val + "'")
                .replace(':nal', formData.posting.Nal)

            sql = sql + '; \n\ ' + makeSelect()
            console.log(sql)


            $http.post('/r/url_sql_read_db1'
                , { sql: sql }).then((responce) => {
                    console.log(responce.data.list1)
                    $scope.data.list = responce.data.list1
                    //$scope.data = responce.data
                })
            console.log(12)
        }

        this.DeleteKassa = (a) => {
            console.log("DeleteKassa", this.selectedRow.idnom)
            sql = sql_app.DeleteKassa.sql.replace(':LidNom', this.selectedRow.idnom)
            sql = sql + '; \n\ ' + makeSelect()

            console.log(sql)
            $http.post('/r/url_sql_read_db1'
                , { sql: sql }).then((responce) => {
                    console.log(responce.data)

                    $scope.data.list = responce.data.list1
                })
            console.log('DeleteKassa')
        }

        const makeSelect = () => sql_app.SelectKassa.sql
            .replace(':d1', "'" + formData.posting.d1.toISOString().split('T')[0] + "'")
            .replace(':d2', "'" + formData.posting.d2.toISOString().split('T')[0] + "'")
            .replace(':p', formData.posting.PrRasx)


       this.Perechet = () => {
            console.log("Неполучаеться сбросить в переменные значения из запроса")

            sql = sql_app.GroupKassa.sql
                .replace(':d1', "'" + formData.posting.d1.toISOString().split('T')[0] + "'")
                .replace(':d2', "'" + formData.posting.d2.toISOString().split('T')[0] + "'")
                .replace(':P', formData.posting.PrRasx)
            console.log(sql)



            $http.get('/r/url_sql_read_db1'
                , { params: { sql: sql } }).then((responce) => {
                    $scope.data = responce.data


                    // Тут не работает
                    formData.posting.Vrec = responce.data.list.Count
                    formData.posting.Vsum = responce.data.list.SumaProv
                })
                
                // а здесь не видит this.formData.selectRow
                console.log("GropKassa", this.formData.selectRow)

            
            

        }

        this.Ok_button = (a) => {
            console.log("Ok_button")
            sql = makeSelect()
            $http.get('/r/url_sql_read_db1'
                , { params: { sql: sql } }).then((responce) => {
                    $scope.data = responce.data
                })
            console.log(sql)
        }

        let sql = sql_app.SelectKassa.sql.replace(':d1', "'" + formData.posting.d1.toISOString().split('T')[0] + "'").replace(':d2', "'" + formData.posting.d2.toISOString().split('T')[0] + "'").replace(':p', 1)

        console.log(sql)

        $http.get('/r/url_sql_read_db1'
            , { params: { sql: sql } }).then((responce) => {
                $scope.data = responce.data
                console.log(responce.data)
            })
    }

}

app.controller('myCtrl', TestControl)
