// Copyright (c) 2018, s and contributors
// For license information, please see license.txt

frappe.ui.form.on('Project Billing Control', {
	// validate: function(frm) {
	// 	arr=[]
	// 	for(row= 0;row<cur_frm.doc.project_payment_schedule_control.length;row++){
	// 			if(cur_frm.doc.project_payment_schedule_control[row].invoice == 1){
	// 				arr.push(cur_frm.doc.project_payment_schedule_control[row].name)
	// 			}
	// 	}
	// 	console.log(arr.length)

	// },
	refresh: function(frm,cdt,cdn) {
		frm.add_custom_button(__("Make Invoice"), function () {
			// items = []
			for(row= 0;row<cur_frm.doc.project_payment_schedule_control.length;row++){
				if(cur_frm.doc.project_payment_schedule_control[row].invoice == 1){
					// items.push(cur_frm.doc.project_payment_schedule_control[row].scope_item)
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

					var due_date = ''
					if(cur_frm.doc.project_payment_schedule_control[row].date_period=='Date'){
						due_date = cur_frm.doc.project_payment_schedule_control[row].when
					}else if(cur_frm.doc.project_payment_schedule_control[row].date_period=='Period'){
						due_date = cur_frm.doc.project_payment_schedule_control[row].to_date
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
						sales_invoice=0
					}


					frappe.call({
			            "method": "make_invoice",
			            doc: cur_frm.doc,
			            args: { "scope_item": scope_item,"project_name": project_name,
			            		"items_value": items_value,"billing_percentage": billing_percentage,
			            		"due_date": due_date,"description_when":description_when,"vat_value":vat_value,
			            		"billing_state":billing_status,"sales_invoice":sales_invoice},
			            callback: function (r) {
		                    console.log(r.message)

		                    invoice_name = r.message
     						$.each(frm.doc.project_payment_schedule_control || [], function(i, v) {
     							if(v.invoice){
	     							frappe.model.set_value(v.doctype, v.name, "sales_invoice", invoice_name)
	     						


	     							frappe.call({
							            "method": "updat_init_payment_table_invoice",
							            doc: cur_frm.doc,
							            args: {"itm": v.scope_item,"idx": v.idx,"sales_invoice":invoice_name},
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




    	frm.add_custom_button(__("Make Delivery Note"), function () {
			// items = []
			for(row= 0;row<cur_frm.doc.project_payment_schedule_control.length;row++){
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

					frappe.call({
			            "method": "make_delivery_note",
			            doc: cur_frm.doc,
			            args: { "scope_item": scope_item,"project_name": project_name,
			            		"items_value": items_value,"billing_percentage": billing_percentage,
			            		"description_when":description_when,"vat_value":vat_value,"billing_state":billing_status},
			            callback: function (r) {
			            	delivery_note_name = r.message
     						$.each(frm.doc.project_payment_schedule_control || [], function(i, v) {
     							if(v.invoice){
     								frappe.model.set_value(v.doctype, v.name, "billing_status", 1)
	     							frappe.model.set_value(v.doctype, v.name, "delivery_note", delivery_note_name)
	     						


	     							frappe.call({
							            "method": "updat_init_payment_table",
							            doc: cur_frm.doc,
							            args: {"itm": v.scope_item,"idx": v.idx,"delivery_note":delivery_note_name},
							            callback: function (r) {
							            	if(r.message){
							            		console.log(r.message)
		     								}

						                }
							        });


	     							// frappe.call({
							      //       "method": "get_init_payment_name",
							      //       doc: cur_frm.doc,
							      //       args: {"itm": v.scope_item,"idx": v.idx,"delivery_note":delivery_note_name},
							      //       callback: function (r) {
							      //       	if(r.message){

								     //        	frappe.model.set_value('Project Payment Schedule', r.message, "billing_status", 1)
		     						// 			frappe.model.set_value('Project Payment Schedule', r.message, "delivery_note", delivery_note_name)
		     						// 		}

						       //          }
							      //   });


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
		            d.delivery_note = row.delivery_note;
		            d.sales_invoice = row.sales_invoice;
		            frm.refresh_field("project_payment_schedule_control");
		        });
		    })
		}
	}
});
