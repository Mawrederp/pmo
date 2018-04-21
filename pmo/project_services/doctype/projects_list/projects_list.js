	// Copyright (c) 2018, s and contributors
// For license information, please see license.txt

frappe.ui.form.on('Projects List', {
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


        frm.add_custom_button(__("Project Implementation, Monitoring and Controlling"), function () {
            frappe.call({
                "method": "existing_project_controlling",
                doc: cur_frm.doc,
                callback: function(r) {
                frappe.set_route("Form", "Project Implementation Monitoring and Controlling", r.message);
                }
            });

        });


        frm.add_custom_button(__("Project Closure"), function () {
            frappe.call({
                "method": "existing_project_closure",
                doc: cur_frm.doc,
                callback: function(r) {
                frappe.set_route("Form", "Project Closure", r.message);
                }
            });

        });


        $('.layout-main-section .form-inner-toolbar :nth-child(1)').before('<b><p style="text-align: center;font-size: 25px;">Project Phases</p></b>');
        $('.layout-main-section-wrapper .layout-main-section .form-inner-toolbar').after('<style>.layout-main-section-wrapper .layout-main-section .form-inner-toolbar{height: 100px !important;}</style>');
        $('.layout-main-section-wrapper .layout-main-section .form-inner-toolbar').after('<style>.layout-main-section-wrapper .layout-main-section .form-inner-toolbar button:nth-child(n+1){float: left !important;}</style>');


		
	}
});
