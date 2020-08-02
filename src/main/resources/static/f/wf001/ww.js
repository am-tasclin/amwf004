app.controller('AppCtrl', function ($scope, $http, $timeout) {
	ctrl = this
	initApp($scope, $http, $timeout)
	ctrl.page_title = 'wf_run001:'
	read2 = new Read2($http)
	initWF001()
	initWF_run001()
	var read_invoices_parent = 371960
	readDataAsTable(read_invoices_parent)
	
})

var readDataAsTable = function (dataId) {
	console.log(dataId)
	read2.sql1({
		fn: function (response) {
			var o = response.data.list[0]
			o.sql = "SELECT * FROM doc d \n"
			if (o.reference) {
				if (25 == o.rtype) {
					o.sql += "LEFT JOIN (SELECT value v_" + o.rtype + "_" + o.reference 
					+ ", timestamp_id FROM timestamp ) t ON timestamp_id=d.doc_id \n"
				}
			}
			o.sql += "WHERE parent = " + dataId
			ctrl.readTable = o
			// console.log(ctrl.readTable, this.params, o.sql)
			read2.sql1({fn:function(response){
				o.dataList = response.data.list
				console.log(ctrl.readTable, ctrl.readTable.sql)
			},params:{
				sql:o.sql
			}})
			var sql_table_cols 
			= "SELECT doc_id c_id, value c_name, doctype c_type FROM sort, doc \n"
			+"LEFT JOIN string ON string_id=doc_id \n"
			+"WHERE parent = " + o.r2
			+" AND sort_id=doc_id \n"
			+"ORDER BY sort "
			read2.sql1({params:{sql:sql_table_cols}, fn:function(response){
				o.cols = response.data.list
			}})
		}, params: {
			sql: "SELECT d2.doctype rtype, rv.value rname, d0.reference2 r2, d1.* \n"
				+ "FROM  doc d0, doc d2, doc d1 \n"
				+ "LEFT JOIN string rv on string_id=d1.reference \n"
				+ " WHERE d1.parent = " + dataId
				+ " AND d0.doc_id=d1.parent "
				+ "AND d2.doc_id=d1.reference LIMIT 1 "
		}
	})
}

var createInsertFromElement = function (e) {
	console.log(e.doc_id)
	e.sql_insert = 'INSERT INTO doc (:vars) VALUES (:vals);'
	var vars = 'doc_id', vals = ':nextDbId1'
	angular.forEach(e.children, function (e3) {
		var r2vEl = ctrl.eMap[e3.reference2]
		console.log(e3.doc_id, e3.reference, r2vEl)
		vals += ', ' + e3.reference2
		vars += ', '
		if (e3.reference == 371969) {//parent
			vars += 'parent'
		} else
			if (e3.reference == 371970) {//reference
				vars += 'reference'
				console.log(e3.reference2, r2vEl.doctype
					, ctrl.doctype_content_table_name[r2vEl.doctype]
				)
				if (r2vEl) {
					e.sql_insert += '\n'
					e.sql_insert += 'INSERT INTO :valueType (:valueType_id, value) VALUES (:nextDbId1, :contentVal);'
					var valueType = ctrl.doctype_content_table_name[r2vEl.doctype]
					e.sql_insert = e.sql_insert.replace(':valueType', valueType)
					e.sql_insert = e.sql_insert.replace(':valueType', valueType)
					if (25 == r2vEl.doctype) {/** timestamp */
						var d = new Date(e.valueDate)
						d.setHours(e.valueHH)
						d.setMinutes(e.valueMM)
						console.log(e)
						var contentVal = d.toISOString().replace('T', ' ').split('.')[0]
					}
					e.sql_insert = e.sql_insert.replace(':contentVal', "'" + contentVal + "'")
				}
			}
	})
	e.sql_insert = e.sql_insert.replace(':vars', vars)
	e.sql_insert = e.sql_insert.replace(':vals', vals)
	var sql1 = sql_app.SELECT_obj_with_i18n(':nextDbId1')
	console.log(vars, vals)
	console.log(e.sql_insert)
	writeSql({
		sql: e.sql_insert,
		dataAfterSave: function (response) {
			console.log(response.data)
		}
	})
}

var findNodesWithRef = function (e, refIds, fn) {
	var fN = []
	angular.forEach(e.children, function (e1) {
		if (
			refIds.indexOf(e1.reference) >= 0
			|| refIds.indexOf(e1.reference2) >= 0
		) {
			fN.push(e1)
			if (fn) fn(e1)
		}
	})
	return fN
}

var findActivityDefinitionTasks = function (adEl) {
	var fN = []
	var adNodes = findNodesWithRef(adEl, [369917])//ActivityDefinition
	angular.forEach(adNodes, function (e1) {
		angular.forEach(e1.instantiatesCanonical, function (e2) {
			fN.push(e2)
		})
	})
	return fN
}

var initWF_run001 = function () {
	ctrl.wfRun = {}
	ctrl.seekChildAttEqual = function (e, a, v) {
		var rE
		angular.forEach(e.children, function (eC) {
			if (eC[a] == v) {
				rE = eC
			}
		})
		return rE
	}

	ctrl.wfRun.clickActivityDefinition = function (adEl) {
		console.log(adEl)
		var tasks = findActivityDefinitionTasks(adEl)
		angular.forEach(tasks, function (id) {
			findNodesWithRef(ctrl.eMap[id], [371935]/*output*/, function (eOut) {
				findNodesWithRef(eOut, [371968]/*Element*/, function (el) {
					angular.forEach(el.children, function (elAtt) { /*Element@attributes*/
						// console.log(elAtt.doc_id, elAtt.reference, elAtt.reference2, ctrl.eMap[elAtt.reference2])
						if (!ctrl.eMap[elAtt.reference2]) {
							read_element(elAtt.reference2, function () {
								var elAttDef = ctrl.eMap[elAtt.reference2]
								// console.log(elAttDef, elAtt.reference)
								if (371970 == elAtt.reference) {/*data type - Element@attributes[reference] */
									if (25 == elAttDef.doctype) {/** timestamp */
										var defData = new Date()
										el.valueDate = defData
										el.valueHH = defData.getHours()
										el.valueMM = defData.getMinutes()
										el.defData = defData.toISOString()
										console.log(defData.toISOString(), el)
									}
								}
							})
						}
					})
				})
			})
		})
	}

	ctrl.wfRun.clickTask = function (tEl) {
		angular.forEach(tEl.children, function (e) {
			if (e.reference == 371935) {//output
				angular.forEach(e.children, function (e2) {
					if (e2.reference == 371968) {//Element - metadata
						createInsertFromElement(e2)
					}
				})
			}
		})
	}

}
