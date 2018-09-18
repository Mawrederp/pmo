// Copyright (c) 2018, s and contributors
// For license information, please see license.txt
cur_frm.add_fetch('Project Initiation','sales_order','sales_order');

var calculate_total_and_save = true;
frappe.ui.form.on('Project Billing Control', {
	after_save: function(frm) {

		frappe.call({
            "method": "get_total_billing_so_far",
            doc: cur_frm.doc,
            callback: function (r) {
	            if(r){
	           		cur_frm.set_value("total_project_billing_so_far", r.message[0])
	           		cur_frm.set_value("total_scope_item_billing_so_far", r.message[1])
					if(calculate_total_and_save){
						frm.save()
						calculate_total_and_save = false;
					}
	            }
            }
        });

	},
	refresh: function(frm,cdt,cdn) {
		frm.add_custom_button(__("Make Sales Order Approval"), function () {
			
			frappe.call({
	            "method": "make_project_sales_order_approval",
	            doc: cur_frm.doc,
	            callback: function (r) {
                    console.log(r.message)

                }
	        });

    	});



		frm.add_custom_button(__("Make Sales Invoice"), function () {
			// items = []
			for(var row= 0;row<cur_frm.doc.project_payment_schedule_control.length;row++){
				if(cur_frm.doc.project_payment_schedule_control[row].invoice == 1){
					var scope_item = cur_frm.doc.project_payment_schedule_control[row].scope_item
					if(scope_item){
						scope_item=scope_item
					}else{
						scope_item=''
					}

					var project_name = cur_frm.doc.project_name
					if(project_name){
						project_name=project_name
					}else{
						project_name=''
					}

					var items_value = cur_frm.doc.project_payment_schedule_control[row].items_value
					if(items_value){
						items_value=items_value
					}else{
						items_value=0
					}

					var billing_percentage = cur_frm.doc.project_payment_schedule_control[row].billing_percentage
					if(billing_percentage){
						billing_percentage=billing_percentage
					}else{
						billing_percentage=0
					}


					if(cur_frm.doc.project_payment_schedule_control[row].date_period=='Date'){
						var due_date = cur_frm.doc.project_payment_schedule_control[row].when
						if(due_date){
							due_date=due_date
						}else{
							due_date=''
						}
					}else if(cur_frm.doc.project_payment_schedule_control[row].date_period=='Period'){
						var due_date = cur_frm.doc.project_payment_schedule_control[row].to_date
						if(due_date){
							due_date=due_date
						}else{
							due_date=''
						}
					}

					var description_when = cur_frm.doc.project_payment_schedule_control[row].description_when
					if(description_when){
						description_when=description_when
					}else{
						description_when=''
					}

					var vat_value = cur_frm.doc.project_payment_schedule_control[row].vat_value
					if(vat_value){
						vat_value=vat_value
					}else{
						vat_value=0
					}

					var billing_status = cur_frm.doc.project_payment_schedule_control[row].billing_status
					if(billing_status){
						billing_status=billing_status
					}else{
						billing_status=0
					}

					var sales_invoice = cur_frm.doc.project_payment_schedule_control[row].sales_invoice
					if(sales_invoice){
						sales_invoice=sales_invoice
					}else{
						sales_invoice=''
					}

					var total_billing_value = cur_frm.doc.project_payment_schedule_control[row].total_billing_value
					if(total_billing_value){
						total_billing_value=total_billing_value
					}else{
						total_billing_value=0
					}

					var remaining_billing_value = cur_frm.doc.project_payment_schedule_control[row].remaining_billing_value
					if(remaining_billing_value){
						remaining_billing_value=remaining_billing_value
					}else{
						remaining_billing_value=0
					}


					frappe.call({
			            "method": "make_sales_invoice",
			            doc: cur_frm.doc,
			            args: { "scope_item": scope_item,"project_name": project_name,
			            		"items_value": items_value,"billing_percentage": billing_percentage,
			            		"due_date": due_date,"description_when":description_when,"vat_value":vat_value,
			            		"billing_state":billing_status,"sales_invoice":sales_invoice},
			            callback: function (r) {
			            	console.log("here0")
			            	console.log(r.message)
		                    invoice_name = r.message
		                    $.each(frm.doc.project_payment_schedule_control || [], function(i, v) {
		                    	if(v.invoice){
		                    		console.log("here")

		                    		frappe.model.set_value(v.doctype, v.name, "sales_invoice", invoice_name)
	     							frappe.model.set_value(v.doctype, v.name, "billing_status", 1)

				                    frappe.call({
							            "method": "updat_init_payment_table_invoice",
							            doc: cur_frm.doc,
							            args: {"sales_invoice":invoice_name,"scope_item": scope_item,
							        		   "billing_percentage": billing_percentage,"total_billing_value": total_billing_value,
							        		   "remaining_billing_value": remaining_billing_value},
							            callback: function (r) {
							            	if(r.message){
							            		console.log("here 2")
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
		if(cur_frm.doc.project_name){
			cur_frm.doc.project_payment_schedule_control = []
			frappe.model.with_doc("Project Initiation", frm.doc.project_name, function() {
		        var tabletransfer= frappe.model.get_doc("Project Initiation", frm.doc.project_name)
		        frm.doc.project_payment_schedule_control = []
	            frm.refresh_field("project_payment_schedule_control");
		        $.each(tabletransfer.project_payment_schedule, function(index, row){
		            d = frm.add_child("project_payment_schedule_control");
		            d.scope_item = row.scope_item;
		            d.from_date = row.from_date;
		            d.items_value = row.items_value;
		            d.billing_percentage = row.billing_percentage;
		            d.number_of_invoices = row.number_of_invoices;
		            d.vat = row.vat;
		            d.vat_value = row.vat_value;
		            d.total_billing_value = row.total_billing_value;
		            d.remaining_billing_value = row.remaining_billing_value;
		            d.remaining_billing_percent = row.remaining_billing_percent;
		            d.date_period = row.date_period;
		            d.to_date = row.to_date;
		            d.billing_value = row.billing_value;
		            d.when = row.when;
		            d.description_when = row.description_when;
		            d.billing_status = row.billing_status;
		            d.sales_invoice = row.sales_invoice;
		            frm.refresh_field("project_payment_schedule_control");
		        });
		        cur_frm.set_value("sales_order", tabletransfer.sales_order)
		    })
		}
	}
});


