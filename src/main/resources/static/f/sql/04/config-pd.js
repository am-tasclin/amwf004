'use strict';
//const conf = {}
// conf.FHIR_app = {}
sql_app.FHIR = {}
sql_app.FHIR.TagIdName = tag =>
    conf.FHIR[tag].frname.toLowerCase() + '_id'

conf.FHIR = {}
conf.FHIR.pd = {
    frname: 'PlanDefinition',
    children: ['ad', 'cp', 'mr'],
    controller: 'PlanDefinitionController',
    sqlName: 'FHIR_PlanDefinition',
    sql_app_children: {
        PlanDefinition_action_title:
        {
            frKey: 'ad',
            sql: 'SELECT * FROM (:sql_app.PlanDefinition_action_title ) x \n\
            WHERE pd_id=:pd_id',
        },
    },
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

//console.log(conf.FHIR)
