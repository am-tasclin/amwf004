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


//***PlanDefinition***
var createPlanDefinition = function (name)
{
    var result = new Object();
    result.name = name;
    //result.doc_id=
    //result.name_id=
    result.action = [];

//TODO UPDATE DB

    return result;
}

var updatePlanDefinitionName = function (planDefinitionElement, newName)
{
planDefinitionElement.name = newName;
//TODO UPDATE DB
}

var deletePlanDefinition = function (planDefinitionElement)
{
    angular.forEach(planDefinitionElement.action, function (activity) {
            deleteActivityDefinition(activity);
		});

    //TODO UPDATE DB
}
//******************


//***ActivityDefinition***
var createActivityDefinition = function (planDefinitionElement, name)
{
    var result = new Object();
    result.name = name;
    //result.doc_id=
    //result.name_id=
    result.Task = [];

    planDefinitionElement.action.push(result);

//TODO UPDATE DB

    return result;
}

var deleteActivityDefinition = function (activityDefinitionElement)
{
    angular.forEach(activityDefinitionElement.Task, function (task) {
        deleteTask(task);
		})
    //TODO UPDATE DB
}

var updateActivityDefinitionName = function (activityDefinitionElement, newName)
{
activityDefinitionElement.name = newName;
//TODO UPDATE DB
}
//******************


//***Task***
var createTask = function (activityDefinitionElement, name)
{
    var result = new Object();
    result.name = name;
    //result.doc_id=
    //result.name_id=

    //TODO manage input and output
    activityDefinitionElement.Task.push(result);

//TODO UPDATE DB

    return result;
}
var updateTaskName = function (taskElement, newName)
{
taskElement.name = newName;
//TODO UPDATE DB
}
var deleteTask = function (taskElement)
{
       delete taskElement;
    //TODO UPDATE DB
}
//******************


var findActivityDefinitionTasks = function (activityDefinitionElement) {
	var fN = []
	var activityDefinitionNodes = findNodesWithRef(activityDefinitionElement, [371999])//ActivityDefinition.name
	console.log(activityDefinitionNodes, activityDefinitionElement.doc_id)
	angular.forEach(activityDefinitionNodes, function (e1) {
		console.log(e1)
		angular.forEach(e1.instantiatesCanonical, function (e2) {
			fN.push(e2)
		})
	})
	return fN
}

var readDataAsTable = function (dataId) {
	console.log("readDataAsTable: ", dataId)
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

var findNodesWithRef = function (element, refIds, fn) {
	var fN = []
	angular.forEach(element.children, function (e1) {
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

	ctrl.wfRun.clickActivityDefinition = function (activityDefinitionElement) {
		var tasks = findActivityDefinitionTasks(activityDefinitionElement)
		console.log(activityDefinitionElement, tasks)
		angular.forEach(tasks, function (id) {
			console.log(id)
			findNodesWithRef(ctrl.eMap[id], [371935]/*output*/, function (eOut) {
				console.log(eOut.doc_id)
				findNodesWithRef(eOut, [371968]/*Element*/, function (el) {
					console.log(el.doc_id)
					angular.forEach(el.children, function (elAtt) { /*Element@attributes*/
						console.log(elAtt.doc_id)
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

	ctrl.wfRun.clickTask = (tEl) => {
		angular.forEach(tEl.children, (e) => {
			if (371935 == e.reference) {//output
				angular.forEach(e.children,  (e2) => {
					if (371968 == e2.reference2) {//Element - metadata
						createInsertFromElement(e2)
						writeSql({
							sql: e2.sql_insert,
							dataAfterSave: function (response) {
								console.log(response.data)
							}
						})
					}
				})
			}
		})
	}

}
