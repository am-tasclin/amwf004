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

class TestControl {
    constructor($scope, $http) {

        this.formData = formData

        this.firstName = 'ФОП Глобус';
        this.lastName = 'Сидоренко М.Н.';

        console.log(this.firstName)

        $scope.d1 = new Date('2021-01-01')
        $scope.d2 = new Date('2022-02-02')
        $scope.d3 = new Date()

        this.formData.Nal = -1
        
        this.formData.val = 'грн'

        this.formData.KassOp = 'за товар'
        
        this.formData.LName = 'Иванов '

        this.formData.myNumb = 123
        
        conf.sqlKeyName = 'SelectKassa'
        $scope.n1 = 'insert-kassa.html'
        $scope.n2 = 'table-kassa.html'
        $scope.Vrec = 0
        $scope.Vsum = 0
        $scope.PrRasx = 1

        this.selectRow = (row) => {
            console.log(123, row)
            this.selectedRow = row
        }


        $scope.AddKassa = () => {
            console.log("AddKassa", this.formData.Val)
            sql = sql_app.AddKassa_VB.sql.replace(':pr', $scope.PrRasx)
                .replace(':Ld1', "'" + $scope.d3.toISOString().split('T')[0] + "'")
                .replace(':ssum',            formData.myNumb)
                .replace(':KassOp', "'" +    formData.KassOp + "'")
                .replace(':NameContr', "'" + formData.LName + "'")
                .replace(':val', "'" + this.formData.Val + "'")
                .replace(':nal',  this.formData.Nal )

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

        $scope.DeleteKassa = (a) => {
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
            .replace(':d1', "'" + $scope.d1.toISOString().split('T')[0] + "'")
            .replace(':d2', "'" + $scope.d2.toISOString().split('T')[0] + "'")
            .replace(':p', $scope.PrRasx)

        const makeGroupSelect = () => sql_app.GroupKassa.sql
            .replace(':d1', "'" + $scope.d1.toISOString().split('T')[0] + "'")
            .replace(':d2', "'" + $scope.d2.toISOString().split('T')[0] + "'")
            .replace(':p', $scope.PrRasx)


        $scope.Perechet = (a) => {
            console.log("b4 - group")
            sql = makegroupSelect()

            $http.get('/r/url_sql_read_db1'
                , { params: { sql: sql } }).then((responce) => {
                    $scope.data = responce.data
                    $scope.Vrec = responce.data.list1.count
                })
            console.log(Vrec)


        }


        $scope.Ok_button = (a) => {
            console.log("Ok_button")
            sql = makeSelect()
            $http.get('/r/url_sql_read_db1'
                , { params: { sql: sql } }).then((responce) => {
                    $scope.data = responce.data
                })
            console.log(sql)
        }


        let sql = sql_app.SelectKassa.sql.replace(':d1', "'" + $scope.d1.toISOString().split('T')[0] + "'").replace(':d2', "'" + $scope.d2.toISOString().split('T')[0] + "'").replace(':p', 1)

         


        console.log(sql)

        $http.get('/r/url_sql_read_db1'
            , { params: { sql: sql } }).then((responce) => {
                $scope.data = responce.data
                console.log(responce.data)
            })
    }

}

app.controller('myCtrl', TestControl)
