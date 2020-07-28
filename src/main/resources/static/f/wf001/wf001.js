var initWF001 = function(){
	console.log('read -> ',111)

	if(ctrl.request.parameters.p){
		console.log('read -> ', ctrl.request.parameters.p)
		read_element_descendant(ctrl.request.parameters.p
		, function(){
			ctrl.project = ctrl.eMap[ctrl.request.parameters.p]
			console.log('read -> ',ctrl.project.doc_id)
		}, function(ad,response){
			if(369917==ad.reference2){//ActivityDefinition
				readSql({ref2: ad.doc_id, //Task.instantiatesCanonical(ActivityDefinition)
				sql:'SELECT parent FROM doc where reference2=:ref2 and reference=371927',
				afterRead:function(response){
					angular.forEach(response.data.list, function(task_iC_AD){
						if(!ad.instantiatesCanonical)	ad.instantiatesCanonical = []
						read_element_descendant(task_iC_AD.parent, function(){
							ad.instantiatesCanonical.push(ctrl.eMap[task_iC_AD.parent].doc_id)
						})
					})
				}
			})
			}
		})
	}

	// var  read_invoices_sql = 371989
	// read2_element(read_invoices_sql,{fn:function(response){
	// 	read2_element_children(read_invoices_sql, {fnAfter:function(response){
	// 		var e = ctrl.eMap[read_invoices_sql]
	// 		// console.log(e, e.sql)
	// 	}})
	// }})
}


var read2_element = function (doc_id, fnObj) {
	var o = ctrl.eMap[doc_id]
	if (!o) {
		var sql = sql_app.SELECT_obj_with_i18n(doc_id)
		read2.http.get(read2.url
			, { params: { sql: sql } })
			.then(function (response) {
				var d = response.data.list[0]
				// console.log(d, doc_id)
				ctrl.eMap[d.doc_id] = d
				if (fnObj && fnObj.fn) (
					fnObj.fn(response)
				)
			})
	}
}

var read2_element_children = function (doc_id, fnObj) {
	var o = ctrl.eMap[doc_id]
	if (o && o.cnt_child > 0 && (!o.children || o.children.length < o.cnt_child)) {
		var sql = sql_app.SELECT_children_with_i18n(doc_id)
		read2.http.get(read2.url
			, { params: { sql: sql } })
			.then(function (response) {
				angular.forEach(response.data.list, function (d) {
					ctrl.eMap[d.doc_id] = d
					var parent = ctrl.eMap[d.parent]
					if (parent) {
						if (!parent.children) {
							parent.children = []
						}
						parent.children.push(d)
					}

				})
				if (o.reference == 371968) {/** Element */
					if (o.reference2 == 371985) {/** SQL.SELECT */
						buildElementSelect(o)
					}
				}
				if (fnObj && fnObj.fnAfter) (
					fnObj.fnAfter(response)
				)
			})

	}
}

var buildElementSelect = function (el) {
	var addWhere
	el.sql = 'SELECT * FROM doc d \n'
	if(el.doctype == 25){/**value.timestamp */
		el.sql += 'LEFT JOIN timestamp ts ON ts.timestamp_id=d.doc_id \n'
	}
	angular.forEach(el.children, function (elC) {
		if (elC.reference == 371992) {/**SELECT.WHERE.parent */
			addWhere = 'parent = ' + elC.reference2
		}
	})
	el.sql += ' WHERE '+addWhere
	// console.log(el, el.sql)
}

var read2
class Read2 {
	constructor($http) {
		this.http = $http
		this.url = '/r/url_sql_read_db1'
		this.sql1 = function(a){
			read2.http.get(read2.url, {params:a.params})
			.then(function(response){
				a.fn(response)
			})
		}
	}
}
