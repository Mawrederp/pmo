// Copyright (c) 2018, s and contributors
// For license information, please see license.txt

frappe.ui.form.on('PMO Resources', {
	refresh: function(frm) {

	}
});



frappe.ui.form.on("Role Assignment", {
	employee: function(frm, cdt, cdn) {
		arr = []
		var row = locals[cdt][cdn];
		if(row.user_id){
			frappe.call({
	            "method": "check_role",
	            doc: cur_frm.doc,
	            args: { "user_id": row.user_id },
	            callback: function(r) {
	            	for(var i = 0 ;i<r.message.length;i++){
	            		arr.push(r.message[i])
	            	}
	                if (arr.includes('Program Manager')){
	                	frappe.model.set_value(cdt, cdn, "program_manager", 1);
	                }
	                if (arr.indexOf('Project Coordinator') >= 0){
	                	frappe.model.set_value(cdt, cdn, "project_coordinator", 1);
	                }
	                if (arr.includes('Senior Project Manager')){
	                	frappe.model.set_value(cdt, cdn, "senior_project_manager", 1);
	                }
	                if (arr.includes('PMO Director')){
	                	frappe.model.set_value(cdt, cdn, "pmo_director", 1);
	                }
	                if (arr.includes('Project Manager')){
	                	frappe.model.set_value(cdt, cdn, "project_manager", 1);
	                }
	            }
	        });
	    }
	}
});


