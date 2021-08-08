'use strict'
var app = angular.module("app", ['ngRoute', 'ngResource', 'ngSanitize'])
angular.element(() => angular.bootstrap(document, ['app']))
app.factory("dataFactory", DataFactory)
app.factory("treeFactory", TreeFactory)

conf.singlePagesUrl = {
    sql: {
        templateUrl: 'sql1.html',
        controller: 'SqlController',
        controllerAs: 'ctrl',
    },
    'sql/:sql': {
        templateUrl: 'sql1.html',
        controller: 'SqlController',
        controllerAs: 'ctrl',
    },
    dev: {
        templateUrl: 'dev.html',
        controller: 'DevController',
        controllerAs: 'ctrl',
    },
    wikiList: {
        templateUrl: 'wikiList.html',
        controller: 'WikiListController',
        controllerAs: 'ctrl',
    },
    carePlan001: {
        templateUrl: 'carePlan001.html',
        controller: 'CarePlan001Controller',
        controllerAs: 'ctrl',
    },
    carePlan002Rest: {
        templateUrl: 'carePlan001.html',
        controller: 'CarePlan002RestController',
        controllerAs: 'ctrl',
    },
    'docTree/:doc_id': {
        templateUrl: 'docTree.html',
        controller: 'DocTree005Controller',
        controllerAs: 'ctrl',
    },
    'carePlan005Rest/:doc_id': {
        templateUrl: 'carePlan001.html',
        controller: 'DocTree005Controller',
        controllerAs: 'ctrl',
    },
    wiki: {
        templateUrl: 'wiki.html',
        controller: 'Wiki001Controller',
        controllerAs: 'ctrl',
    },
    wiki003Rest: {
        templateUrl: 'wiki.html',
        controller: 'Wiki003RestController',
        controllerAs: 'ctrl',
    },
    'wiki004Rest/:doc_id': {
        templateUrl: 'wiki.html',
        controller: 'Wiki004RestController',
        controllerAs: 'ctrl',
    },
    'wiki005Rest/:doc_id': {
        templateUrl: 'wiki.html',
        controller: 'Wiki005RestController',
        controllerAs: 'ctrl',
    },
    'wiki005Rest/:doc_id/:el_id': {
        templateUrl: 'wiki.html',
        controller: 'Wiki005RestController',
        controllerAs: 'ctrl',
    },
    'wiki005Rest/:doc_id/:el_id/:crud': {
        templateUrl: 'wiki.html',
        controller: 'Wiki005RestController',
        controllerAs: 'ctrl',
    },
}


