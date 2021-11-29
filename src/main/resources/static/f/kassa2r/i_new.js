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

class ClassKassa {
        constructor() {
            this.firstName = "ФОП Глобус";
            this.lastName = "Сидоренко М.Н.";
            this.d1 = new Date('2021-01-01')
            this.d2 = new Date('2022-02-02')
            this.d3 = new Date()
            const makeSelect = () => sql_app.SelectKassa.sql
                .replace(':d1', "'" + this.d1.toISOString().split('T')[0] + "'")
                .replace(':d2', "'" + this.d2.toISOString().split('T')[0] + "'")
                .replace(':p', 1)

            const makeGroupSelect = () => sql_app.GroupKassa.sql
                .replace(':d1', "'" + this.d1.toISOString().split('T')[0] + "'")
                .replace(':d2', "'" + this.d2.toISOString().split('T')[0] + "'")
                .replace(':p', 1)
console.lod(makeSelect)
        }


        console.log($scope.d2.toISOString().split('T'))
        console.log(sql_app.SelectKassa.sql, $scope.d2.toISOString().split('T')[0], $scope.d1.toISOString())

        let sql = sql_app.SelectKassa.sql.replace(':d1', "'" + $scope.d1.toISOString().split('T')[0] + "'").replace(':d2', "'" + $scope.d2.toISOString().split('T')[0] + "'").replace(':p', 1)

        console.log(sql)

        $http.get('/r/url_sql_read_db1'
            , { params: { sql: sql } }).then((responce) => {
                this.data = responce.data
                console.log(responce.data)
            })
}
