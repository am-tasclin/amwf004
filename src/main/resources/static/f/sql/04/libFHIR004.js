'use strict'
// app.controller("InitFHIResourceController", InitFHIResourceController)
class InitFHIResourceController extends AbstractController {
    dataBeFactory; editFRFactory
    constructor($scope, $routeParams, dataBeFactory, editFRFactory) {
        super()
        this.dataBeFactory = dataBeFactory
        this.editFRFactory = editFRFactory
        // console.log(singlePage.Url())
    }
}

//app.factory("editFRFactory", EditFHIResourceFactory)
class EditFHIResourceService {
    dataBeFactory
    constructor(dataBeFactory) {
        this.dataBeFactory = dataBeFactory
    }
}
