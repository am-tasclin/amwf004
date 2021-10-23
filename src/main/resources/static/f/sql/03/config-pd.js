conf.fr = {
    ad: {
        frn: 'ActivityDefinition',
        children: ['tk'],
    },
    cp: {
        frn: 'CarePlan',
        children: ['mr'],
    },
    mr: {
        frn: 'MedicationRequest',
        sql_app: 'tableOfFHIR_MedicationRequest_sc',
    },
    qy: {
        frn: 'Quantity',
        sql_app: 'tableOfFHIR_Quantity',
    },
    td: {
        frn: 'TriggerDefinition',
    },
    tk: {
        frn: 'Task',
    },
}

conf.fr.pd = {
    frn: 'PlanDefinition',
    children: ['ad','cp','mr'],
    sql_app: 'FHIR_PlanDefinition',
    amRsRowHtml: '<span>{{r.value}}</span>',
}

console.log(3, conf.fr)
