'use strict'
app.factory("dataBeFactory", DataDBexchangeService)
app.factory("editFRFactory", EditFHIResourceService)
app.config(RouteProviderConfig)
app.controller("InitFHIResourceController", InitFHIResourceController)
app.directive('amSqlHtml', AmSqlHtml)
app.directive('amEmrLink', AmEmrLink)

// app.controller("PlanDefinitionController", PlanDefinitionController)
class PlanDefinitionController extends InitFHIResourceController {
    constructor($scope, $routeParams, dataBeFactory, editFRFactory) {
        super($scope, $routeParams, dataBeFactory, editFRFactory)
        if (singlePage.PseudoRESTKey('pd_').length) {
            this.readPlanDefinition()
        }
    }
    clickActionTitle = (at) => {
        console.log(at)
    }
}
app.controller("PlanDefinitionController", PlanDefinitionController)

// app.controller("InitPageController", InitPageController)
class InitPageController extends AbstractController {
    constructor($scope, $route, $routeParams) {
        super()
        // console.log(singlePage.Url(), Object.keys($route.routes))
    }
}
app.controller("InitPageController", InitPageController)
