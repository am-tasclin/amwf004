'use strict'
app.config(RouteProviderFHIRConfig)
class InitPageController extends AbstractController {
    constructor($route) {
        super()
        // console.log(Object.keys($route.routes)) // NOT DELETE
    }
}
class PlanDefinitionController extends AbstractController {
    constructor($route) {
        super()
        console.log(123)
    }
}
app.controller("InitPageController", InitPageController)
app.controller("PlanDefinitionController", PlanDefinitionController)
