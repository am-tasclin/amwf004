var initWF001 = function(){
	console.log('read -> ',111)
	if(ctrl.request.parameters.p){
		console.log('read -> ', ctrl.request.parameters.p)
		read_element_descendant(ctrl.request.parameters.p, function(){
			ctrl.project = ctrl.eMap[ctrl.request.parameters.p]
			console.log('read -> ',ctrl.project.doc_id)
		})
	}
}
