class AbstractController { singlePage = singlePage; conf = conf }

class SqlAbstractController extends AbstractController {
    dataFactory
    constructor(dataFactory) {
        super()
        this.dataFactory = dataFactory
    }
    readSql2R = sqlN => {
        let sql = sql_app[sqlN].sql
        while (sql.includes(':sql_app.')) {
            let sql_name = sql.split(':sql_app.')[1].split(' ')[0]
            let sql_inner = this.readSql2R(sql_name)
            sql = sql.replace(':sql_app.' + sql_name, sql_inner)
        }
        return sql
    }
    readSql = sqlN => {
        let ctrlSql = this
        sql_app.simpleSQLselect = this.simpleSQLselect = sqlN
        sql_app.simpleSQLs[sql_app.simpleSQLselect].choisedListItem = 0
        let sql = sql_app.simpleSQLs[sqlN].c
        console.log(sqlN + '::', sql.includes(':sql_app.'))
        if (sql.includes(':sql_app.')) {
            let sql_split = sql.split(':sql_app.')
            let sql_name = sql_split[1].split(' ')[0]
            console.log(sql_name)
            sql = sql.replace(':sql_app.' + sql_name, sql_app[sql_name]())
            if (sql.includes(':sql_app.')) {
                let sql_split = sql.split(':sql_app.')
                let sql_name = sql_split[1].split(' ')[0]
                sql = sql.replace(':sql_app.' + sql_name, sql_app[sql_name]())
                if (sql.includes(':sql_app.')) {
                    let sql_split = sql.split(':sql_app.')
                    let sql_name = sql_split[1].split(' ')[0]
                    sql = sql.replace(':sql_app.' + sql_name, sql_app[sql_name]())
                    if (sql.includes(':sql_app.')) {
                        let sql_split = sql.split(':sql_app.')
                        let sql_name = sql_split[1].split(' ')[0]
                        sql = sql.replace(':sql_app.' + sql_name, sql_app[sql_name]())
                        if (sql.includes(':sql_app.')) {
                            let sql_split = sql.split(':sql_app.')
                            let sql_name = sql_split[1].split(' ')[0]
                            sql = sql.replace(':sql_app.' + sql_name, sql_app[sql_name]())
                            if (sql.includes(':sql_app.')) {
                                let sql_split = sql.split(':sql_app.')
                                let sql_name = sql_split[1].split(' ')[0]
                                sql = sql.replace(':sql_app.' + sql_name, sql_app[sql_name]())
                                if (sql.includes(':sql_app.')) {
                                    let sql_split = sql.split(':sql_app.')
                                    let sql_name = sql_split[1].split(' ')[0]
                                    sql = sql.replace(':sql_app.' + sql_name, sql_app[sql_name]())
                                    if (sql.includes(':sql_app.')) {
                                        let sql_split = sql.split(':sql_app.')
                                        let sql_name = sql_split[1].split(' ')[0]
                                        sql = sql.replace(':sql_app.' + sql_name, sql_app[sql_name]())
                                        if (sql.includes(':sql_app.')) {
                                            let sql_split = sql.split(':sql_app.')
                                            let sql_name = sql_split[1].split(' ')[0]
                                            sql = sql.replace(':sql_app.' + sql_name, sql_app[sql_name]())
                                            if (sql.includes(':sql_app.')) {
                                                let sql_split = sql.split(':sql_app.')
                                                let sql_name = sql_split[1].split(' ')[0]
                                                sql = sql.replace(':sql_app.' + sql_name, sql_app[sql_name]())
                                                if (sql.includes(':sql_app.')) {
                                                    let sql_split = sql.split(':sql_app.')
                                                    let sql_name = sql_split[1].split(' ')[0]
                                                    sql = sql.replace(':sql_app.' + sql_name, sql_app[sql_name]())
                                                    if (sql.includes(':sql_app.')) {
                                                        let sql_split = sql.split(':sql_app.')
                                                        let sql_name = sql_split[1].split(' ')[0]
                                                        sql = sql.replace(':sql_app.' + sql_name, sql_app[sql_name]())
                                                        if (sql.includes(':sql_app.')) {
                                                            let sql_split = sql.split(':sql_app.')
                                                            let sql_name = sql_split[1].split(' ')[0]
                                                            sql = sql.replace(':sql_app.' + sql_name, sql_app[sql_name]())
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        console.log(sql)
        this.dataFactory.httpGet({ sql: sql })
            .then((dataSqlRequest) => {
                sql_app.simpleSQLs[sqlN].data = ctrlSql.data = dataSqlRequest
                console.log(2, sqlN, dataSqlRequest)
            })
    }
    getChoisedListItem = () => !sql_app.simpleSQLselect ? '' :
        sql_app.simpleSQLs[sql_app.simpleSQLselect].choisedListItem
    choiseListItem = r => {
        delete sql_app.simpleSQLs[sql_app.simpleSQLselect].noDeletable
        sql_app.simpleSQLs[sql_app.simpleSQLselect].choisedListItem = r.doc_id
    }
}
