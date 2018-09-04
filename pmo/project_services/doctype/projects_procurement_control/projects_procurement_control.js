// Copyright (c) 2018, s and contributors
// For license information, please see license.txt

frappe.ui.form.on('Projects Procurement Control', {
	refresh: function(frm) {
		$(".grid-add-row").hide();

		frappe.meta.get_docfield("Project Costing Schedule","type_of_cost", cur_frm.doc.name).read_only = 1;
		frappe.meta.get_docfield("Project Costing Schedule","description_comments", cur_frm.doc.name).read_only = 1;
		frappe.meta.get_docfield("Project Costing Schedule","scope_item", cur_frm.doc.name).read_only = 1;
		frappe.meta.get_docfield("Project Costing Schedule","no_contracts", cur_frm.doc.name).read_only = 1;
		frappe.meta.get_docfield("Project Costing Schedule","po_contract_extimated_cost", cur_frm.doc.name).read_only = 1;
		frappe.meta.get_docfield("Project Costing Schedule","vendor", cur_frm.doc.name).read_only = 1;
		frappe.meta.get_docfield("Project Costing Schedule","last_date_period", cur_frm.doc.name).read_only = 1;
		frappe.meta.get_docfield("Project Costing Schedule","last_date", cur_frm.doc.name).read_only = 1;
		frappe.meta.get_docfield("Project Costing Schedule","last_period_from", cur_frm.doc.name).read_only = 1;
		frappe.meta.get_docfield("Project Costing Schedule","last_period_to", cur_frm.doc.name).read_only = 1;
		frappe.meta.get_docfield("Project Costing Schedule","delivery_date_period", cur_frm.doc.name).read_only = 1;
		frappe.meta.get_docfield("Project Costing Schedule","delivery_date", cur_frm.doc.name).read_only = 1;
		frappe.meta.get_docfield("Project Costing Schedule","delivery_period_from_date", cur_frm.doc.name).read_only = 1;
		frappe.meta.get_docfield("Project Costing Schedule","delivery_period_to_date", cur_frm.doc.name).read_only = 1;

    	frm.add_custom_button(__("Make a PR"), function () {

			for(row= 0;row<cur_frm.doc.project_costing_schedule_control.length;row++){
				if(cur_frm.doc.project_costing_schedule_control[row].pr == 1){
					
					var scope_item = cur_frm.doc.project_costing_schedule_control[row].scope_item
					if(scope_item){
						scope_item=scope_item
					}else{
						scope_item=''
					}

					var description_comments = cur_frm.doc.project_costing_schedule_control[row].description_comments
					if(description_comments){
						description_comments=description_comments
					}else{
						description_comments=''
					}

					var last_date = cur_frm.doc.project_costing_schedule_control[row].last_date
					if(last_date){
						last_date=last_date
					}else{
						last_date=''
					}

					var material_request = cur_frm.doc.project_costing_schedule_control[row].material_request
					if(material_request){
						material_request=material_request
					}else{
						material_request=''
					}


					frappe.call({
			            "method": "make_material_request",
			            doc: cur_frm.doc,
			            args: { "scope_item": scope_item,"description_comments":description_comments,
			            		"last_date":last_date,"material_request":material_request},
			            callback: function (r) {
			            	material_request_name = r.message
     						$.each(frm.doc.project_costing_schedule_control || [], function(i, v) {
     							if(v.pr){
	     							frappe.model.set_value(v.doctype, v.name, "material_request", material_request_name)
	     						
	     			
	     							frappe.call({
							            "method": "updat_material_costing_table",
							            doc: cur_frm.doc,
							            args: {"itm": v.scope_item,"idx": v.idx,"material_request":material_request_name,
							        		   "scope_item_cost_value":v.scope_item_cost_value,"po_contract_extimated_cost":v.po_contract_extimated_cost},
							            callback: function (r) {
							            	if(r.message){
							            		console.log(r.message)
		     								}

						                }
							        });




								}		
							})

		                }
			        });

				}
			}

    	});



	},
	project_name: function(frm) {
		// cur_frm.set_df_property("project_costing_schedule_control", "read_only",1);
		$(".grid-add-row").hide();

		frappe.meta.get_docfield("Project Costing Schedule","type_of_cost", cur_frm.doc.name).read_only = 1;
		frappe.meta.get_docfield("Project Costing Schedule","description_comments", cur_frm.doc.name).read_only = 1;
		frappe.meta.get_docfield("Project Costing Schedule","scope_item", cur_frm.doc.name).read_only = 1;
		frappe.meta.get_docfield("Project Costing Schedule","no_contracts", cur_frm.doc.name).read_only = 1;
		frappe.meta.get_docfield("Project Costing Schedule","po_contract_extimated_cost", cur_frm.doc.name).read_only = 1;
		frappe.meta.get_docfield("Project Costing Schedule","vendor", cur_frm.doc.name).read_only = 1;
		frappe.meta.get_docfield("Project Costing Schedule","last_date_period", cur_frm.doc.name).read_only = 1;
		frappe.meta.get_docfield("Project Costing Schedule","last_date", cur_frm.doc.name).read_only = 1;
		frappe.meta.get_docfield("Project Costing Schedule","last_period_from", cur_frm.doc.name).read_only = 1;
		frappe.meta.get_docfield("Project Costing Schedule","last_period_to", cur_frm.doc.name).read_only = 1;
		frappe.meta.get_docfield("Project Costing Schedule","delivery_date_period", cur_frm.doc.name).read_only = 1;
		frappe.meta.get_docfield("Project Costing Schedule","delivery_date", cur_frm.doc.name).read_only = 1;
		frappe.meta.get_docfield("Project Costing Schedule","delivery_period_from_date", cur_frm.doc.name).read_only = 1;
		frappe.meta.get_docfield("Project Costing Schedule","delivery_period_to_date", cur_frm.doc.name).read_only = 1;

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
			            d.last_date_period = row.last_date_period;
			            d.last_date = row.last_date;
			            d.last_period_from = row.last_period_from;
			            d.last_period_to = row.last_period_to;
			            d.delivery_date_period = row.delivery_date_period;
			            d.delivery_date = row.delivery_date;
			            d.delivery_period_from_date = row.delivery_period_from_date;
			            d.delivery_period_to_date = row.delivery_period_to_date;
			            d.material_request = row.material_request;
			            frm.refresh_field("project_costing_schedule_control");
			        }
		        });
		    })
		}
	}


});
