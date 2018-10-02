// Copyright (c) 2018, s and contributors
// For license information, please see license.txt


function load_global_data(item){
	frappe.call({
		"method": "get_total_expenses_allocation_so_far",
		doc: cur_frm.doc,
		args: { "scope_item": item.scope_item},
		callback: function (r) {
			if(r.message){
				cur_frm.set_value("total_payment_cost_value", r.message);
			}
			frappe.call({
				"method": "get_total_expenses_external_allocation_so_far",
				doc: cur_frm.doc,
				callback: function (r) {
					if(r.message){
						cur_frm.set_value("total_project_external_expenses", r.message);
					
					}
					if(cur_frm.doc.payment_cost_value>item.po_contract_extimated_cost ){
						cur_frm.set_value("payment_cost_value",0 );
				   
						frappe.call({
							"method": "validate_payment_cost_value",
							doc: cur_frm.doc
						});
					}else{
						if (!cur_frm.doc.payment_cost_value){
							cur_frm.set_value("payment_cost_value", 0);
						}
						if (!cur_frm.doc.total_payment_cost_value){
							cur_frm.set_value("total_payment_cost_value", 0);
						}
						var x  = item.po_contract_extimated_cost - cur_frm.doc.payment_cost_value - cur_frm.doc.total_payment_cost_value
						console.log(x)
						console.log(item.po_contract_extimated_cost)
						console.log(cur_frm.doc.payment_cost_value)
						console.log(cur_frm.doc.total_payment_cost_value)
						console.log("totals")
						console.log(item.project_cost_value)
						console.log(cur_frm.doc.total_project_external_expenses)
						
				
						cur_frm.set_value("po_contract_remaining_estimated_cost", item.po_contract_extimated_cost - cur_frm.doc.payment_cost_value - cur_frm.doc.total_payment_cost_value);
						cur_frm.set_value("scope_item_external_remaining_estimated", item.scope_item_cost_value-cur_frm.doc.payment_cost_value-cur_frm.doc.total_project_external_expenses);
						cur_frm.set_value("project_external_remaining_estimated", item.project_cost_value-cur_frm.doc.payment_cost_value-cur_frm.doc.total_project_external_expenses);
					}
					
				}
				
			});
			if(cur_frm.doc.payment_cost_value>item.po_contract_extimated_cost ){
				cur_frm.set_value("payment_cost_value",0 );
		   
				frappe.call({
					"method": "validate_payment_cost_value",
					doc: cur_frm.doc
				});
			}else{
				if (!cur_frm.doc.payment_cost_value){
					cur_frm.set_value("payment_cost_value", 0);
				}
				if (!cur_frm.doc.total_payment_cost_value){
					cur_frm.set_value("total_payment_cost_value", 0);
				}
				var x  = item.po_contract_extimated_cost - cur_frm.doc.payment_cost_value - cur_frm.doc.total_payment_cost_value
				console.log(x)
				console.log(item.po_contract_extimated_cost)
				console.log(cur_frm.doc.payment_cost_value)
				console.log(cur_frm.doc.total_payment_cost_value)
				console.log("totals")
				console.log(item.project_cost_value)
				console.log(cur_frm.doc.total_project_external_expenses)
				
		
				cur_frm.set_value("po_contract_remaining_estimated_cost", item.po_contract_extimated_cost - cur_frm.doc.payment_cost_value - cur_frm.doc.total_payment_cost_value);
				cur_frm.set_value("scope_item_external_remaining_estimated", item.scope_item_cost_value-cur_frm.doc.payment_cost_value-cur_frm.doc.total_project_external_expenses);
				cur_frm.set_value("project_external_remaining_estimated", item.project_cost_value-cur_frm.doc.payment_cost_value-cur_frm.doc.total_project_external_expenses);
			}
		}

	});
	

		
	}
	
frappe.ui.form.on('Project Costing Schedule', {
    pr: function(frm,cdt,cdn) {
	  console.log("Hello")
	  
	  var item = locals[cdt][cdn];
	  
	  arr = []
		$.each(frm.doc.project_costing_schedule_control || [], function (i, d) {
			if(d.pr){
				arr.push(d)
				
			}
		});
		if(arr.length == 1){
			item = arr[0];
				if(frm.doc.type_of_cost == "External Expenses"){
				console.log("1")
				load_global_data(item);
		
				if(cur_frm.doc.po_contract_remaining_estimated_cost<0){
					cur_frm.set_value("po_contract_remaining_estimated_cost", 0);
				}
				if(cur_frm.doc.scope_item_external_remaining_estimated<0){
					cur_frm.set_value("scope_item_external_remaining_estimated", 0);
				}
				if(cur_frm.doc.project_external_remaining_estimated<0){
					cur_frm.set_value("project_external_remaining_estimated", 0);
				}
				
			}


		}else{
			cur_frm.set_value("total_payment_cost_value",0);
			cur_frm.set_value("total_project_external_expenses", 0);
			cur_frm.set_value("po_contract_remaining_estimated_cost",0);
			cur_frm.set_value("scope_item_external_remaining_estimated", 0);
			cur_frm.set_value("project_external_remaining_estimated", 0);
			
			
		}
   }
  });

