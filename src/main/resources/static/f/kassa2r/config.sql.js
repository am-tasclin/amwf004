'use strict';

sql_app.SelectKassa = {
    name: 'Касса ',
    sql: 'SELECT idNom, DateProv, SumaProv,  NameKassop, NameContr,NameVal, Nal_beznal  \n\
    FROM kassa.finans \n\
    WHERE DateProv >=:d1 and DateProv<=:d2 and Pr_rasx=:p ',
    sqlHtml: {
        dateprov: "{{v | date : 'medium'}}",
    },
}



sql_app.AddKassa_VB = {
    name: 'Добавление кассового ордера',
    sql: 'INSERT INTO kassa.finans (pr_rasx, idNom, DateProv,SumaProv,NameKassOp,NameContr, nameval, nal_beznal) \n\
    VALUES (:pr, \n\
           (SELECT max(idnom)+1 FROM kassa.finans), \n\
           :Ld1, :ssum, :KassOp, :NameContr, :val, :nal)' ,
}

sql_app.GroupKassa = {
    name: 'Общая сума и кол-во проводок ',
    sql: 'SELECT COUNT(*) Count, SUM(SumaProv) SumaProv  \n\
        FROM finans \n\
        WHERE DateProv >=:d1 and DateProv<=:d2 and Pr_rasx=:P'  ,
}

sql_app.UpdateKassa = {
    name: 'Изменение номера сопутствующего документа',
    sql: 'UPDATE finans SET idDoc=:LIdDoc WHERE idNom=:LidNom',
}

sql_app.DeleteKassa = {
    name: 'Удаление проводки',
    sql: 'DELETE FROM kassa.finans WHERE idNom=:LidNom',
}

sql_app.SpContragent = {
    name: 'Справочник контрагентов',
    sql: ' SELECT IdNomContr, NameContr FROM  SpContragents ORDER BY NameContr',
}

sql_app.SpGrupKassOp = {
    name: 'Справочник групп кассових операций',
    sql: ' SELECT IdNomGrupKassOp, NameGrupKassOp, Pr_Rasx FROM SpGrupKassOp ORDER BY NameGrupKassOP',
}


sql_app.SpKassOp = {
    name: 'Справочник кассових операций',
    sql: 'SELECT IdNomKassOP, NameKassOp, IdNomGrupKassOp,Pr_rasx FROM SpKassOp ORDER BY  Pr_rasx,  NameKassOp, IdNomGrupKassOp',
}

sql_app.SpValut = {
    name: 'Справочник валют',
    sql: 'SELECT IdNomVal, NameVal FROM SpVal ORDER BY NameVal',
}
