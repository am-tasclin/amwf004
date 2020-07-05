var initJ2C = function(){
	console.log('read -> ',371831)

	read_element_descendant(371831, function(){
		if(ctrl.request.parameters.p){
			read_element(ctrl.request.parameters.p, function(){
				read_element_children(ctrl.request.parameters.p, function(){
					ctrl.project = ctrl.eMap[ctrl.request.parameters.p]
					ctrl.page_title += ctrl.project.value_1_22
					console.log(ctrl.project.children)
					angular.forEach(ctrl.project.children, function(v){
//						read_element_descendant(v.doc_id)
						var p = ctrl.eMap[v.reference2]
						console.log(v.doc_id, v.reference2)
						children_push(p, v)
					})
				})
			})
		}
	})

	ctrl.conf_menu_click = function(e) {
		e.open_children = !e.open_children
		if(e.cnt_child && !e.children ){
			console.log(e);
			read_element_children(e.doc_id, function(){
					
				})
		}
	}


	ctrl.mu = {}
	ctrl.mu_mOpenKey = 'mdn'
	ctrl.mu.mdn = 'Метадані'
	ctrl.mu.itf = 'Інтерфейси'
	ctrl.mu.rig = 'Права'
	ctrl.mu.cnf = 'OpenConf'
	ctrl.mu.frm = 'Зовнішні форми'
}