sql_app.simpleSQLs = {
    WikiList: {
        c: 'SELECT doc_id, value, cnt_child, parent FROM doc d \n\
        LEFT JOIN string ON string_id=doc_id \n\
        LEFT JOIN ( \n\
            SELECT count(parent) cnt_child, parent child FROM doc GROUP BY parent \n\
            ) cnt ON cnt.child=d.doc_id \n\
        WHERE 369940 IN (reference, doc_id, reference2)',
        newDocMenu: {},
        wikiReference: 369940,
        wikiFolderId: 371645,
        sqlHtml: { doc_id: '<a href="#!/wiki005Rest/{{r[k]}}">{{r[k]}}</a>', },
    },
    FHIR_PlanDefinition: {
        c: 'SELECT value, d.* FROM doc d \n\
        LEFT JOIN string ON string_id=doc_id \n\
        WHERE reference=368815',
        sqlHtml: {
            value: '<a href="#!/docTree/{{r.doc_id}}">{{r[k]}}</a>',
            doc_id: '<a href="#!/carePlan005Rest/{{r[k]}}">{{r[k]}}</a>',
        },
    },
    tableOfFHIR_CarePlan: {
        c: sql_app.tableOfFHIR_CarePlan(),
        sqlHtml: { careplan_id: '<a href="#!/carePlan005Rest/{{r[k]}}">{{r[k]}}</a>', },
    },
    tableOfFHIR_CarePlan_plannedActivityReference_mr: {
        c: sql_app.tableOfFHIR_CarePlan_plannedActivityReference_mr(),
    },
    tableOfFHIR_dosageData: {
        c: sql_app.tableOfFHIR_dosageData(),
        tree_id: 'dosage_id',
        sqlHtml: { dosage_id: '<a href="#!/docTree/{{r[k]}}">{{r[k]}}</a>', },
    },
    tableOfFHIR_doseQuantity_timingPeriod: {
        c: sql_app.tableOfFHIR_doseQuantity_timingPeriod(),
        tree_id: 'dosequantity_id',
        sqlHtml: { dosequantity_id: '<a href="#!/docTree/{{r[k]}}">{{r[k]}}</a>', },
    },
    tableOfFHIR_ValueSet_observation_codes: {
        c: sql_app.tableOfFHIR_ValueSet_observation_codes(),
        tree_id: 'doc_id',
        sqlHtml: { doc_id: '<a href="#!/docTree/{{r[k]}}">{{r[k]}}</a>', },
    },
    tableOfFHIR_doseQuantity: {
        c: sql_app.tableOfFHIR_doseQuantity(),
        tree_id: 'dosequantity_id',
        sqlHtml: { dosequantity_id: '<a href="#!/docTree/{{r[k]}}">{{r[k]}}</a>', },
    },
    tableOfFHIR_Observation_valueQuantity002: {
        c: sql_app.tableOfFHIR_Observation_valueQuantity002(),
        sqlHtml: { observation_id: '<a href="#!/docTree/{{r[k]}}">{{r[k]}}</a>', },
    },
    tableOfFHIR_Observation_valueQuantity: {
        c: sql_app.tableOfFHIR_Observation_valueQuantity(),
        sqlHtml: { observation_id: '<a href="#!/docTree/{{r[k]}}">{{r[k]}}</a>', },
    },
    tableOfFHIR_ValueSet_code001: {
        c: sql_app.tableOfFHIR_ValueSet_code001(),
        sqlHtml: { code_id: '<a href="#!/docTree/{{r[k]}}">{{r[k]}}</a>', },
    },
    tableOfFHIR_codeInConcept: {
        c: sql_app.tableOfFHIR_codeInConcept(),
        sqlHtml: { code_id: '<a href="#!/docTree/{{r[k]}}">{{r[k]}}</a>', },
    },
    tableOfFHIR_ValueSetComposeInclude: {
        c: sql_app.tableOfFHIR_ValueSetComposeInclude(),
        sqlHtml: { valueset_id: '<a href="#!/docTree/{{r[k]}}">{{r[k]}}</a>', },
    },
    tableOfFHIR_ValueSet_cd: {
        c: sql_app.tableOfFHIR_ValueSet_cd(),
        sqlHtml: { code_id: '<a href="#!/docTree/{{r[k]}}">{{r[k]}}</a>', },
    },
    tableOfFHIR_Observetion_referenceRange: {
        c: sql_app.tableOfFHIR_Observetion_referenceRange(),
        sqlHtml: { observation_id: '<a href="#!/docTree/{{r[k]}}">{{r[k]}}</a>', },
    },
    tableOfFHIR_labor_constant: {
        c: sql_app.tableOfFHIR_labor_constant(),
        sqlHtml: { val_id: '<a href="#!/docTree/{{r[k]}}">{{r[k]}}</a>', },
    },
    tableOfFHIR_on_referenceRange: {
        c: sql_app.tableOfFHIR_on_referenceRange(),
        sqlHtml: { type_id: '<a href="#!/docTree/{{r[k]}}">{{r[k]}}</a>', },
    },
    tableOfFHIR_Timing_period: {
        c: sql_app.tableOfFHIR_Timing_period(),
        sqlHtml: { period_id: '<a href="#!/docTree/{{r[k]}}">{{r[k]}}</a>', },
    },
    tableOfFHIR_Task_inputSqlCmdMap: {
        c: sql_app.tableOfFHIR_Task_inputSqlCmdMap(),
        sqlHtml: { task_id: '<a href="#!/docTree/{{r[k]}}">{{r[k]}}</a>', },
    },
    tableOfFHIR_Task_description: {
        c: sql_app.tableOfFHIR_Task_description(),
        sqlHtml: { task_id: '<a href="#!/docTree/{{r[k]}}">{{r[k]}}</a>', },
    },
    tableOfFHIR_MedicationRequest_expectedSupplyDuration: {
        c: sql_app.tableOfFHIR_MedicationRequest_expectedSupplyDuration(),
        sqlHtml: { expectedsupplyduration_id: '<a href="#!/docTree/{{r[k]}}">{{r[k]}}</a>', },
    },
    tableOfFHIR_Duration: {
        c: sql_app.tableOfFHIR_Duration(),
        sqlHtml: { duration_id: '<a href="#!/docTree/{{r[k]}}">{{r[k]}}</a>', },
    },
    tableOfFHIR_Ratio: {
        c: sql_app.tableOfFHIR_Ratio(),
        sqlHtml: { numerator_id: '<a href="#!/docTree/{{r[k]}}">{{r[k]}}</a>', },
    },
    tableOfFHIR_observationUse: {
        c: sql_app.tableOfFHIR_observationUse(),
        sqlHtml: { goal_id: '<a href="#!/docTree/{{r[k]}}">{{r[k]}}</a>', },
    },
    tableOfFHIR_CarePlan_Goal: {
        c: sql_app.tableOfFHIR_CarePlan_Goal(),
        sqlHtml: { goal_id: '<a href="#!/docTree/{{r[k]}}">{{r[k]}}</a>', },
    },
    tableOfFHIR_Goal_dueDuration: {
        c: sql_app.tableOfFHIR_Goal_dueDuration(),
        sqlHtml: { dueduration_id: '<a href="#!/docTree/{{r[k]}}">{{r[k]}}</a>', },
    },
    tableOfFHIR_CarePlan_Goal_id: {
        c: sql_app.tableOfFHIR_CarePlan_Goal_id(),
        sqlHtml: { goal_id: '<a href="#!/docTree/{{r[k]}}">{{r[k]}}</a>', },
    },
    tableOfFHIR_Goal_target_measure: {
        c: sql_app.tableOfFHIR_Goal_target_measure(),
        sqlHtml: { measure_id: '<a href="#!/docTree/{{r[k]}}">{{r[k]}}</a>', },
    },
    tableOfFHIR_Goal_target_measure_dueDuration: {
        c: sql_app.tableOfFHIR_Goal_target_measure_dueDuration(),
        sqlHtml: { measure_id: '<a href="#!/docTree/{{r[k]}}">{{r[k]}}</a>', },
    },
    tableOfFHIR_Goal001: {
        c: sql_app.tableOfFHIR_Goal001(),
        sqlHtml: { goal_id: '<a href="#!/docTree/{{r[k]}}">{{r[k]}}</a>', },
    },
    tableOfFHIR_valueQuantity: {
        c: sql_app.tableOfFHIR_valueQuantity(),
        sqlHtml: { valuequantity_id: '<a href="#!/docTree/{{r[k]}}">{{r[k]}}</a>', },
    },
    tableOfFHIR_comparator: {
        c: sql_app.tableOfFHIR_comparator(),
        sqlHtml: { comparator_id: '<a href="#!/docTree/{{r[k]}}">{{r[k]}}</a>', },
    },
    tableOfFHIR_Quantity: {
        c: sql_app.tableOfFHIR_Quantity(),
        sqlHtml: { doc_id: '<a href="#!/docTree/{{r[k]}}">{{r[k]}}</a>', },
    },
    tableOfFHIR_MedicationRequest_sc_doseQuantityTimingPeriod: {
        c: sql_app.tableOfFHIR_MedicationRequest_sc_doseQuantityTimingPeriod(),
        sqlHtml: { medicationrequest_id: '<a href="#!/docTree/{{r[k]}}">{{r[k]}}</a>', },
    },
    tableOfFHIR_MedicationRequest_sc: {
        c: sql_app.tableOfFHIR_MedicationRequest_sc(),
        sqlHtml: { medicationrequest_id: '<a href="#!/docTree/{{r[k]}}">{{r[k]}}</a>', },
    },
    FHIR_MedicationRequest_sq: {
        c: 'SELECT d.doc_id medicationrequest_id, medication.* FROM doc d ,(:sql_app.FHIR_Medication_sq ) medication \n\
        WHERE d.reference=371469 AND medication.medication_id=d.reference2',
        sqlHtml: { medicationrequest_id: '<a href="#!/docTree/{{r[k]}}">{{r[k]}}</a>', },
    },
    tableOfFHIR_Medication_sc: {
        c: sql_app.tableOfFHIR_Medication_sc(),
        sqlHtml: { medication_id: '<a href="#!/docTree/{{r[k]}}">{{r[k]}}</a>', },
    },
    FHIR_Medication_sq: {
        c: sql_app.FHIR_Medication_sq(),
        sqlHtml: { medication_id: '<a href="#!/docTree/{{r[k]}}">{{r[k]}}</a>', },
    },
    tableOfFHIR_Substance_code: {
        c: sql_app.tableOfFHIR_Substance_code(),
        sqlHtml: { doc_id: '<a href="#!/docTree/{{r[k]}}">{{r[k]}}</a>', },
    },
    FHIR_Substance: {
        c: sql_app.FHIR_Substance(),
        sqlHtml: { doc_id: '<a href="#!/docTree/{{r[k]}}">{{r[k]}}</a>', },
    },
    FHIR_SubstanceDefinition: {
        c: 'SELECT dn.* FROM doc d LEFT JOIN ( \n\
            SELECT dp.parent doc_id, value substance_name, string_id sname_id \n\
            FROM doc dp, doc d,string \n\
            WHERE dp.doc_id=d.parent AND d.doc_id=string_id AND d.reference=372419 \n\
            ) dn ON dn.doc_id=d.doc_id \n\
            WHERE d.reference=372417 \n\
            ORDER BY doc_id, substance_name',
        sqlHtml: { doc_id: '<a href="#!/docTree/{{r[k]}}">{{r[k]}}</a>', },
    },
    FHIR_MethadataResource: {
        c: 'SELECT s.value FHIR_DomainResource, d.*, r1.value r1value FROM doc d \n\
        LEFT JOIN string s ON s.string_id=doc_id \n\
        LEFT JOIN string r1 ON r1.string_id=reference \n\
        WHERE reference IN (369795)',
    },
    FHIR_DomainResource: {
        c: 'SELECT s.value FHIR_DomainResource, d.*, r1.value FROM doc d \n\
        LEFT JOIN string s ON s.string_id=doc_id \n\
        LEFT JOIN string r1 ON r1.string_id=reference \n\
        WHERE 369789 IN (reference)',
    },
    SQL_from_DB: {
        c: 'SELECT doc_id, value sql_select FROM doc \n\
    LEFT JOIN string ON string_id=doc_id \n\
    WHERE 371327 IN (reference2)',
    },
}

