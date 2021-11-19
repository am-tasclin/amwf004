'use strict';
//var app = angular.module('myApp', []); // see lib-init.js
app.directive('amSqlHtml', AmSqlHtml)

app.controller('myCtrl',
    function ($scope, $http) {
        $scope.firstName = "ФОП Глобус";
        $scope.lastName = "Сидоренко М.Н.";
        $scope.d1 = new Date('2021-01-01')
        $scope.d2 = new Date('2022-02-02')
        $scope.d3 = new Date()
        $scope.myNumb = 0
        conf.sqlKeyName = 'SelectKassa'

        $scope.b1Click = (a) => {
            console.log("b11111click", $scope.myNumb)
            sql = sql_app.AddKassa_VB.sql.replace(':Ld1', "'" + $scope.d3.toISOString().split('T')[0] + "'").replace(':ssum', $scope.myNumb)
            sql = sql + '; \n\ ' + makeSelect()
            console.log(sql)

            $scope.firstName = sql

            $http.post('/r/url_sql_read_db1'
                , { sql: sql }).then((responce) => {
                    console.log(responce.data.list1)
                    $scope.data.list = responce.data.list1
                    //$scope.data = responce.data
                })
            console.log(12)
        }

        $scope.b2Click = (a) => {
            console.log("b2click")
            sql = sql_app.DeleteKassa.sql.replace(':LidNom', 9)
            console.log(sql)
            $http.post('/r/url_sql_read_db1'
                , { sql: sql }).then((responce) => {
                    console.log(responce.data)

                    //$scope.data = responce.data
                })
            console.log(12)
        }

        const makeSelect = () => sql_app.SelectKassa.sql
            .replace(':d1', "'" + $scope.d1.toISOString().split('T')[0] + "'")
            .replace(':d2', "'" + $scope.d2.toISOString().split('T')[0] + "'")
            .replace(':p', 1)

        $scope.b3Click = (a) => {
            console.log("b3Click")
            sql = makeSelect()

            $http.get('/r/url_sql_read_db1'
                , { params: { sql: sql } }).then((responce) => {
                    $scope.data = responce.data
                })
            console.log(sql)
        }

        console.log($scope.d2.toISOString().split('T'))
        console.log(sql_app.SelectKassa.sql, $scope.d2.toISOString().split('T')[0], $scope.d1.toISOString())

        let sql = sql_app.SelectKassa.sql.replace(':d1', "'" + $scope.d1.toISOString().split('T')[0] + "'").replace(':d2', "'" + $scope.d2.toISOString().split('T')[0] + "'").replace(':p', 1)

        console.log(sql)

        $http.get('/r/url_sql_read_db1'
            , { params: { sql: sql } }).then((responce) => {
                $scope.data = responce.data
                console.log(responce.data)
            })
    }
)
