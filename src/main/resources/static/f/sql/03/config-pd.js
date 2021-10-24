conf.fr = {}

conf.fr.pd = {
    frn: 'PlanDefinition',
    children: ['ad', 'cp', 'mr'],
    sql_app: 'FHIR_PlanDefinition',
    amRsRowHtml: '<span>{{r.value}}</span>',
    sql_app_children001: {
        action: {
            connect_param: 'pd_id',
            col_id_name:'title_id',
            col_text_name:'action_title',
            sql_app: 'FHIR_PlanDefinition_title',
        },
    },
}
conf.fr.ad = {
    frn: 'ActivityDefinition',
    children: ['tk'],
}
conf.fr.tk = {
    frn: 'Task',
}
conf.fr.td = {
    frn: 'TriggerDefinition',
}
conf.fr.cp = {
    frn: 'CarePlan',
    children: ['mr'],
}
conf.fr.mr = {
    frn: 'MedicationRequest',
    sql_app: 'tableOfFHIR_MedicationRequest_sc',
}
conf.fr.qy = {
    frn: 'Quantity',
    sql_app: 'tableOfFHIR_Quantity',
}


console.log(3, conf.fr)
