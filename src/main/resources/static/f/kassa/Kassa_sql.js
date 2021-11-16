
let sql_app = {}

sql_app.SelectKassa = {
    name: 'Касса ',
    sql: 'SELECT idNom, DateProv, SumaProv, IdNomKassOp, NameKassop, IdNomVal,NameVal,Pr_rasx, IdDoc  \n\
    From kassa.finans \n\
    Where DateProv >=:d1 and DateProv<=:d2 and Pr_rasx=:p '  ,
}

sql_app.AddKassa = {
    name: 'Добавление кассового ордера',
    sql: ' insert into finans (idNom, DateProv, SumaProv, IdNomKassOp, NameKassop, IdNomVal,NameVal,Pr_rasx, IdDoc) \n\
    VALUES  ( \n\
       (SELECT Count(*)+1 from finans) , \n\
       :Ld1, :Lsuma,\n\
       :LIdKassOp,   (select NameKassOp from SpKassOp where IdKassOp=:LidKassOp), \n\
       :LidNomVal,   (select NameVal  from SpValut where IdNomVal=:LidNomVal), \n\
       :Lpr, :lIdDoc)' ,
}

sql_app.GroupKassa = {
    name: 'Общая сума и кол-во проводок ',
    sql: ' SELECT count(*) Count, Sum(SumaProv) SumaProv  \n\
        FROM finans \n\
        WHERE DateProv >=:d1 and DateProv<=:d2 and Pr_rasx=:P'  ,
}

sql_app.UpdateKassa = {
    name: 'Изменение номера сопутствующего документа',
    sql: 'UPDATE finans SET idDoc=:LIdDoc WHERE idNom=:LidNom',
}

sql_app.DeleteKassa = {
    name: 'Удаление проводки',
    sql: 'DELETE FROM kassa.finans  WHERE idNom=:LidNom',
}