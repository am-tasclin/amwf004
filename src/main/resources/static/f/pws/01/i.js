'use strict'
app.factory("dataFactory", DataFactory)
conf.pws = {}//Physition Work Station
conf.pws.topMenu = ['Список пацієнтів','ЕМЗ-документація','Лікувальний процес']

// app.controller("InitPageController", InitPageController)
class InitPageController extends AbstractController {
    constructor($scope, $route, $routeParams) {
        super()
    }
}
app.controller("InitPageController", InitPageController)