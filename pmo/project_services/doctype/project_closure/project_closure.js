// Copyright (c) 2018, s and contributors
// For license information, please see license.txt

frappe.ui.form.on('Project Closure', {
	refresh: function(frm) {
        
        frm.add_custom_button(__("Project Initiation"), function () {
        	frappe.call({
                "method": "existing_project_initiation",
                doc: cur_frm.doc,
                callback: function(r) {
                frappe.set_route("Form", "Project Initiation", r.message);
                }
            });
        });


        frm.add_custom_button(__("Project Planning"), function () {
            frappe.call({
                "method": "existing_project_planning",
                doc: cur_frm.doc,
                callback: function(r) {
                frappe.set_route("Form", "Project Planning", r.message);
                }
            });

        });


        frm.add_custom_button(__("Project Implementation Monitoring and Controlling"), function () {
            frappe.call({
                "method": "existing_project_controlling",
                doc: cur_frm.doc,
                callback: function(r) {
                frappe.set_route("Form", "Project Implementation Monitoring and Controlling", r.message);
                }
            });

        });


        frm.add_custom_button(__("Project Closure"), function () {

        });

        $(".layout-main-section .form-inner-toolbar button:nth-child(4)").removeClass("btn-default");

	}
});