d.conf.wiki = {
    cl: {//допустимі children елементи для елементів.
        root: ['h1', 'p', 'h2', 'ol'],
        h2: ['h3', 'p', 'ol'],
        h3: ['p', 'ol'],
    },
    menu: ['h2', 'h3', 'p', 'ol'],
    ref: {
        h1: 1,
        h2: 371364,
        h3: 371363,
        p: 371359,
        ol: 371367,
    }
}
conf.extraReadIds = [
    368794, // CarePlan.activity.plannedActivityReference[MedicationRequest|...]
    370001, // Medication.ingredient.item[SimpleQuantity]
    372808, // Medication.ingredient.strength[Ratio]
    372786, // Substance.quantity[SimpleQuantity]
    368676, // Ratio.numerator[Quantity]
    368677, // Ratio.denominator[Quantity]
    371469, // Ratio.denominator[Quantity]
]
//370024, //  Substance.code[Quantity]

// app.controller('DevController', DevController)
class DevController {
    constructor($scope) {
        $scope.jsonStringify = (o) => {
            return JSON.stringify(o, null, 2)
        }
        $scope.fhirExamples = {}
        let SubstanceDefinition = {
            name: [{ name: 'бензилпеніцилін' }]
        }
        let quantity = {
            value: 250,
            unit: 'мг',
        }
        let Substance = {
            //code: SubstanceDefinition.name[0].name,
            code: 'azithromycin',
            quantity: quantity,
        }
        let Substance0 = {
            code: SubstanceDefinition,
        }
        if (sql_app.simpleSQLs['FHIR_Medication_sc'].data)
            angular.forEach(sql_app.simpleSQLs['FHIR_Medication_sc'].data.list, (v) => {
                if (v.medication_id == 372793) $scope.fhirExamples4 = { v: v }
            })
        $scope.fhirExamples3 = {
            quantity: quantity
        }
        $scope.fhirExamples2 = {
            substance: Substance
        }
        let MedicationRequest = {
            medication: 'Бензилпеніцилін',
        }
        $scope.fhirExamples.CarePlan = {
            title: 'CarePlan 1',
            activity: [
                {
                    plannedActivityReference: Substance,
                },
                {
                    plannedActivityReference: Substance0,
                },
                {
                    plannedActivityReference: MedicationRequest,
                },
            ]
        }
        console.log(1, JSON.stringify($scope.fhirExamples, null, 2))
    }
}
app.controller('DevController', DevController)

