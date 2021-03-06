conf.fr = {
    cp: {
        frn: 'CarePlan',
        children: ['mr'],
    },
    mr: {
        frn: 'MedicationRequest',
        children: ['mn'],
        sql_app: 'tableOfFHIR_MedicationRequest_sc',
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
    },
}
