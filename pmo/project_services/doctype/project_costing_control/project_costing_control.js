// Copyright (c) 2018, s and contributors
// For license information, please see license.txt

frappe.ui.form.on('Project Costing Control', {
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

		frm.add_custom_button(__("Make a Payment"), function () {
			console.log('tst')
    	});
	},
	project_name: function(frm) {
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

	},
	allocation_cost_value: function(frm) {
		$.each(frm.doc.project_costing_schedule_control || [], function (i, d) {
	        if(d.type_of_cost=='Tawari Services' && cur_frm.doc.allocation_cost_value>d.project_cost_value || (cur_frm.doc.allocation_cost_value+cur_frm.doc.total_resources_allocation_so_far)>d.project_cost_value){
	        	cur_frm.set_value("allocation_cost_value", );
	       
	        	frappe.call({
		            "method": "validate_allocation_cost_value",
		            doc: cur_frm.doc
		        });
	        }else if(d.type_of_cost=='Tawari Services'){
	        	cur_frm.set_value("remaining_of_the_project_cost_value", d.project_cost_value-cur_frm.doc.allocation_cost_value-cur_frm.doc.total_resources_allocation_so_far);
	        }

	    });

	},
	payment_cost_value: function(frm) {
		arr = []
		$.each(frm.doc.project_costing_schedule_control || [], function (i, d) {
	        if(d.pr && d.type_of_cost=='External Expenses' && cur_frm.doc.payment_cost_value>d.po_contract_extimated_cost ){
	        	cur_frm.set_value("payment_cost_value", );
	       
	        	frappe.call({
		            "method": "validate_payment_cost_value",
		            doc: cur_frm.doc
		        });
	        }else if(d.pr){
	        	arr.push(d.pr)
	        }
	    });
	    
	    if(arr.length==0){
	    	cur_frm.set_value("payment_cost_value", );
	    }

	},
	type_of_cost: function(frm){
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


        // if (row.type_of_cost == 'External Expenses') {
        //     var df = frappe.meta.get_docfield("Project Costing Control", 'allocation_cost_value' , cur_frm.doc.name);
        //     df.hidden = 0; 
        // } else if (row.type_of_cost == 'Tawari Services') {
        // 	var df = frappe.meta.get_docfield("Project Costing Control", 'payment_cost_value' , cur_frm.doc.name);
        //     df.hidden = 0; 

        // }



		if(cur_frm.doc.project_name && cur_frm.doc.type_of_cost=='Tawari Services'){
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


		    frappe.call({
	            "method": "get_total_resources_allocation_so_far",
	            doc: cur_frm.doc,
	            callback: function (r) {
	                if(r.message){
	                    cur_frm.set_value("total_resources_allocation_so_far", r.message);
	                }
	            }
	        });



		}else if(cur_frm.doc.project_name && cur_frm.doc.type_of_cost=='External Expenses'){
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
			            d.cost_status = row.cost_status;
			            frm.refresh_field("project_costing_schedule_control");
			        }
		        });
		    })	


		    // frappe.call({
	     //        "method": "get_total_resources_allocation_so_far",
	     //        doc: cur_frm.doc,
	     //        callback: function (r) {
	     //            if(r.message){
	     //                cur_frm.set_value("total_resources_allocation_so_far", r.message);
	     //            }
	     //        }
	     //    });


		}




	}

});