const read_wiki_id = 371357
class Wiki000AbstractController extends AmDocAbstractController {
    constructor($scope) {
        super($scope)
        $scope.markdownInLine = markdownInLine
    }
    setWiki = (data) => {
        console.log(1, data.elMap, data.clList)
        d.elMap = data.elMap
        d.clList = data.clList
    }
}

// app.controller("Wiki005RestController", Wiki005RestController)
class Wiki005RestController extends Wiki000AbstractController {
    constructor($scope, $routeParams, dataFactory, edTextFactory) {
        super($scope)
        console.log(d.conf)
        d.conf.$routeParams = $routeParams
        d.conf.read_wiki_id = $routeParams.doc_id
        console.log(d.conf.read_wiki_id)
        dataFactory.adn_d.get({ doc_id: d.conf.read_wiki_id }).$promise.then(this.setWiki);
        return {
            wikiItemAddEl: edTextFactory.wikiItemAddEl,
            hideChildren: edTextFactory.hideChildren,
        }
    }
}
app.controller("Wiki005RestController", Wiki005RestController)

// app.controller("Wiki004RestController", Wiki004RestController)
class Wiki004RestController extends Wiki000AbstractController {
    constructor($scope, $routeParams, dataFactory) {
        super($scope)
        d.conf.read_wiki_id = $routeParams.doc_id
        console.log(d.conf.read_wiki_id)
        dataFactory.httpGetRest('/r/adn/d/' + d.conf.read_wiki_id).then(this.setWiki)
    }
}
app.controller("Wiki004RestController", Wiki004RestController)

