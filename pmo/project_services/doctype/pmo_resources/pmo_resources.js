// Copyright (c) 2018, s and contributors
// For license information, please see license.txt

cur_frm.add_fetch('employee', 'user_id', 'user_id');

frappe.ui.form.on('PMO Resources', {
	refresh: function(frm) {

	},
	employee: function(frm) {
		arr = []
		if(cur_frm.doc.user_id){
			frappe.call({
	            "method": "check_role",
	            doc: cur_frm.doc,
	            args: { "user_id": cur_frm.doc.user_id },
	            callback: function(r) {
	            	for(var i = 0 ;i<r.message.length;i++){
	            		arr.push(r.message[i])
	            	}
	            	frm.set_value("program_manager", 0);
	            	frm.set_value("project_coordinator", 0);
	            	frm.set_value("senior_project_manager", 0);
	            	frm.set_value("pmo_director", 0);
	            	frm.set_value("project_manager", 0);

	                if (arr.includes('Program Manager')){
	                	frm.set_value("program_manager", 1);
	                }
	                if (arr.indexOf('Project Coordinator') >= 0){
	                	frm.set_value("project_coordinator", 1);
	                }
	                if (arr.includes('Senior Project Manager')){
	                	frm.set_value("senior_project_manager", 1);
	                }
	                if (arr.includes('PMO Director')){
	                	frm.set_value("pmo_director", 1);
	                }
	                if (arr.includes('Project Manager')){
	                	frm.set_value("project_manager", 1);
	                }
	            }
	        });
	    }
	}

});



// frappe.ui.form.on("Role Assignment", {
// 	employee: function(frm, cdt, cdn) {
// 		arr = []
// 		var row = locals[cdt][cdn];
// 		if(row.user_id){
// 			frappe.call({
// 	            "method": "check_role",
// 	            doc: cur_frm.doc,
// 	            args: { "user_id": row.user_id },
// 	            callback: function(r) {
// 	            	for(var i = 0 ;i<r.message.length;i++){
// 	            		arr.push(r.message[i])
// 	            	}
// 	                if (arr.includes('Program Manager')){
// 	                	frappe.model.set_value(cdt, cdn, "program_manager", 1);
// 	                }
// 	                if (arr.indexOf('Project Coordinator') >= 0){
// 	                	frappe.model.set_value(cdt, cdn, "project_coordinator", 1);
// 	                }
// 	                if (arr.includes('Senior Project Manager')){
// 	                	frappe.model.set_value(cdt, cdn, "senior_project_manager", 1);
// 	                }
// 	                if (arr.includes('PMO Director')){
// 	                	frappe.model.set_value(cdt, cdn, "pmo_director", 1);
// 	                }
// 	                if (arr.includes('Project Manager')){
// 	                	frappe.model.set_value(cdt, cdn, "project_manager", 1);
// 	                }
// 	            }
// 	        });
// 	    }
// 	}
// });


