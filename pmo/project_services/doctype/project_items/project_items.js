// Copyright (c) 2018, s and contributors
// For license information, please see license.txt

frappe.ui.form.on('Project Items', {
	refresh: function(frm) {

	},
	validate: function(frm) {
		if(cur_frm.doc.item){
			frm.set_value('status', "Active");
		}else{
			frm.set_value('status', "New");
		}
	},
	item: function(frm) {
		if(cur_frm.doc.item){
			frm.set_value('status', "Active");
		}else{
			frm.set_value('status', "New");
		}
	}	
});