// app.controller("Wiki003RestController", Wiki003RestController)
class Wiki003RestController extends Wiki000AbstractController {
    constructor($scope, dataFactory) {
        super($scope)
        dataFactory.httpGetRest('/r/adn/d/' + read_wiki_id).then(this.setWiki)
    }
}
app.controller("Wiki003RestController", Wiki003RestController)
// app.controller("Wiki001Controller", Wiki001Controller)
class Wiki001Controller extends Wiki000AbstractController {
    constructor($scope, treeFactory) {
        super($scope)
        conf.getListChildren = 'getListChildrenSql'
        treeFactory.readElement(read_wiki_id)
            .then((el) => treeFactory.readChildrenDeep([el.doc_id], 4))
    }
}
app.controller("Wiki001Controller", Wiki001Controller)

const read_doc_id = 369927
// app.controller("CarePlan001Controller", CarePlan001Controller)
class CarePlan000AbstractController extends AmDocAbstractController {
    constructor($scope) {
        super($scope)
        d.conf.read_doc_id = read_doc_id
    }
    scope
    init(treeFactory) {
        console.log(this.constructor.name, 1)
        conf.readExtra = (el) => {
            if (conf.extraReadIds.indexOf(el.reference) >= 0) {
                console.log(el.doc_id, el.reference, conf.extraReadIds.indexOf(el.reference))
                console.log(el.reference2,)
                treeFactory[conf.readElement](el.reference2)
                    .then((el) => treeFactory.readChildrenDeep([el.doc_id], 3))
            }
        }
        treeFactory[conf.readElement](read_doc_id)
            .then((el) => treeFactory.readChildrenDeep([el.doc_id], 3))
    }
}

// app.controller("CarePlan002RestController", CarePlan002RestController)
class CarePlan002RestController extends CarePlan000AbstractController {
    constructor($scope, treeFactory) {
        super($scope)
        conf.getListChildren = 'getListChildrenRest'
        conf.readElement = 'readElementRest'
        this.init(treeFactory, this)
        $scope.morEventFn = ($event) => {
            console.log($event)
        }
    }
}
app.controller("CarePlan002RestController", CarePlan002RestController)

class DocTreeAbstractController extends AmDocAbstractController {
    constructor($scope, dataFactory) {
        super($scope)
        console.log(1)
        this.dataFactory = dataFactory
        this.singlePage = singlePage
    }
    dataFactory
    init($routeParams) {
        const configData = sql_app.simpleSQLs[sql_app.simpleSQLselect]
        d.conf.read_doc_id = $routeParams.doc_id
        let c = this
        c.dataFactory.adn_d.get({ doc_id: d.conf.read_doc_id }).$promise.then((data) => {
            c.setDoc(data)
            angular.forEach(data.elMap, (el, doc_id) => {
                if (conf.extraReadIds.indexOf(el.reference) >= 0)
                    c.dataFactory.adn_d.get({ doc_id: el.reference2 }).$promise.then((data) => {
                        c.addDoc(data)
                        angular.forEach(data.elMap, (el, doc_id) => {
                            if (conf.extraReadIds.indexOf(el.reference) >= 0)
                                c.dataFactory.adn_d.get({ doc_id: el.reference2 }).$promise.then((data) => {
                                    c.addDoc(data)
                                })
                        })
                    })
            })
        })
    }
}

