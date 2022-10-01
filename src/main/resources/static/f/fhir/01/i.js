'use strict'
app.config(RouteProviderConfig)
class PageLogicFactory extends PageLogic0Factory {
    constructor(dataFactory) {
        super(dataFactory)
        console.log(123)
        dataFactory.sqlRowLimit = 200
        this.dataFactory.readSql(
            sql_app.DomainResource01.sql,
            r => {
                console.log(r)
                this.session.DomainResource = r.list
            }
        )
    }
}; app.factory('pageLogic', PageLogicFactory)

class InitPageController extends AbstractController {
    constructor(dataFactory, pageLogic) {
        super(dataFactory)
        this.pl = pageLogic
    }
}; app.controller('InitPageController', InitPageController)


sql_app.DomainResource01 = {
    name: 'DomainResource',
    sql: 'SELECT * FROM doc \n\
    LEFT JOIN string ON string_id=doc_id \n\
    WHERE reference= 369789 \n\
    ORDER BY value',
}
