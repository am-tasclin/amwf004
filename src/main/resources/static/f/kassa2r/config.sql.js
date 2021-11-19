'use strict';

sql_app.SelectKassa = {
    name: 'Касса ',
    sql: 'SELECT idNom, DateProv, SumaProv, IdNomKassOp, NameKassop, IdNomVal,NameVal,Pr_rasx, IdDoc  \n\
    FROM kassa.finans \n\
    WHERE DateProv >=:d1 and DateProv<=:d2 and Pr_rasx=:p ',
    sqlHtml: {
        dateprov: "{{v | date : 'medium'}}",
	},
}

sql_app.AddKassa = {
    name: 'Добавление кассового ордера',
    sql: 'INSERT INTP finans (idNom, DateProv, SumaProv, IdNomKassOp, NameKassop, IdNomVal,NameVal,Pr_rasx, IdDoc) \n\
    VALUES  ( \n\
       (SELECT COUNT(*)+1 FROM kassa.finans) , \n\
       :Ld1, :Lsuma,\n\
       :LIdKassOp,   (SELECT NameKassOp FROM SpKassOp WHERE IdKassOp=:LidKassOp), \n\
       :LidNomVal,   (SELECT NameVal    FROM SpValut  WHERE IdNomVal=:LidNomVal), \n\
       :Lpr, :lIdDoc)' ,
}

sql_app.AddKassa_VB = {
    name: 'Добавление кассового ордера',
    sql: 'INSERT INTO kassa.finans (pr_rasx, idNom, DateProv,SumaProv) \n\
    VALUES (1, \n\
           (SELECT COUNT(*)+1 FROM kassa.finans), \n\
           :Ld1, :ssum)' ,
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
