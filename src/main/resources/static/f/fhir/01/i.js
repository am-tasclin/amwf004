'use strict'
class InitPageController extends AbstractController {
    constructor(dataFactory, pageLogic) {
        super(dataFactory)
        this.pl = pageLogic
    }
}; app.controller('InitPageController', InitPageController)

class PageLogicFactory extends PageLogic0Factory {
    constructor(dataFactory) {
        super(dataFactory)
        dataFactory.sqlRowLimit = 200
        this.dataFactory.readSql(sql_app.DomainResource01.sql
            , r => this.session.DomainResource = r.list)
        this.dataFactory.readSql(sql_app.BackboneElement01.sql
            , r => this.session.BackboneElement = r.list)
        this.dataFactory.readSql(sql_app.BackboneElement02.sql
            , r => this.session.BackboneElement02 = r.list)
    }        
}; app.factory('pageLogic', PageLogicFactory)    

sql_app.BackboneElement02 = {
    name: 'BackboneElement імена що повторюються',
    sql: 'SELECT ps.value ps, n v, d.* FROM doc d \n\
    left join string ps on ps.string_id=d.parent , \n\
    ( SELECT doc_id, value n FROM doc, string where string_id=doc_id AND parent = 375830 \n\
    ) aat \n\
    WHERE d.reference=aat.doc_id',
}
sql_app.BackboneElement01 = {
    name: 'BackboneElement',
    sql: 'SELECT ps.value ps, s.value v, d.* FROM doc d \n\
    LEFT JOIN string s ON s.string_id=d.doc_id \n\
    LEFT JOIN string ps ON ps.string_id=d.parent \n\
    WHERE d.reference= 369784 \n\
    AND d.parent != 375830 \n\
    ORDER BY ps.value, s.value',
}

sql_app.DomainResource01 = {
    name: 'DomainResource',
    sql: 'SELECT * FROM doc \n\
    LEFT JOIN string ON string_id=doc_id \n\
    WHERE reference= 369789 \n\
    ORDER BY value',
}
