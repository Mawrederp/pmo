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
        $('.layout-main-section-wrapper .layout-main-section .form-inner-toolbar').after('<style>.layout-main-section-wrapper .layout-main-section .form-inner-toolbar button:nth-child(n+1){float: left !important;}</style>');
        
        
	}

});



frappe.ui.form.on('Control Change Request', 'change_request_add', function(frm, cdt, cdn){
    var row = locals[cdt][cdn];
    console.log(row.idx);
    frappe.model.set_value(cdt, cdn, "change_request_number", 'ERP-PMO-'+row.idx);

});



frappe.ui.form.on('Control Change Request', {
    add_action: function (frm, cdt, cdn) {        

        var d = new frappe.ui.Dialog({
            'fields': [
                {'label': 'Action','fieldname': 'action', 'fieldtype': 'Data', 'reqd': 1},
                {'label': '','fieldname': 'col_break94', 'fieldtype': 'Column Break'},
                {'label': 'Owner','fieldname': 'owner', 'fieldtype': 'Data', 'reqd': 1}
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