frappe.ui.form.on('Project Costing Control', {
	refresh: function(frm) {
		// $(".grid-add-row").hide();

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
		if (cur_frm.doc.type_of_cost == 'External Expenses') {
            frm.set_df_property('allocation_cost_value', 'hidden', 1)
        	frm.set_df_property('total_resources_allocation_so_far', 'hidden', 1)
        	frm.set_df_property('remaining_of_the_project_cost_value', 'hidden', 1)
        	frm.set_df_property('month', 'hidden', 0)
        	frm.set_df_property('payment_cost_value', 'hidden', 0)
        	frm.set_df_property('total_payment_cost_value', 'hidden', 0)
        	frm.set_df_property('total_project_external_expenses', 'hidden', 0)
			frm.set_df_property('po_contract_remaining_estimated_cost', 'hidden', 0)
        	frm.set_df_property('scope_item_external_remaining_estimated', 'hidden', 0)			
        	frm.set_df_property('project_external_remaining_estimated', 'hidden', 0)
        } else if (cur_frm.doc.type_of_cost == 'Tawari Services') {
        	frm.set_df_property('allocation_cost_value', 'hidden', 0)
        	frm.set_df_property('total_resources_allocation_so_far', 'hidden', 0)
        	frm.set_df_property('remaining_of_the_project_cost_value', 'hidden', 0)
        	frm.set_df_property('month', 'hidden', 1)
        	frm.set_df_property('payment_cost_value', 'hidden', 1)
        	frm.set_df_property('total_payment_cost_value', 'hidden', 1)
        	frm.set_df_property('total_project_external_expenses', 'hidden', 1)
			frm.set_df_property('po_contract_remaining_estimated_cost', 'hidden', 1)
        	frm.set_df_property('scope_item_external_remaining_estimated', 'hidden', 1)			
        	frm.set_df_property('project_external_remaining_estimated', 'hidden', 1)
        }
	},
	project_name: function(frm) {
		// $(".grid-add-row").hide();

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
			if(d.pr){
	        	arr.push(d.pr)
	        }
	    });

		$.each(frm.doc.project_costing_schedule_control || [], function (i, d) {
	        if(arr.length==1){
		        if(d.pr && d.type_of_cost=='External Expenses' && cur_frm.doc.payment_cost_value>d.po_contract_extimated_cost ){
		        	cur_frm.set_value("payment_cost_value",0 );
		       
		        	frappe.call({
			            "method": "validate_payment_cost_value",
			            doc: cur_frm.doc
			        });
		        }else if(d.pr && d.type_of_cost=='External Expenses'){
		        	cur_frm.set_value("po_contract_remaining_estimated_cost", d.po_contract_extimated_cost-cur_frm.doc.payment_cost_value-cur_frm.doc.total_payment_cost_value);
					cur_frm.set_value("scope_item_external_remaining_estimated", d.scope_item_cost_value-cur_frm.doc.payment_cost_value-cur_frm.doc.total_project_external_expenses);
					cur_frm.set_value("project_external_remaining_estimated", d.project_cost_value-cur_frm.doc.payment_cost_value-cur_frm.doc.total_project_external_expenses);
		        }
		    }else if(arr.length==0){
		    	cur_frm.set_value("payment_cost_value",0 );
		    }
	    });



	    for(let i=0;i<cur_frm.doc.project_costing_schedule_control.length;i++){
				if(cur_frm.doc.project_costing_schedule_control[i].pr==1){

					frappe.call({
			            "method": "get_total_expenses_allocation_so_far",
			            doc: cur_frm.doc,
			            args: { "scope_item": cur_frm.doc.project_costing_schedule_control[i].scope_item},
			            callback: function (r) {
			                if(r.message){
								cur_frm.set_value("total_payment_cost_value", r.message);
								console.log(cur_frm.doc.total_payment_cost_value)
								console.log(r.message)
								
							}
							frappe.call({
								"method": "get_total_expenses_external_allocation_so_far",
								doc: cur_frm.doc,
								callback: function (r) {
									if(r.message){
										cur_frm.set_value("total_project_external_expenses", r.message);
									}
								}
							});
							
			            }
					});
					console.log("Out of callback")
					
					console.log(cur_frm.doc.total_payment_cost_value)


			        

				}
			}

		if(cur_frm.doc.po_contract_remaining_estimated_cost<0){
			cur_frm.set_value("po_contract_remaining_estimated_cost", 0);
		}
		if(cur_frm.doc.project_external_remaining_estimated<0){
			cur_frm.set_value("project_external_remaining_estimated", 0);
		}
		if(cur_frm.doc.scope_item_external_remaining_estimated<0){
			cur_frm.set_value("scope_item_external_remaining_estimated", 0);
		}
		
		
	},
	type_of_cost: function(frm){
		// $(".grid-add-row").hide();

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


        if (cur_frm.doc.type_of_cost == 'External Expenses') {
            frm.set_df_property('allocation_cost_value', 'hidden', 1)
        	frm.set_df_property('total_resources_allocation_so_far', 'hidden', 1)
        	frm.set_df_property('remaining_of_the_project_cost_value', 'hidden', 1)
        	frm.set_df_property('month', 'hidden', 0)
        	frm.set_df_property('payment_cost_value', 'hidden', 0)
        	frm.set_df_property('total_payment_cost_value', 'hidden', 0)
        	frm.set_df_property('total_project_external_expenses', 'hidden', 0)
			frm.set_df_property('po_contract_remaining_estimated_cost', 'hidden', 0)
        	frm.set_df_property('scope_item_external_remaining_estimated', 'hidden', 0)			
        	frm.set_df_property('project_external_remaining_estimated', 'hidden', 0)
        } else if (cur_frm.doc.type_of_cost == 'Tawari Services') {
        	frm.set_df_property('allocation_cost_value', 'hidden', 0)
        	frm.set_df_property('total_resources_allocation_so_far', 'hidden', 0)
        	frm.set_df_property('remaining_of_the_project_cost_value', 'hidden', 0)
        	frm.set_df_property('month', 'hidden', 1)
        	frm.set_df_property('payment_cost_value', 'hidden', 1)
        	frm.set_df_property('total_payment_cost_value', 'hidden', 1)
        	frm.set_df_property('total_project_external_expenses', 'hidden', 1)
			frm.set_df_property('po_contract_remaining_estimated_cost', 'hidden', 1)
        	frm.set_df_property('scope_item_external_remaining_estimated', 'hidden', 1)			
        	frm.set_df_property('project_external_remaining_estimated', 'hidden', 1)
        }


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

		    
		}




	}

});



