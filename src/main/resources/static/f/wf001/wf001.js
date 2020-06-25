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
}
