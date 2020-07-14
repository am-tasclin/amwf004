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
	var vars='doc_id', vals=':nextDbId1'
	angular.forEach(e.children, function(e3){
		console.log(e3.doc_id, e3.reference)
		vals += ', '+ e3.reference2
		vars += ', '
		if(e3.reference == 371969){//parent
			vars +='parent'
		}else
		if(e3.reference == 371970){//reference
			vars +='reference'
			console.log(e3.reference2)
		}
	})
	e.sql_insert = e.sql_insert.replace(':vars', vars)
	e.sql_insert = e.sql_insert.replace(':vals', vals)
	console.log(e.sql_insert)
	console.log(vars, vals)
}

var findNodesWithRef = function(e, refIds, fn){
	var fN = []
	angular.forEach(e.children, function(e1){
		console.log(refIds, e1.doc_id, e1.reference, refIds.indexOf(e1.reference))
		if(
			refIds.indexOf(e1.reference) >= 0
			|| refIds.indexOf(e1.reference2) >= 0
		){
		fN.push(e1)
		if(fn) fn(e1)
	}})
	return fN
}

var findActivityDefinitionTasks = function(adEl){
	var fN = []
	var adNodes = findNodesWithRef(adEl, [369917])//ActivityDefinition
	angular.forEach(adNodes, function(e1){
		angular.forEach(e1.instantiatesCanonical, function(e2){
			fN.push(e2)
		})
	})
	return fN
}

var initWF_run001 = function(){
	ctrl.wfRun = {}
	
	ctrl.wfRun.clickActivityDefinition = function(adEl) {
		console.log(adEl)
		var tasks = findActivityDefinitionTasks(adEl)
		console.log(tasks)
		angular.forEach(tasks, function(id){
			findNodesWithRef(ctrl.eMap[id], [371935]/*output*/, function(e){
				console.log(e.doc_id)
				findNodesWithRef(e, [371968]/*Element*/, function(e1){
					console.log(e1.doc_id)
					angular.forEach(e1.children, function(e2){/*Element@attributes*/
						console.log(e2.doc_id, e2.reference, e2.reference2, ctrl.eMap[e2.reference2])
						if(!ctrl.eMap[e2.reference2]){
							read_element(e2.reference2, function(){
								console.log(ctrl.eMap[e2.reference2])
							})
						}
					})
				})
			})
		})
	}
		
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
