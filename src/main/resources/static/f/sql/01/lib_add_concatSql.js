'use strict';
console.log(123)
sql_app.concatSql = (sql) => {
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
            }
        }
    }
    return sql
}