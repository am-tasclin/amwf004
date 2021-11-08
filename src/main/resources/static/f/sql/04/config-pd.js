'use strict';
const conf = {}
conf.FHIR_app = {}
conf.FHIR_app.TagIdName = tag => conf.FHIR[tag].frname.toLowerCase() + '_id'

conf.FHIR = {}
conf.FHIR.pd = {
    frname: 'PlanDefinition',
    children: ['ad', 'cp', 'mr'],
    controller:'PlanDefinitionController',
    sqlName:'FHIR_PlanDefinition'
}
conf.FHIR.ad = {
    frname: 'ActivityDefinition',
    children: ['tk'],
}
conf.FHIR.tk = {
    frname: 'Task',
}
conf.FHIR.td = {
    frname: 'TriggerDefinition',
}
conf.FHIR.cp = {
    frname: 'CarePlan',
    children: ['mr'],
}
conf.FHIR.mr = {
    frname: 'MedicationRequest',
}
conf.FHIR.qy = {
    frname: 'Quantity',
}

console.log(conf.FHIR)
