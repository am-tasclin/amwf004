var app = angular.module('myApp', []);
app.controller('myCtrl',
    function ($scope, $http) {
        $scope.firstName = "ФОП Глобус";
        $scope.lastName = "Сидоренко М.Н.";
        $scope.d1 = new Date('2021-01-01')
        $scope.d2 = new Date('2021-02-02')
        $scope.d3 = new Date()

        $scope.b1Click = (a) => {

            console.log(123)
        }
   

        $scope.b2Click = (a) => {
            console.log("b2click")
            sql = sql_app.DeleteKassa.sql.replace(':LidNom', 7)
            console.log(sql)

            $http.post('/r/url_sql_read_db1'
                , { sql: sql } ).then((responce) => {
                    console.log(responce.data)                    
                    //$scope.data = responce.data
                })
                console.log(12)
        }



        $scope.b3Click = (a) => {
           console.log("b3Click")
           sql = sql_app.SelectKassa.sql.replace(':d1', "'" + $scope.d1.toISOString().split('T')[0] + "'").replace(':d2', "'" + $scope.d2.toISOString().split('T')[0] + "'").replace(':p', 1)
          
                     $http.get('/r/url_sql_read_db1'
                , { params: { sql: sql } }).then((responce) => {
                    $scope.data = responce.data
                })

            console.log(sql)

        }



        console.log($scope.d2.toISOString().split('T'))
        console.log(sql_app.SelectKassa.sql, $scope.d2.toISOString().split('T')[0], $scope.d1.toISOString())

        let sql = sql_app.SelectKassa.sql.replace(':d1', "'" + $scope.d1.toISOString().split('T')[0] + "'").replace(':d2', "'" + $scope.d2.toISOString().split('T')[0] + "'").replace(':p', 1)
        let sqlInsert = sql_app.AddKassa.sql.replace(':d1')
        console.log(sql)

        $http.get('/r/url_sql_read_db1'
            , { params: { sql: sql } }).then((responce) => {
                $scope.data = responce.data
            })
    }
);
