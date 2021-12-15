'use strict';
class List2Controller { bloodgroup = bloodgroup }

class List1Controller extends List2Controller {
    constructor() { super() }
    seek = 'sl1'
}

class List3Controller {

    constructor(dataFactory) { this.dataFactory = dataFactory }

    click_spcontragent_seek = () => {
        this.iewList = true
        console.log(sql_app.spcontragent)
        console.log(this.seek, 1, sql_app.spcontragent.sql, 2, this.dataFactory)
        let sql = sql_app.spcontragent.sql
        if (this.seek)            sql += ' WHERE namecontr LIKE (\'%' + this.seek + '%\')'
        console.log(sql)
        this.dataFactory.httpGetSql({ sql: sql }
        ).then(responceData => {
            this.data = responceData
            console.log(this.data)
        })
    }

}

app.factory("dataFactory", RWDataFactory)
app.controller('L1Ctrl', List1Controller)
app.controller('L2Ctrl', List2Controller)
app.controller('L3Ctrl', List3Controller)

// to tutorial 2
const bloodgroup = {
    list: [
        { "Id": "1", "Name": "O+" },
        { "Id": "2", "Name": "O-" },
        { "Id": "3", "Name": "A+" },
        { "Id": "4", "Name": "A-" },
        { "Id": "5", "Name": "B+" },
        { "Id": "6", "Name": "B-" },
        { "Id": "7", "Name": "AB+" },
        { "Id": "8", "Name": "AB-" }],
    value: '8',
    clickCount: 0,
}
console.log(bloodgroup)

sql_app.spcontragent = {
    name: 'Контрагенти',
    sql: 'SELECT * FROM kassa.spcontragents',
}