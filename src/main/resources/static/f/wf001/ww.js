app.controller('AppCtrl', function($scope, $http, $timeout) {
	ctrl = this
	initApp($scope, $http, $timeout)
	ctrl.page_title = 'wf_run001:'
	initWF001()
	initWF_run001()
})

var createInsertFromElement = function(e){
	console.log(e.doc_id)
	e.sql_insert = 'INSERT INTO doc (:vars) VALUES (:vals);'
	var vars='', vals=''
	angular.forEach(e.children, function(e3){
		console.log(e3.doc_id, e3.reference)
		vals += ', '+ e3.reference2
		vars += ', '
		if(e3.reference == 371969){//parent
			vars +='parent'
		}else
		if(e3.reference == 371970){//reference
			vars +='reference'
		}
	})
	e.sql_insert = e.sql_insert.replace(':vars', vars.substr(2))
	e.sql_insert = e.sql_insert.replace(':vals', vals.substr(2))
	console.log(e.sql_insert, vars, vals)
}
	
var initWF_run001 = function(){
	ctrl.wfRun = {}
	
	ctrl.wfRun.clickTask = function(tEl) {
		angular.forEach(tEl.children, function(e){
			if(e.reference == 371935){//output
				angular.forEach(e.children, function(e2){
					if(e2.reference == 371968){//Element - metadata
						createInsertFromElement(e2)
					}
				})
			}
		})
	}

}