frappe.ui.form.on('Project Costing Employee', {
    employee: function (frm, cdt, cdn) {
        var row = locals[cdt][cdn];
        
        if(row.employee){
	        frappe.call({
	            "method": "get_emp_salary",
	            doc: cur_frm.doc,
	            args: {
	                'employee': row.employee,
	                'employee_name': row.employee_name,
	                'company': frappe.sys_defaults.company,
	            },
	            callback: function (r) {
	                frappe.model.set_value(cdt, cdn, "total_earning", r.message);
	                frappe.model.set_value(cdt, cdn, "total", Math.round(r.message*(row.percentage/100)));
	            }
	        });
	    }


    },
    percentage: function (frm, cdt, cdn) {
        var row = locals[cdt][cdn];  
        if(row.total_earning && row.percentage){
	        frappe.model.set_value(cdt, cdn, "total", Math.round(row.total_earning*(row.percentage/100)));
	    }
    }


});


frappe.ui.form.on("Project Costing Employee", "total", function (frm, cdt, cdn) {
    // code for calculate total and set on parent field.
    var total_allocation = 0;
    $.each(frm.doc.project_costing_employee || [], function (i, d) {
    	if(d.total!=NaN){
        	total_allocation += flt(d.total);
        }
    });
    cur_frm.set_value("allocation_cost_value", total_allocation);
});

frappe.ui.form.on("Project Costing Employee", "percentage", function (frm, cdt, cdn) {
    // code for calculate total and set on parent field.
    var total_allocation = 0;
    $.each(frm.doc.project_costing_employee || [], function (i, d) {
    	if(d.total!=NaN){
        	total_allocation += flt(d.total);
        }
    });
    cur_frm.set_value("allocation_cost_value", total_allocation);
});






frappe.ui.form.on('Project Costing Employee', {
    employee: function (frm, cdt, cdn) {
    	var row = locals[cdt][cdn];
    	arr=[]
		$.each(frm.doc.project_costing_employee || [], function (i, d) {
	    	arr.push(d.employee)
	    });
		frm.fields_dict.project_costing_employee.grid.get_field('employee').get_query =
			function() {
				return {
				filters: {
					"employee": ["not in", arr]
				}
			}
		}
    },
    percentage: function (frm, cdt, cdn) {
    	var row = locals[cdt][cdn];
    	if(row.percentage>100 || row.percentage<0){
    		frappe.model.set_value(cdt, cdn, 'percentage', 0);
    		frappe.model.set_value(cdt, cdn, 'total', 0);
    	}
    }

})



// frappe.ui.form.on('Project Costing Employee', "employee", function(frm) {
// 	arr=[]
// 	$.each(frm.doc.project_costing_employee || [], function (i, d) {
//     	arr.push(d.employee)
//     });
// 	console.log(arr)
// 	frm.fields_dict.project_costing_employee.grid.get_field('employee').get_query =
// 		function() {
// 			return {
// 			filters: {
// 				"employee": ["not in", arr]
// 			}
// 		}
// 	}
// });