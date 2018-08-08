// Copyright (c) 2018, s and contributors
// For license information, please see license.txt

frappe.ui.form.on('Project Costing Control', {
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
		        	if(row.type_of_cost=='Tawari Services'){
			            d = frm.add_child("project_costing_schedule_control");
			            d.type_of_cost = row.type_of_cost;
			            d.project_cost_value = row.project_cost_value;
			            d.description_comments = row.description_comments;
			            d.delivery_date_period = row.delivery_date_period;
			            d.delivery_date = row.delivery_date;
			            d.delivery_period_from_date = row.delivery_period_from_date;
			            d.delivery_period_to_date = row.delivery_period_to_date;
			            frm.refresh_field("project_costing_schedule_control");
			        }
		        });
		    })
		}
	},
	allocation_cost_value: function(frm) {
		$.each(frm.doc.project_costing_schedule_control || [], function (i, d) {

	        if(d.type_of_cost=='Tawari Services' && cur_frm.doc.allocation_cost_value>d.project_cost_value){
	        	cur_frm.set_value("allocation_cost_value", );
	       
	        	frappe.call({
		            "method": "validate_allocation_cost_value",
		            doc: cur_frm.doc
		        });
	        }

	    });

	}

});
