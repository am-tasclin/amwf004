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
        NewEl: {
            amRsRowHtml: "Нове <b>призначеня ліків</b>, прив'язка з медикаментом та інструкцією дозування.",
            sqlCmdMap: {
                next_doc_ids: 1,
                insert_doc: {
                    calc_doc_id: 0,
                    reference: 371469, //[371469] medication {369993:Medication} 
                    parent: 371312, // [371312] дані:369358 {368833:MedicationRequest} 
                }
            }
        },
        amRsRowHtml: '<span>{{r.substance_code}} \n\
        {{r.n_quantity_value}}</span> \n\
        <span>{{r.quantity_value}} {{r.quantity_code}}</span> \n\
        <span data-ng-if="r.timing_id">кожні {{r.period}} {{r.periodunit}}</span> \n\
        <span class="w3-tiny" data-ng-if="!r.medication_id">id={{r.medicationrequest_id}}</span>',
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
        NewEl: { amRsRowHtml: "Новий <b>лікувальний засіб</b>." },
        amRsRowHtml: '<span title="mn:{{r.medication_id}}"> {{r.substance_code}}\n\
        <span title="ro:{{r.strength_id}}" data-ng-if="r.n_quantity_id">\n\
        <span title="n_qy:{{r.n_quantity_id}}">\n\
        {{r.n_quantity_value}} {{r.n_quantity_code}}\n\
        </span> \n\
        <span  data-ng-if="r.dn_quantity_id" \n\
        title="d_qy:{{r.dn_quantity_id}}"> \n\
        / \n\
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
        NewEl: { amRsRowHtml: "Створити нове <b>співвідношення</b>, величини кількість як чисельник в зв'язку величина кількість як знаменник." },
        amRsRowHtml: '{{r.n_quantity_value}} {{r.n_quantity_code}}/{{r.dn_quantity_value}} {{r.dn_quantity_code}}'
    },
    qy: {
        frn: 'Quantity',
        sql_app: 'tableOfFHIR_Quantity',
        amRsRowHtml: '<span> {{r.quantity_value}} {{r.quantity_code}}</span>',
    },
}
console.log(1)
