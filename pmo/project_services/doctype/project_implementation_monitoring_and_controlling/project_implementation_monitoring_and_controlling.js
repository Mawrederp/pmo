// Copyright (c) 2018, s and contributors
// For license information, please see license.txt

frappe.ui.form.on('Project Implementation Monitoring and Controlling', {
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

        $(".layout-main-section .form-inner-toolbar button:nth-child(3)").removeClass("btn-default");
        $('.layout-main-section .form-inner-toolbar :nth-child(1)').before('<b><p style="text-align: center;font-size: 25px;">Project Phases</p></b>');
        $('.layout-main-section-wrapper .layout-main-section .form-inner-toolbar').after('<style>.layout-main-section-wrapper .layout-main-section .form-inner-toolbar{height: 100px !important;}</style>');
        $('.layout-main-section-wrapper .layout-main-section .form-inner-toolbar').after('<style>.layout-main-section-wrapper .layout-main-section .form-inner-toolbar button:nth-child(n+1){float: left !important;}.layout-main-section-wrapper .layout-main-section .form-inner-toolbar button{font-weight: bold!important;}</style>');
        
        
	},
	previous_project_customer_details: function(frm) {
        if(cur_frm.doc.previous_project_customer_details){
            cur_frm.set_value("customer", )
            cur_frm.set_value("account", )
            cur_frm.set_value("customer_department", )
            cur_frm.set_value("employee", )
            cur_frm.set_value("end_users", )
            cur_frm.set_value("concerned_department", )
            cur_frm.set_value("customer_project_manager", )
            cur_frm.set_value("customer_project_sponsor", )
            cur_frm.set_value("customer_project_owner", )
            cur_frm.set_value("po_number", )
            cur_frm.set_value("po_date", )


            frappe.call({
                "method": "get_previous_customer_changes",
                doc: cur_frm.doc,
                callback: function(r) {
                	cur_frm.refresh()
                }
            });

            document.querySelectorAll("[data-fieldname='po_number']")[1].style.backgroundColor="chartreuse";

        }
    }

});


frappe.ui.form.on('Control Change Request', 'change_request_add', function(frm, cdt, cdn){
    var row = locals[cdt][cdn];
    if(cur_frm.doc.project_changes == "Regular Change"){
        var naming = "ERP-PMO- Regular-"+row.idx
    }else{
        var naming = "ERP-PMO- Customer App-"+row.idx
    }
    frappe.model.set_value(cdt, cdn, "change_request_number", naming);

});



frappe.ui.form.on('Control Change Request', {
    add_action: function (frm, cdt, cdn) {        

        var d = new frappe.ui.Dialog({
            'fields': [
                {'label': 'Owner','fieldname': 'owner', 'fieldtype': 'Link', 'options': 'Employee', 'reqd': 1},
                {'label': 'Action','fieldname': 'action', 'fieldtype': 'Text', 'reqd': 1}
            ],
            primary_action: function(){

                d.hide();

                var args = d.get_values();
                var row = locals[cdt][cdn];

                action = args['action'];
                owner = args['owner'];
                
                $('.action_list tbody').append('<tr><td>'+action+'</td><td>'+owner+'</td></tr>');

            }
        });
        
        d.show();

    }

});