// app.controller("DocTree005Controller", DocTree005Controller)
class DocTree005Controller extends DocTreeAbstractController {
    constructor($scope, $routeParams, dataFactory) {
        super($scope, dataFactory)
        this.init($routeParams)
    }
}
app.controller("DocTree005Controller", DocTree005Controller)

// app.controller("CarePlan005Controller", CarePlan005Controller)
class CarePlan005Controller extends DocTreeAbstractController {
    constructor($scope, $routeParams, dataFactory) {
        super($scope, dataFactory)
        console.log(d.conf, $routeParams)
        sql_app.simpleSQLselect = 'FHIR_CarePlan'
        this.init($routeParams)
    }
}
app.controller("CarePlan005Controller", CarePlan005Controller)

// app.controller("CarePlan001Controller", CarePlan001Controller)
class CarePlan001Controller extends CarePlan000AbstractController {
    constructor($scope, treeFactory) {
        super($scope)
        conf.getListChildren = 'getListChildrenSql'
        conf.readElement = 'readElement'
        this.init(treeFactory, this)
    }
}
app.controller("CarePlan001Controller", CarePlan001Controller)

// app.controller("FirstController", FirstController)
class FirstController extends AmDocAbstractController {
    constructor($scope) {
        super($scope)
        this.singlePage = singlePage
    }
}
app.controller("FirstController", FirstController)


// app.factory("edTextFactory", EdTextFactory)
class EdTextFactory {
    constructor($timeout, $q, dataFactory) {
        let timeoutChangeToSave, timeoutSecToSave
        //повтореня DWCS та запис
        let repeatDWCStoSave = (o) => {
            if (o.s.runSec > 0) {
                if (o.s.runSec < 10) {
                    console.log(o.s.runSec)
                    deferWaitChangeSave(o).then(repeatDWCStoSave)
                } else {
                    console.log('goto save', o.s.runSec)
                    o.save()
                }
            } else {
                console.error('repeatDWCS ERROR:')
            }
        }
        //deferWaitChangeSave DWCS - відкласти очікування після змін для збереження
        let deferWaitChangeSave = (o) => {
            let deferred = $q.defer()
            if (o.s.cntChange > 0) {
                if (!o.startTime) o.startTime = new Date()
                if (timeoutSecToSave) $timeout.cancel(timeoutSecToSave)
                timeoutSecToSave = $timeout(() => {
                    if (o.startTime)
                        o.s.runSec = Math.round((new Date() - o.startTime.getTime()) / 1000)
                    deferred.resolve(o)
                }, 2000)
            } else {
                // deferred.resolve(o) // endless
            }
            return deferred.promise
        }
        let o = {
            deleteEndEl: (id) => {
                let clList = d.clList[id]
                if (!clList) {
                    console.log(1, id, { delete_doc: { doc_id: id, } })
                    dataFactory.adn_delete.save({ delete_doc: { doc_id: id, } }).$promise.then((map) => {
                        console.log(1, map)
                    })
                }
            },
            sortDownElement: (id) => {
                let so = upDowntElement(id, 1)
                dataFactory.url_sql_read_db1.save(so).$promise.then((map) => {
                    console.log(map)
                })
            },
            sortUpElement: (id) => {
                let so = upDowntElement(id, -1)
                dataFactory.url_sql_read_db1.save(so).$promise.then((map) => {
                    console.log(map)
                })
            },
            hideChildren: (id) => {
                let el = d.elMap[id]
                el.hidedChildren = !el.hidedChildren
                console.log(id, el)
            },
            wikiItemAddEl: (newTagName, id) => {
                let elParent = d.elMap[id]
                let parentId = elParent.doc_id
                /**
                 * коррекція parent елемента для нового вузла даних
                 */
                if ('p|ol'.indexOf(elParent.r1value) >= 0) {//parent елемент кінцевий елемент
                    elParent = d.elMap[elParent.parent]
                }
                if ('h2' == newTagName && 'h2' == elParent.r1value) {
                    elParent = d.elMap[elParent.parent]
                } else if ('h3' == newTagName && 'h3' == elParent.r1value) {
                    elParent = d.elMap[elParent.parent]
                }
                let sqlCmdMap = {
                    next_doc_ids: 1,
                    insert_doc: {
                        calc_doc_id: 0,
                        reference: d.conf.wiki.ref[newTagName],
                        parent: elParent.doc_id,
                        insert_string: {},
                    }
                }
                console.log(newTagName, d.conf.wiki.ref[newTagName], id, elParent.r1value, elParent, sqlCmdMap)
                dataFactory.adn_insert.save(sqlCmdMap).$promise.then((map) => {
                    console.log(1, map)
                })
            },
            onChange: function () {
                let o = this
                if (timeoutChangeToSave) $timeout.cancel(timeoutChangeToSave)
                timeoutChangeToSave = $timeout(() => {
                    if (d.elMap[o.s.elEdId].value_1_22 != o.s.value_1_edit) {
                        o.s.cntChange++
                        d.elMap[o.s.elEdId].value_1_22 = o.s.value_1_edit
                        console.log('goto deferWaitChangeSave', o)
                        deferWaitChangeSave(o).then(repeatDWCStoSave)
                        if (o.s.cntChange > 3) {
                            console.log('goto save', o.s.cntChange > 3)
                            o.save()
                        }
                    }
                    console.log(o.s.cntChange, o.s.value_1_edit == d.elMap[o.s.elEdId].value_1_22)
                }, 500)
            },
            save: function () {
                let o = this
                // console.log('run save', o)
                console.log('run save', d.elMap[o.s.elId])
                o.s.cntChange = 0
                delete o.startTime
                delete o.s.runSec
                console.log(o.s.cntChange, o.s.value_1_edit)
                const paramDefaults = { doc_id: o.s.elEdId, value: o.s.value_1_edit }
                dataFactory.adn_d.save(paramDefaults).$promise.then((map) => {
                    console.log(1, map)
                })
            },
            initElEdId: function (s) {
                let o = this
                console.log(o)
                o.s = s
                o.s.d = d
                o.s.value_1_edit = d.elMap[s.elEdId].value_1_22
                console.log(s.elEdId, d.elMap[s.elEdId], s)
                o.s.cntChange = 0
                // secToSave(o)
            },
        }
        return o
    }
}
app.factory("edTextFactory", EdTextFactory)

