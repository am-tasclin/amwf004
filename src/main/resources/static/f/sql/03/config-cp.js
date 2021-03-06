conf.fr = {
    cp: {
        frn: 'CarePlan',
        children: ['mr'],
        sql_app: 'tableOfFHIR_CarePlan',
        sql_app_children: [{ fr: 'mr', sql_app: 'tableOfFHIR_CarePlan_plannedActivityReference_mr' }],
        amRsRowHtml: '<span>{{r.fhir_domainresource}}</span>',
    },
    mr: {
        frn: 'MedicationRequest',
        children: ['mn', 'de'],
        sql_app: 'tableOfFHIR_MedicationRequest_sc_doseQuantityTimingPeriod',
        amRsRowHtml: '<span>{{r.substance_code}} \n\
        {{r.n_quantity_value}}</span> \n\
        <span>{{r.quantity_value}} {{r.quantity_code}}</span> \n\
        <span data-ng-if="r.timing_id">кожні {{r.period}} {{r.periodunit}}</span>',
    },
    de: {
        frn: 'Dosage',
        children: ['qy', 'tg'],
        sql_app: 'tableOfFHIR_doseQuantity_timingPeriod',
        amRsRowHtml: '<span>{{r.quantity_value}} {{r.quantity_code}}</span> \n\
        <span data-ng-if="r.timing_id">кожні {{r.period}} {{r.periodunit}}</span>',
    },
    tg: {
        frn: 'Timing',
        sql_app: 'tableOfFHIR_Timing_period',
        amRsRowHtml: '<span>кожні {{r.period}} {{r.periodunit}}</span>',
    },
    mn: {
        frn: 'Medication',
        children: ['se', 'ro', 'qy'],
        sql_app: 'tableOfFHIR_Medication_sc',
        amRsRowHtml: '<span title="mn:{{r.medication_id}}"> {{r.substance_code}}\n\
        <span title="ro:{{r.strength_id}}" data-ng-if="r.strength_id">\n\
        <span title="n_qy:{{r.n_quantity_id}}">\n\
        {{r.n_quantity_value}} {{r.n_quantity_code}}\n\
        </span>\n\
        / \n\
        <span title="d_qy:{{r.n_quantity_id}}">\n\
        {{r.dn_quantity_value}} {{r.dn_quantity_code}}\n\
        </span></span></span>',
    },
    se: {
        frn: 'Substance',
        sql_app: 'tableOfFHIR_Substance_code',
        amRsRowHtml: '<span>{{r.substance_code}}</span>',
    },
    ro: {
        frn: 'Ratio',
        children: ['qy'],
        sql_app: 'tableOfFHIR_Ratio',
        amRsRowHtml: '{{r.n_quantity_value}} {{r.n_quantity_code}}/{{r.dn_quantity_value}} {{r.dn_quantity_code}}'
    },
    qy: {
        frn: 'Quantity',
        sql_app: 'tableOfFHIR_Quantity',
        amRsRowHtml: '<span> {{r.quantity_value}} {{r.quantity_code}}</span>',
    },
}
