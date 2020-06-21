var initJ2C = function(){
	console.log('read -> ',371831)
	read_element_descendant(371831)
	ctrl.conf_menu_click = function(e) {
		console.log(e)
		e.open_children = !e.open_children
	}
	ctrl.mu = {}
	ctrl.mu_mOpenKey = 'mdn'
	ctrl.mu.mdn = 'Метадані'
	ctrl.mu.itf = 'Інтерфейси'
	ctrl.mu.rig = 'Права'
	ctrl.mu.cnf = 'OpenConf'
	ctrl.mu.frm = 'Зовнішні форми'
}