app.directive('amEdText', () => {
    return {
        restrict: 'A',
        transclude: true,
        templateUrl: 'amEdText.html',
        controller: ['edTextFactory', EdTextController],
        controllerAs: 'ctrl',
        scope: { id: '<elEdId', },
        link: (s, e, a, c) => {
            if (d.conf.$routeParams.el_id == s.id) {
                s.elEdId = s.id
                c.edTextFactory.initElEdId(s)
                console.log(1, s)
            }
        },
    }
})

class EdTextController {
    edTextFactory
    constructor(edTextFactory) {
        return {
            edTextFactory: edTextFactory,
            wikiItemAddEl: edTextFactory.wikiItemAddEl,
            sortUpElement: edTextFactory.sortUpElement,
            sortDownElement: edTextFactory.sortDownElement,
            deleteEndEl: edTextFactory.deleteEndEl,
        }
    }
}
app.controller('EdTextController', EdTextController)

class CreateDocFactory {
    constructor(dataFactory) {
        let wikiConfigData = sql_app.simpleSQLs['WikiList']
        return {
            createDocDialog: function () { this.openedDocDialog = !this.openedDocDialog },
            createDoc: function () {
                let sqlCmdMap = {
                    next_doc_ids: 1,
                    insert_doc: {
                        calc_doc_id: 0,
                        reference: wikiConfigData.wikiReference,
                        parent: wikiConfigData.wikiFolderId,
                        insert_string: {
                            value: this.nameNewWikiDoc,
                        },
                    }
                }
                console.log(111, sqlCmdMap, sqlCmdMap.params, 1)
                console.log(2, this.nameNewWikiDoc, wikiConfigData.wikiFolderId, wikiConfigData, sqlCmdMap)
                dataFactory.adn_insert.save(sqlCmdMap).$promise.then((map) => {
                    console.log(map)
                })
            },
            deleteWikiDoc: function () {
                console.log(1)
                const configData = sql_app.simpleSQLs[sql_app.simpleSQLselect];
                sql_app.simpleSQLs[sql_app.simpleSQLselect].noDeletable = []
                angular.forEach(configData.data.list, (li) => {
                    if (li.doc_id == sql_app.simpleSQLs[sql_app.simpleSQLselect].choisedListItem) {
                        if (li.parent != wikiConfigData.wikiFolderId) {
                            sql_app.simpleSQLs[sql_app.simpleSQLselect].noDeletable.push('Файл в спеціалізованій папці, не видаляється в цьому діалозі')
                        }
                        if (li.cnt_child) {
                            sql_app.simpleSQLs[sql_app.simpleSQLselect].noDeletable.push('Файл не пустий, видаляються тільки пусті файли')
                        }
                        console.log(li.doc_id, li.parent != wikiConfigData.wikiFolderId, li, sql_app.simpleSQLs[sql_app.simpleSQLselect].noDeletable)
                    }
                })
                if (sql_app.simpleSQLs[sql_app.simpleSQLselect].noDeletable.length == 0) {//delete element - empty wiki doc
                    dataFactory.adn_delete.save({ delete_doc: { doc_id: sql_app.simpleSQLs[sql_app.simpleSQLselect].choisedListItem, } }).$promise.then((map) => {
                        console.log(map)
                    })
                }
            },
        }
    }
}
app.factory("createDocFactory", CreateDocFactory)

