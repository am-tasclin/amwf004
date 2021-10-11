'use strict'
console.log(144441)
sql_app.EpisodeOfCare_Patient = {
    name:'Епізод',
    sql:'SELECT ee.doc_id episode_id, ee.reference2 patient_id, tsps.value tsps_v, ps.doc_id tsps_id FROM doc ee \n\
    LEFT JOIN doc ps \n\
    LEFT JOIN timestamp tsps ON tsps.timestamp_id=ps.doc_id \n\
    ON ps.parent=ee.doc_id AND ps.reference2=368679 \n\
    WHERE ee.reference=368896',
}
sql_app.ICPC2_ua = {
    name:'ICPC2 українською',
    sql:'SELECT s.*, su.value code, sua.value i18n, dua.doc_id \n\
    FROM doc dp, doc d \n\
    LEFT JOIN string s ON s.string_id=d.doc_id \n\
    LEFT JOIN string_u su ON su.string_u_id=d.doc_id \n\
    LEFT JOIN doc dua \n\
    LEFT JOIN string sua ON sua.string_id=dua.doc_id \n\
    ON dua.reference=d.doc_id \n\
    WHERE dp.doc_id=d.parent AND dp.parent=285598 AND dua.parent=285597',
}
sql_app.Patient_family_name = {
    name:'Пацієнти',
    sql:'SELECT p.doc_id patient_id, hn.* FROM doc p \n\
    LEFT JOIN (:sql_app.HumanName_family_name ) hn ON hn.family_id = p.reference2  \n\
    WHERE p.reference=373423',
    sqlHtml: {
        patient_id:'<a data-ng-click="ctrl.clickPatient(r)" href="#!/hy?pt={{r.patient_id}}"> {{r[k]}} </a>',
    },
}
sql_app.HumanName_family_name = {
    name:"Ім'я Призвище",
    sql:'SELECT n.value name_v, f.value family_v, d.doc_id family_id, dn.doc_id name_id FROM doc d \n\
    LEFT JOIN string f ON d.doc_id=f.string_id \n\
    LEFT JOIN doc dn ON d.doc_id=dn.parent AND dn.reference=372117 \n\
    LEFT JOIN string n ON dn.doc_id=n.string_id \n\
    WHERE d.reference = 372116',
}