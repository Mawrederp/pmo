// Copyright (c) 2018, s and contributors
// For license information, please see license.txt

frappe.ui.form.on('Projects Procurement Control', {
	refresh: function(frm) {

	},
	project_name: function(frm) {
		if(cur_frm.doc.project_name){
			cur_frm.doc.project_costing_schedule_control = []
			frappe.model.with_doc("Project Initiation", frm.doc.project_name, function() {
		        var tabletransfer= frappe.model.get_doc("Project Initiation", frm.doc.project_name)
		        frm.doc.project_costing_schedule_control = []
	            frm.refresh_field("project_costing_schedule_control");
		        $.each(tabletransfer.project_costing_schedule, function(index, row){
		        	if(row.type_of_cost=='External Expenses'){
			            d = frm.add_child("project_costing_schedule_control");
			            d.type_of_cost = row.type_of_cost;
			            d.description_comments = row.description_comments;
			            d.scope_item = row.scope_item;
			            d.project_cost_value = row.project_cost_value;
			            d.scope_item_cost_value = row.scope_item_cost_value;
			            d.no_contracts = row.no_contracts;
			            d.po_contract_extimated_cost = row.po_contract_extimated_cost;
			            d.vendor = row.vendor;
			            d.last_date = row.last_date;
			            d.delivery_date_period = row.delivery_date_period;
			            d.delivery_date = row.delivery_date;
			            d.delivery_period_from_date = row.delivery_period_from_date;
			            d.delivery_period_to_date = row.delivery_period_to_date;
			            frm.refresh_field("project_costing_schedule_control");
			        }
		        });
		    })
		}
	}


});