class CreateDocController {
    createDocFactory
    constructor(createDocFactory) {
        this.createDocFactory = createDocFactory
    }
    getChoisedListItem = () => sql_app.simpleSQLs[sql_app.simpleSQLselect].choisedListItem
}

app.directive('amCreateDoc', () => {
    return {
        restrict: 'A',
        templateUrl: 'newDocMenu.html',
        controllerAs: 'ctrl',
        controller: ['createDocFactory', CreateDocController],
    }
})

app.directive('amSqlHtml', ($compile) => {
    return {
        restrict: 'A',
        link: (s, e) => {
            let sqlE = sql_app.simpleSQLs[sql_app.simpleSQLselect]
            if (sqlE.sqlHtml) {
                if (sqlE.sqlHtml[s.k] != null) {
                    e.html(sqlE.sqlHtml[s.k])
                    $compile(e.contents())(s)
                }
            }
        },
    }
})


// app.controller("WikiListController", WikiListController)
class WikiListController extends SqlAbstractController {
    createDocFactory
    constructor(dataFactory, createDocFactory) {
        super(dataFactory)
        if (!sql_app.simpleSQLselect) sql_app.simpleSQLselect = 'WikiList'
        if (!this.data) this.readSql(sql_app.simpleSQLselect)
        //this.simpleSQLs = sql_app.simpleSQLs // :)
        this.createDocFactory = createDocFactory
    }
}
app.controller("WikiListController", WikiListController)

// app.controller("SqlController", SqlController)
class SqlController extends SqlAbstractController {
    constructor(dataFactory, $routeParams) {
        super(dataFactory)
        this.simpleSQLs = sql_app.simpleSQLs
        if ($routeParams.sql)
            d.conf.simpleSQLselect = sql_app.simpleSQLselect = $routeParams.sql
        if (!sql_app.simpleSQLselect) {
            // sql_app.simpleSQLselect = 'SQL_from_DB'
            d.conf.simpleSQLselect = sql_app.simpleSQLselect = 'WikiList'
        }
        this.choisedListItem = 0
        if (!this.data) this.readSql(sql_app.simpleSQLselect)
        this.tut = 'tutorial links'
        this.sqlAppToLink = conf.sqlAppToLink
    }
    getSelectSql = () => {
        return sql_app.simpleSQLs[sql_app.simpleSQLselect].c
    }
}
app.controller("SqlController", SqlController)

// app.config(RouteProviderConfig)
class RouteProviderConfig {
    constructor($routeProvider) {
        angular.forEach(conf.singlePagesUrl, (v, k) => {
            // console.log(k, v)
            $routeProvider.when("/" + k, v)
        })
        $routeProvider.otherwise({
            redirectTo: '/wikiList'
        })
    }
}
app.config(RouteProviderConfig)

conf.highlight = (text, search) => {
    if (!text) return
    if (!search) return text
    return ('' + text).replace(new RegExp(search, 'gi'), '<span class="w3-yellow">$&</span>')
}
conf.sqlAppToLink = (text) => {
    if (!text) return
    return ('' + text).replace(new RegExp(':(sql_app\\.)(\\w+)', 'gi'), ':<b>$1<a href="#!/sql/$2">$2</a></b>')
}
