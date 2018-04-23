// Copyright (c) 2018, s and contributors
// For license information, please see license.txt

frappe.ui.form.on('Project Management Assignment', {
	refresh: function(frm) {

	},
	onload: function(frm) {

		cur_frm.set_query("project_coordinator", function() {
            return {
                query: "pmo.project_services.doctype.project_management_assignment.project_management_assignment.get_projects_users"
            };
        });

        cur_frm.set_query("project_manager", function() {
            return {
                query: "pmo.project_services.doctype.project_management_assignment.project_management_assignment.get_projects_users"
            };
        });

        cur_frm.set_query("senior_project_manager", function() {
            return {
                query: "pmo.project_services.doctype.project_management_assignment.project_management_assignment.get_projects_users"
            };
        });

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
	},
	project_manager_role: function(frm) {
		frm.set_value("project_manager", );
		frm.set_value("senior_project_manager", );
	},
	project_coordinator_role: function(frm) {
		frm.set_value("project_coordinator", );
	}
});

