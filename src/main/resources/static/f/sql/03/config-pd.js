conf.fr = {
    pd: {
        frn: 'PlanDefinition',
        children: ['ad','cp','mr'],
    },
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

console.log(3, conf.fr)
