// Copyright (c) 2018, s and contributors
// For license information, please see license.txt

frappe.ui.form.on('Project Management Assignment', {
	refresh: function(frm) {

	},
	project_name: function(frm) {
		frm.set_value("project_coordinator", );
		frm.set_value("project_manager", );
		frm.set_value("senior_project_manager", );
		if(cur_frm.doc.project_name){
			frappe.call({
	            "method": "get_wf_assignment",
	            doc: cur_frm.doc,
	            callback: function(r) {
	            	if(r.message){
		            	frm.set_value("project_coordinator", r.message[0]);
						frm.set_value("project_manager", r.message[1]);
						frm.set_value("senior_project_manager", r.message[2]);
		 			}
	            }
	        });
        }
	}
});

